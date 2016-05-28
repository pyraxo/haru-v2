'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MESSAGE_CHAR_LIMIT = 2000;
var MESSAGE_RATE_LIMIT = 10;

var BaseCommand = function () {
  function BaseCommand(message, client, container) {
    _classCallCheck(this, BaseCommand);

    if (this.constructor === BaseCommand) {
      throw new Error('Can\'t instantiate abstract command!');
    }
    this.message = message;
    this.client = client;
    this.container = container;
    this.logger = container.get('logger');
    this.init();
  }

  _createClass(BaseCommand, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'wrongUsage',
    value: function wrongUsage(name) {
      this.reply('Please run `' + this.prefix + 'help ' + name + '` to use this command properly');
    }
  }, {
    key: 'reply',
    value: function reply(content, options) {
      if (!this.isPM) {
        content = this.sender.mention() + ', ' + content;
      }
      return this.send(this.message, content, options);
    }
  }, {
    key: 'send',
    value: function send(dest, content) {
      var _this = this;

      var options = arguments.length <= 2 || arguments[2] === undefined ? { delay: 0, deleteDelay: 0 } : arguments[2];

      //  Not sure if destructuring works
      var delay = options.delay;
      var deleteDelay = options.deleteDelay;

      if (content.length > MESSAGE_RATE_LIMIT * MESSAGE_CHAR_LIMIT) {
        return this.logger.error('Error sending a message larger than the character and rate limit\n' + content);
      }

      if (delay) {
        return setTimeout(function () {
          _this.send(dest, content, { delay: 0, deleteDelay: deleteDelay });
        }, delay);
      }

      var msgRem = '';
      if (content.length > 2000) {
        content = content.match(/.{1,20000}/g);
        msgRem = content.shift();
        content = content.join('');
      }

      return new Promise(function (res, rej) {
        _this.client.sendMessage(dest, content, function (err, msg) {
          if (err) return rej(err);

          if (deleteDelay) {
            _this.client.deleteMessage(msg, { wait: deleteDelay }, function (err) {
              if (err) return rej(err);
              if (!msgRem) res(msg);
            });

            if (!msgRem) return;
          }

          if (msgRem) {
            return _this.send(dest, msgRem, options).then(function (msg) {
              return res(Array.isArray(msg) ? msg.concat(msg) : [msg]);
            }).catch(rej);
          }

          res(msg);
        });
      });
    }
  }, {
    key: 'upload',
    value: function upload(attachment, name, channel) {
      var _this2 = this;

      channel = channel || this.channel;
      return new Promise(function (res, rej) {
        _this2.client.sendFile(channel, attachment, name).then(function (msg) {
          return res(msg);
        }).catch(function (err) {
          return rej(err);
        });
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      throw new Error('Commands must override message handler');
    }
  }, {
    key: 'checkPrivateAndAdminOnly',
    value: function checkPrivateAndAdminOnly() {
      if (this.noPrivate && this.isPM) {
        this.reply('This command cannot be run via PMs.');
        return false;
      }
      if (this.adminOnly === true && !this.isAdmin) {
        return false;
      }

      return true;
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint(regex, matches) {
      var commandInfo = _prettyjson2.default.render({
        Command: {
          time: this.time,
          sender: this.sender.username,
          server: typeof this.server === 'undefined' ? undefined : this.server.name,
          channel: typeof this.channel === 'undefined' ? undefined : this.channel.name,
          content: this.content,
          botMention: this.isBotMentioned,
          pm: this.isPM,
          regex: regex ? regex.toString() : '',
          matches: matches,
          mentions: this.mentions
        }
      });
      return commandInfo;
    }
  }, {
    key: 'getMatches',
    value: function getMatches(content, regex, cb, noPrint) {
      var matches = regex.exec(content);

      if (matches === null || !this.checkPrivateAndAdminOnly()) {
        return false;
      }

      var result = cb(matches);

      if (!noPrint && result !== false) {
        this.logger.debug('\n' + this.prettyPrint(regex, matches));
      }
    }
  }, {
    key: 'hears',
    value: function hears(regex, callback) {
      var noPrint = !this.container.get('debug');
      return this.getMatches(this.rawContent, regex, callback, noPrint);
    }
  }, {
    key: 'responds',
    value: function responds(regex, callback) {
      if (!this.isBotMentioned) {
        return;
      }
      var noPrint = !this.container.get('debug');
      return this.getMatches(this.content, regex, callback, noPrint);
    }
  }, {
    key: 'aliases',
    get: function get() {
      return [];
    }
  }, {
    key: 'hidden',
    get: function get() {
      return false;
    }
  }, {
    key: 'adminOnly',
    get: function get() {
      return false;
    }
  }, {
    key: 'noPrivate',
    get: function get() {
      return false;
    }
  }, {
    key: 'server',
    get: function get() {
      return this.message.channel.server;
    }
  }, {
    key: 'channel',
    get: function get() {
      return this.message.channel;
    }
  }, {
    key: 'time',
    get: function get() {
      return (0, _moment2.default)(this.message.timestamp).format('HH:mm:ss');
    }
  }, {
    key: 'sender',
    get: function get() {
      return this.message.sender;
    }
  }, {
    key: 'isBotMentioned',
    get: function get() {
      return this.rawContent.indexOf(this.prefix) === 0 || this.message.isMentioned(this.client.user) || this.isPM;
    }
  }, {
    key: 'isEveryoneMentioned',
    get: function get() {
      return this.message.everyoneMentioned;
    }
  }, {
    key: 'rawContent',
    get: function get() {
      return this.message.content;
    }
  }, {
    key: 'content',
    get: function get() {
      var content = this.rawContent;
      content = _lodash2.default.trim(content.replace(new RegExp('^(' + this.client.user.mention() + ')|(\\' + this.prefix + ')'), ''));
      return content;
    }
  }, {
    key: 'isPM',
    get: function get() {
      return this.message.channel.isPrivate;
    }
  }, {
    key: 'prefix',
    get: function get() {
      return this.container.getParam('prefix');
    }
  }, {
    key: 'mentions',
    get: function get() {
      var users = [];
      for (var idx in this.message.mentions) {
        if (this.message.mentions.hasOwnProperty(idx)) {
          var user = this.message.mentions[idx];
          if (typeof user.id !== 'undefined' && typeof user.username !== 'undefined') {
            users.push({
              id: user.id,
              name: user.username,
              mention: user.mention
            });
          }
        }
      }

      return users;
    }
  }, {
    key: 'isAdmin',
    get: function get() {
      return this.client.admins.indexOf(this.sender.id) > -1;
    }
  }, {
    key: 'user',
    get: function get() {
      return this.client.user;
    }
  }], [{
    key: 'name',
    get: function get() {
      throw new Error('Commands must have names');
    }
  }, {
    key: 'description',
    get: function get() {
      throw new Error('Commands must have descriptions');
    }
  }, {
    key: 'usage',
    get: function get() {
      return 'This command does not have a usage manual';
    }
  }]);

  return BaseCommand;
}();

module.exports = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map
