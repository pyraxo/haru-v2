jsonfile = require 'jsonfile'
_ = require 'lodash'

class Datalist
  constructor: (@filename)->
    try
      @db = jsonfile.readFileSync @filename
    catch
      @db = []
      @save

  getAll: ->
    @db

  push: (val) ->
    @db.push val
    @save()

  has: (val) ->
    @db.indexOf(val) > -1

  del: (val) ->
    _.pull @db, val
    @save()

  save: (cb) ->
    if @filename?
      jsonfile.writeFile @filename, @db, { spaces: 2 }, (err) ->
        if err? then cb? err

module.exports = Datalist
