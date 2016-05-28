var Bot, Container, FDB, Loader, Logger, chalk, createResolver, path;

createResolver = require('options-resolver');

chalk = require('chalk');

path = require('path');

Container = require('./util/Container');

FDB = require('./util/FlatDatabase');

Logger = require('./services/Logger');

Loader = require('./services/Loader');

Bot = (function() {
  function Bot(params) {
    var resolver;
    params = params || new FDB(path.join(process.cwd(), 'config/discord.json'));
    resolver = this.buildResolver();
    resolver.resolve(params).then((function(_this) {
      return function() {
        return _this.container = _this.buildContainer(params);
      };
    })(this))["catch"](function(err) {
      return this.logger.error('Error resolving params', err);
    });
  }

  Bot.prototype.buildResolver = function() {
    var resolver;
    resolver = createResolver().setDefaults({
      'prefix': '!',
      'admins': [],
      'debug': false
    }).setRequired(['token', 'prefix']).setAllowedTypes('prefix', 'string').setAllowedTypes('admins', 'array').setAllowedTypes('token', 'string').setAllowedTypes('debug', 'boolean');
    return resolver;
  };

  Bot.prototype.buildContainer = function(params) {
    this.logger = new Logger(params['debug']);
    this.container = new Container({
      logger: this.logger,
      params: params
    });
    return this.run();
  };

  Bot.prototype.run = function() {
    var loader;
    this.logger.info(("Starting " + (chalk.cyan('fuyu')) + " ") + ("v" + (process.env.npm_package_version || '1.0.0')));
    loader = new Loader(this.container);
    loader.start();
    return loader.on('ready', function() {
      return this.logger.info('Bot is connecting, awaiting messages');
    });
  };

  return Bot;

})();

module.exports = Bot;

//# sourceMappingURL=Bot.js.map
