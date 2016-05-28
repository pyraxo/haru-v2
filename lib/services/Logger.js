var Logger, fs, logsPath, moment, path, winston;

winston = require('winston');

path = require('path');

fs = require('fs');

moment = require('moment');

logsPath = path.join(process.cwd(), 'logs');

Logger = function(debug, filename) {
  var logger, transports;
  if (!fs.existsSync(logsPath)) {
    fs.mkdirSync(logsPath);
  }
  transports = [
    new winston.transports.Console({
      level: debug ? 'silly' : 'verbose',
      timestamp: function() {
        return moment().format('YYYY-MM-DD hh:mm:ss a');
      }
    }), new winston.transports.File({
      filename: logsPath + "/" + (filename || moment().format('YYYY-MM-DD HHmm')) + ".json",
      colorize: false,
      timestamp: true,
      json: true
    })
  ];
  logger = new winston.Logger({
    exitOnError: !debug,
    transports: transports
  });
  logger.cli();
  return logger;
};

module.exports = Logger;

//# sourceMappingURL=Logger.js.map
