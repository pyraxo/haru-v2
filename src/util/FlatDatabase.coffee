jsonfile = require 'jsonfile'
Container = require './Container'

class FDB extends Container
  constructor: (@filename) ->
    try
      @db = jsonfile.readFileSync @filename
    catch
      @db = {}
      @save()

module.exports = FDB
