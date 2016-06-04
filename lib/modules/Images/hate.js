'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Hate = function (_BaseCommand) {
  _inherits(Hate, _BaseCommand);

  function Hate() {
    _classCallCheck(this, Hate);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Hate).apply(this, arguments));
  }

  _createClass(Hate, [{
    key: 'createImage',
    value: function createImage(input) {
      var _this2 = this;

      var text = ['I hate', 'you,', input.match(/.{1,8}/g).join('-\n'), '-chan!'].join('\n');

      (0, _gm2.default)(_path2.default.join(process.cwd(), 'db/images/hate.png')).font(_path2.default.join(process.cwd(), 'db/fonts/animeace.ttf'), 13.5).gravity('Center').drawText(-67, 32, text).write(_path2.default.join(process.cwd(), 'db/images/' + this.message.id + '.png'), function (err) {
        if (err) {
          _this2.logger.error('Error occurred while writing file from GM command \'hate\' ' + ('with text ' + text), err);
          _this2.reply('Error: Unable to write image with text ' + text + '\n' + err);
          return;
        }
        _this2.upload(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'), 'hate.png').then(function () {
          _fs2.default.unlink(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'));
        }).catch(function (err) {
          _this2.logger.error('Error occurred while uploading file from GM command \'hate\' ' + ('with text ' + text), err);
          _this2.reply('Error: Unable to upload image with text ' + text + '\n' + err);
          return;
        });
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^hate$/i, function () {
        _this3.createImage(_this3.sender.name);
      });

      this.responds(/^hate (.+)$/i, function (matches) {
        var content = _lodash2.default.trim(matches[1].replace(/<@!*(\d+)>/gi, function (match, p1) {
          var user = _this3.client.users.get('id', p1);
          if (user) {
            return user.name;
          }
          return match;
        }));
        _this3.createImage(content);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'hate';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'I-I hate you!';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**hate** [text] - I-I hate you, <text>!']];
    }
  }]);

  return Hate;
}(_BaseCommand3.default);

module.exports = Hate;
//# sourceMappingURL=hate.js.map
