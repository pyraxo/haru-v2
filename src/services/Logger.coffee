winston = require 'winston'
path = require 'path'
fs = require 'fs'
moment = require 'moment'

logsPath = path.join process.cwd(), 'logs'

Logger = (debug, filename) ->
  if !fs.existsSync logsPath then fs.mkdirSync logsPath
  transports = [
    new winston.transports.Console({
      level: if debug then 'silly' else 'verbose',
      timestamp: ->
        moment().format 'YYYY-MM-DD hh:mm:ss a'
    }),
    new winston.transports.File({
      filename: "#{logsPath}/#{filename || moment().format 'YYYY-MM-DD HHmm'}.json",
      colorize: false,
      timestamp: true,
      json: true
    })
  ]
  logger = new (winston.Logger)({
    exitOnError: !debug,
    transports: transports
  })
  logger.cli()
  logger

module.exports = Logger
