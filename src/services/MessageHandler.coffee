path = require 'path'
rq = require 'require-all'
cr = require 'clear-require'

class MessageHandler
  constructor: (@container, @client) ->
    @modules = {}
    @logger = @container.get 'logger'
    @getModules()

  getModules: ->
    @modules = rq(path.join process.cwd(), 'lib/modules')
    for module of @modules
      for command of @modules[module]
        if typeof @modules[module][command] == 'object'
          delete @modules[module][command]

  reloadModules: ->
    cr.all()
    @getModules()

  handle: (msg) ->
    if msg.sender.id == @client.user.id then return false
    @checkModules msg

  checkModules: (msg) ->
    for module of @modules
      for idx of @modules[module]
        command = new @modules[module][idx](msg, @client, @container)
        try
          command.handle()
        catch err
          @logger.error "Error handling command #{@modules[module][idx].name}", err

module.exports = MessageHandler
