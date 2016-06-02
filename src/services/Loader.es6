import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { Client as Discord } from 'discord.js'
import { EventEmitter } from 'events'
import rq from 'require-all'

import MessageHandler from './MessageHandler'

class Loader extends EventEmitter {
  constructor (container) {
    super()
    this.container = container
    this.logger = container.get('logger')
    this.loaded = {
      discord: false,
      clients: false,
      config: false
    }
    this.on('loaded', () => {
      this.checkLoaded.bind(this)
    })
    this.failCheck = setTimeout(this.checkLoaded.bind(this), 30000)
  }

  start () {
    this.loadDiscord()
    this.on('loaded.discord', () => {
      this.loadClients()
    })
  }

  get isLoaded () {
    return this.loaded.discord && this.loaded.clients
  }

  setLoaded (type) {
    this.loaded[type] = true
    this.emit('loaded.' + type)
    this.emit('loaded')
  }

  checkLoaded (fail) {
    this.emit('checkLoaded')
    fail = typeof fail !== 'undefined'
    if (fail) {
      throw new Error(`Failed initialising. Loaded: ${JSON.stringify(this.loaded, null, 2)}`)
    }
    this.logger.debug('Loader status:', {
      Ready: this.isLoaded,
      Discord: this.loaded.discord,
      Clients: this.loaded.clients
    })

    clearTimeout(this.failCheck)
    delete this.failCheck
  }

  loadDiscord () {
    let token = this.container.getParam('token')
    let client = new Discord({ autoReconnect: true })
    let handler = new MessageHandler(this.container, client)

    client.on('ready', () => {
      this.container.set('discord', client)
      this.container.set('handler', handler)
      this.setLoaded('discord')
      let admins = this.container.getParam('admins')
      if (typeof admins !== 'undefined') {
        client.admins = admins
      }
      this.logger.info(
        `Connecting as ${chalk.red(client.user.name)} <@${client.user.id}>`
      )
      this.logger.info(
        `${client.servers.length} servers and ` +
        `${client.users.length} users in cache`
      )
      this.logger.info(`Prefix: '${this.container.getParam('prefix')}'`)
    })
    client.on('error', err => this.logger.error(err))
    client.on('warn', warn => this.logger.warn(warn))
    client.on('disconnect', () => {
      this.logger.info(`${chalk.red(client.user.name)} has been disconnected`)
    })
    if (this.container.getParam('debug') === true) {
      client.on('debug', msg => this.logger.debug(msg))
    }

    client.on('message', msg => handler.handle(msg))

    client.loginWithToken(token)
    .catch(err => this.logger.error('Error connecting with token', err))
  }

  loadClients () {
    let clients = rq(path.join(process.cwd(), 'lib/clients'))
    for (let Client in clients) {
      if (clients.hasOwnProperty(Client)) {
        Client = clients[Client]
        let client = new Client(this.container)
        try {
          client.run()
        } catch (err) {
          this.logger.error(`Error running client ${Client.name}`, err)
        }
        this.container.set(Client.name, client)
      }
    }
    this.setLoaded('clients')
  }
}

module.exports = Loader
