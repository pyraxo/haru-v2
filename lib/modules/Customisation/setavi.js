'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeBase64Image = require('node-base64-image');

var _nodeBase64Image2 = _interopRequireDefault(_nodeBase64Image);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SetAvatar = function (_BaseCommand) {
  _inherits(SetAvatar, _BaseCommand);

  function SetAvatar() {
    _classCallCheck(this, SetAvatar);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SetAvatar).apply(this, arguments));
  }

  _createClass(SetAvatar, [{
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^setavi (http\S+)$/, function (matches) {
        _nodeBase64Image2.default.base64encoder(matches[1], {
          string: true
        }, function (err, image) {
          if (err) {
            _this2.logger.error('Avatar change called by ' + _this2.sender.username + ' failed', err);
            return;
          }
          _this2.client.updateDetails({
            'avatar': new Buffer(image, 'base64')
          });
          _this2.logger.info('Avatar changed by ' + _this2.sender.username);
          _this2.send(_this2.channel, _this2.sender.mention() + ' changed my avatar. How do I look?');
        });
      });
    }
  }, {
    key: 'hidden',
    get: function get() {
      return true;
    }
  }, {
    key: 'adminOnly',
    get: function get() {
      return true;
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'setavi';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Changes the bot avatar';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['```', ['setavi <link> - Changes the bot\'s avatar to the image in the link provided'], '```'];
    }
  }]);

  return SetAvatar;
}(_BaseCommand3.default);

module.exports = SetAvatar;
//# sourceMappingURL=setavi.js.map
