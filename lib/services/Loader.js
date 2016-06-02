'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _discord = require('discord.js');

var _events = require('events');

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _MessageHandler = require('./MessageHandler');

var _MessageHandler2 = _interopRequireDefault(_MessageHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Loader = function (_EventEmitter) {
  _inherits(Loader, _EventEmitter);

  function Loader(container) {
    _classCallCheck(this, Loader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Loader).call(this));

    _this.container = container;
    _this.logger = container.get('logger');
    _this.loaded = {
      discord: false,
      clients: false,
      config: false
    };
    _this.on('loaded', function () {
      _this.checkLoaded.bind(_this);
    });
    _this.failCheck = setTimeout(_this.checkLoaded.bind(_this), 30000);
    return _this;
  }

  _createClass(Loader, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      this.loadDiscord();
      this.on('loaded.discord', function () {
        _this2.loadClients();
      });
    }
  }, {
    key: 'setLoaded',
    value: function setLoaded(type) {
      this.loaded[type] = true;
      this.emit('loaded.' + type);
      this.emit('loaded');
    }
  }, {
    key: 'checkLoaded',
    value: function checkLoaded(fail) {
      this.emit('checkLoaded');
      fail = typeof fail !== 'undefined';
      if (fail) {
        throw new Error('Failed initialising. Loaded: ' + JSON.stringify(this.loaded, null, 2));
      }
      this.logger.debug('Loader status:', {
        Ready: this.isLoaded,
        Discord: this.loaded.discord,
        Clients: this.loaded.clients
      });

      clearTimeout(this.failCheck);
      delete this.failCheck;
    }
  }, {
    key: 'loadDiscord',
    value: function loadDiscord() {
      var _this3 = this;

      var token = this.container.getParam('token');
      var client = new _discord.Client({ autoReconnect: true });
      var handler = new _MessageHandler2.default(this.container, client);

      client.on('ready', function () {
        _this3.container.set('discord', client);
        _this3.container.set('handler', handler);
        _this3.setLoaded('discord');
        var admins = _this3.container.getParam('admins');
        if (typeof admins !== 'undefined') {
          client.admins = admins;
        }
        _this3.logger.info('Connecting as ' + _chalk2.default.red(client.user.name) + ' <@' + client.user.id + '>');
        _this3.logger.info(client.servers.length + ' servers and ' + (client.users.length + ' users in cache'));
        _this3.logger.info('Prefix: \'' + _this3.container.getParam('prefix') + '\'');
      });
      client.on('error', function (err) {
        return _this3.logger.error(err);
      });
      client.on('warn', function (warn) {
        return _this3.logger.warn(warn);
      });
      client.on('disconnect', function () {
        _this3.logger.info(_chalk2.default.red(client.user.name) + ' has been disconnected');
      });
      if (this.container.getParam('debug') === true) {
        client.on('debug', function (msg) {
          return _this3.logger.debug(msg);
        });
      }

      client.on('message', function (msg) {
        return handler.handle(msg);
      });

      client.loginWithToken(token).catch(function (err) {
        return _this3.logger.error('Error connecting with token', err);
      });
    }
  }, {
    key: 'loadClients',
    value: function loadClients() {
      var clients = (0, _requireAll2.default)(_path2.default.join(process.cwd(), 'lib/clients'));
      for (var Client in clients) {
        if (clients.hasOwnProperty(Client)) {
          Client = clients[Client];
          var client = new Client(this.container);
          try {
            client.run();
          } catch (err) {
            this.logger.error('Error running client ' + Client.name, err);
          }
          this.container.set(Client.name, client);
        }
      }
      this.setLoaded('clients');
    }
  }, {
    key: 'isLoaded',
    get: function get() {
      return this.loaded.discord && this.loaded.clients;
    }
  }]);

  return Loader;
}(_events.EventEmitter);

module.exports = Loader;
//# sourceMappingURL=Loader.js.map
