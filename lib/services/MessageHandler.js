var MessageHandler, cr, path, rq;

path = require('path');

rq = require('require-all');

cr = require('clear-require');

MessageHandler = (function() {
  function MessageHandler(container, client) {
    this.container = container;
    this.client = client;
    this.modules = {};
    this.logger = this.container.get('logger');
    this.getModules();
  }

  MessageHandler.prototype.getModules = function() {
    var command, module, results;
    this.modules = rq(path.join(process.cwd(), 'lib/modules'));
    results = [];
    for (module in this.modules) {
      results.push((function() {
        var results1;
        results1 = [];
        for (command in this.modules[module]) {
          if (typeof this.modules[module][command] === 'object') {
            results1.push(delete this.modules[module][command]);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  MessageHandler.prototype.reloadModules = function() {
    cr.all();
    return this.getModules();
  };

  MessageHandler.prototype.handle = function(msg) {
    if (msg.sender.id === this.client.user.id) {
      return false;
    }
    return this.checkModules(msg);
  };

  MessageHandler.prototype.checkModules = function(msg) {
    var command, err, idx, module, results;
    results = [];
    for (module in this.modules) {
      results.push((function() {
        var error, results1;
        results1 = [];
        for (idx in this.modules[module]) {
          command = new this.modules[module][idx](msg, this.client, this.container);
          try {
            results1.push(command.handle());
          } catch (error) {
            err = error;
            results1.push(this.logger.error("Error handling command " + this.modules[module][idx].name, err));
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  return MessageHandler;

})();

module.exports = MessageHandler;

//# sourceMappingURL=MessageHandler.js.map
