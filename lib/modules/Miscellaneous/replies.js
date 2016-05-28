'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _escapeStringRegexp = require('escape-string-regexp');

var _escapeStringRegexp2 = _interopRequireDefault(_escapeStringRegexp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _FlatDatabase = require('../../util/FlatDatabase');

var _FlatDatabase2 = _interopRequireDefault(_FlatDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var replies = new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'db/replies/replies.json')).getAll();
var channels = new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'db/replies/reply_channels.json')).getAll();

var Replies = function (_BaseCommand) {
  _inherits(Replies, _BaseCommand);

  function Replies() {
    _classCallCheck(this, Replies);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Replies).apply(this, arguments));
  }

  _createClass(Replies, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      Object.keys(replies).forEach(function (elem) {
        _this2.hearExpression(elem);
      });
    }
  }, {
    key: 'replaceString',
    value: function replaceString(string) {
      var replacements = {
        '%sender%': this.sender.username,
        '%server%': this.server.name,
        '%channel%': this.channel.name
      };
      for (var str in replacements) {
        if (replacements.hasOwnProperty(str)) {
          string = string.replace(str, replacements[str]);
        }
      }
      return string;
    }
  }, {
    key: 'hearExpression',
    value: function hearExpression(exp) {
      var _this3 = this;

      this.hears(new RegExp('^' + (0, _escapeStringRegexp2.default)(exp) + '$', 'i'), function () {
        if (channels.indexOf(_this3.channel.id) === -1) return;
        var reply = '';
        var r = replies[exp];
        if (Array.isArray(replies[exp])) {
          reply = r[Math.floor(Math.random() * r.length)];
        } else {
          reply = r;
        }
        _this3.send(_this3.channel, _this3.replaceString(reply));
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this4 = this;

      this.responds(/^replies list$/i, function () {
        var reply = [];
        for (var exp in replies) {
          reply.push(exp);
        }
        _this4.reply(['List of expressions that will trigger a reply:', '`ayy, ' + reply.join(', ') + '`'].join('\n'));
      });

      this.responds(/^replies$/i, function () {
        if (channels.indexOf(_this4.channel.id) > -1) {
          _lodash2.default.pull(channels, _this4.channel.id);
          _this4.reply('Banned replies on this channel.');
        } else {
          channels.push(_this4.channel.id);
          _this4.reply('Allowed replies on this channel.');
        }
      });

      this.hears(/^ay(y+)$/i, function (matches) {
        if (channels.indexOf(_this4.channel.id) === -1) return;
        _this4.send(_this4.channel, 'lma' + Array(matches[1].length + 1).join('o'));
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'replies';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Replies to certain keywords';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**replies** - Toggles replies', '**replies list** - Lists replies']];
    }
  }]);

  return Replies;
}(_BaseCommand3.default);

module.exports = Replies;
//# sourceMappingURL=replies.js.map
