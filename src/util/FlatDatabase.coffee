jsonfile = require 'jsonfile'
Container = require './Container'

class FDB extends Container
  constructor: (@filename) ->
    @db = jsonfile.readFileSync @filename

module.exports = FDB
