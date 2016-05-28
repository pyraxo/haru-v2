'use strict'
const path = require('path')

const Bot = require('./lib/Bot')
const FDB = require('./lib/util/FlatDatabase')

const CONFIG_PATH = path.join(__dirname, 'config')
const options = new FDB(path.join(CONFIG_PATH, 'discord.json'))

let client = new Bot(options.getAll())
