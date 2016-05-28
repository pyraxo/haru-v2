createResolver = require 'options-resolver'
chalk = require 'chalk'
path = require 'path'

Container = require './util/Container'
FDB = require './util/FlatDatabase'
Logger = require './services/Logger'
Loader = require './services/Loader'

class Bot
  constructor: (params) ->
    params = params || new FDB(path.join process.cwd(), 'config/discord.json')
    resolver = @buildResolver()
    resolver.resolve(params)
    .then(=>
      @container = @buildContainer(params))
    .catch((err) ->
      @logger.error 'Error resolving params', err)

  buildResolver: ->
    resolver = createResolver()
    .setDefaults({
      'prefix': '!'
      'admins': []
      'debug': false
    })
    .setRequired([
      'token'
      'prefix'
    ])
    .setAllowedTypes('prefix', 'string')
    .setAllowedTypes('admins', 'array')
    .setAllowedTypes('token', 'string')
    .setAllowedTypes('debug', 'boolean')
    resolver

  buildContainer: (params) ->
    @logger = new Logger(params['debug'])
    @container = new Container({
      logger: @logger
      params: params
    })
    @run()

  run: ->
    @logger.info "Starting #{chalk.cyan 'fuyu'} " +
    "v#{process.env.npm_package_version || '1.0.0'}"
    loader = new Loader(@container)
    loader.start()
    loader.on 'ready', ->
      @logger.info 'Bot is connecting, awaiting messages'

module.exports = Bot
