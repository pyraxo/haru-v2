jsonfile = require 'jsonfile'

class Container
  constructor: (options)->
    @db = options ? options : { params: {} }

  getAll: ->
    @db

  has: (key) ->
    typeof @db[key] != 'undefined'

  get: (key) ->
    @db[key]

  set: (key, val, cb) ->
    @db[key] = val
    @save()
    cb? @db

  del: (key, cb) ->
    if @has key
      delete @db[key]
      @save()
      cb? @db
    else false

  save: (cb) ->
    if @filename?
      jsonfile.writeFile @filename, @db, { spaces: 2 }, (err) ->
        if err? then cb? err

  hasParam: (key) ->
    typeof @db.params[key] != 'undefined'

  getParam: (key) ->
    @db.params[key]

  setParam: (key, val, cb) ->
    @db.params[key] = val
    @save()
    cb? @db.params

  delParam: (key, cb) ->
    if @hasParam key
      delete @db.params[key]
      @save()
      cb? @db
    else false

module.exports = Container
