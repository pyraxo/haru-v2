'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sample = ['discord', 'doge', 'haru', 'gay', 'fag', 'command', 'pictures'];

var DogeGM = function (_BaseCommand) {
  _inherits(DogeGM, _BaseCommand);

  function DogeGM() {
    _classCallCheck(this, DogeGM);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DogeGM).apply(this, arguments));
  }

  _createClass(DogeGM, [{
    key: 'randX',
    value: function randX() {
      var x = Math.floor(Math.random() * 1200);
      if (x > 1000) {
        x -= 200;
      }
      return x;
    }
  }, {
    key: 'randY',
    value: function randY() {
      return Math.floor(Math.random() * 600) + 250;
    }
  }, {
    key: 'modifyArr',
    value: function modifyArr(input) {
      if (input.length > 4) {
        var i = input.length;
        while (i > 4) {
          input.splice(Math.floor(Math.random() * input.length), 1);
          i--;
        }
      } else if (input.length < 4) {
        var _i = input.length;
        while (_i < 4) {
          input.push(sample[Math.floor(Math.random() * sample.length)]);
          _i++;
        }
      }
      return input;
    }
  }, {
    key: 'error',
    value: function error(err, text) {
      text = text || '';
      this.logger.error('Error occurred while uploading file from GM command \'hate\' ' + ('with text ' + text), err);
      return this.reply('Error: Unable to upload image with text ' + text);
    }
  }, {
    key: 'createImage',
    value: function createImage(res) {
      var _this2 = this;

      (0, _gm2.default)(_path2.default.join(process.cwd(), 'db/images/doge.jpg')).font(_path2.default.join(process.cwd(), 'db/fonts/comicsans.ttf'), 100).fill('#ff0000').drawText(this.randX(), this.randY(), 'such ' + res[0]).fill('#00ff00').drawText(this.randX(), this.randY(), 'much ' + res[1]).fill('#0000ff').drawText(this.randX(), this.randY(), 'many ' + res[2]).fill('#ee00ee').drawText(this.randX(), this.randY(), 'very ' + res[3]).write(_path2.default.join(process.cwd(), 'db/images/' + this.message.id + '.png'), function (err) {
        if (err) {
          _this2.error(err, res.join(', '));
        }
        _this2.upload(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'), 'doge.png').then(function () {
          _fs2.default.unlink(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'));
        }).catch(function (err) {
          _this2.error(err, res.join(', '));
        });
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this3 = this;

      this.responds(/^doge$/i, function () {
        var input = [];
        _this3.client.getChannelLogs(_this3.channel, 10).then(function (msgs) {
          var res = [];
          for (var msg in msgs) {
            if (typeof msgs[msg].content === 'string') {
              res = res.concat(msgs[msg].content.match(/\w+/g));
            }
          }
          input = res.filter(function (elem, idx, arr) {
            return elem !== undefined && arr.indexOf(elem) === idx;
          });
          return _this3.createImage(_this3.modifyArr(input));
        }).catch(_this3.error);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'doge';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'such doge, much wow';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**doge** - wow']];
    }
  }]);

  return DogeGM;
}(_BaseCommand3.default);

module.exports = DogeGM;
//# sourceMappingURL=doge.js.map
