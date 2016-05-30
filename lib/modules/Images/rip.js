'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _nodeBase64Image = require('node-base64-image');

var _nodeBase64Image2 = _interopRequireDefault(_nodeBase64Image);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _ImageCacher = require('../.Cache/ImageCacher');

var _ImageCacher2 = _interopRequireDefault(_ImageCacher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RIP = function (_BaseCommand) {
  _inherits(RIP, _BaseCommand);

  function RIP() {
    _classCallCheck(this, RIP);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RIP).apply(this, arguments));
  }

  _createClass(RIP, [{
    key: 'createImage',
    value: function createImage(input) {
      var _this2 = this;

      input = input.match(/.+/g).join('-\n');
      (0, _gm2.default)(_path2.default.join(process.cwd(), 'db/images/rip.png')).font(_path2.default.join(process.cwd(), 'db/fonts/comicsans.ttf'), 21.5).gravity('Center').drawText(-10, 70, input).fontSize(11).drawText(-7, 94, Math.floor(Math.random() * (2016 - 1900) + 1) + ' - 2016').write(_path2.default.join(process.cwd(), 'db/images/' + this.message.id + '.png'), function (err) {
        if (err) {
          _this2.logger.error('Error occurred while writing file from GM command \'rip\'', err);
          _this2.reply('Error: Unable to write image\n' + err);
          return;
        }
        _this2.upload(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'), 'rip.png').then(function () {
          _fs2.default.unlink(_path2.default.join(process.cwd(), 'db/images/' + _this2.message.id + '.png'));
        }).catch(function (err) {
          _this2.logger.error('Error occurred while uploading file from GM command \'rip\'', err);
          _this2.reply('Error: Unable to upload image\n' + err);
          return;
        });
      });
    }
  }, {
    key: 'genImage',
    value: function genImage(image) {
      var _this3 = this;

      var canvas = new _canvas2.default(1920, 2160);
      var ctx = canvas.getContext('2d');
      var base = new _canvas.Image();
      base.src = new Buffer(image, 'base64');
      ctx.drawImage(base, 440, 0, 1000, 1000);
      _fs2.default.readFile(_path2.default.join(process.cwd(), 'db/images/rip2.png'), function (err, src) {
        if (err) {
          _this3.logger.error('Error reading alt rip base image', err);
          return;
        }
        var c = new _canvas.Image();
        c.src = src;
        ctx.drawImage(c, 0, 0, 1920, 2160);
        var out = _fs2.default.createWriteStream(_path2.default.join(process.cwd(), 'db/images/' + _this3.message.id + '.png'));
        var stream = canvas.pngStream();

        stream.on('data', function (chunk) {
          out.write(chunk);
        });

        stream.on('end', function () {
          setTimeout(function () {
            _this3.upload(_path2.default.join(process.cwd(), 'db/images/' + _this3.message.id + '.png'), 'dead.png').then(function () {
              _fs2.default.unlink(_path2.default.join(process.cwd(), 'db/images/' + _this3.message.id + '.png'));
            });
          }, 500);
        });
      });
    }
  }, {
    key: 'altImage',
    value: function altImage(user) {
      var _this4 = this;

      if (_ImageCacher2.default.has(user.id)) {
        console.log(_ImageCacher2.default.get(user.id));
        this.genImage(_ImageCacher2.default.get(user.id));
      } else {
        _nodeBase64Image2.default.base64encoder(user.avatarURL, { string: true }, function (err, image) {
          if (err) {
            _this4.logger.error('Image fetch from ' + user.avatarURL + ' failed', err);
            return;
          }
          _ImageCacher2.default.add(user.id, image);
          _this4.genImage(image);
        });
      }
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this5 = this;

      this.responds(/^rip$/i, function () {
        if (Math.random() < 0.5) {
          _this5.createImage(_this5.sender.name);
        } else {
          _this5.altImage(_this5.sender);
        }
      });

      this.responds(/^rip <@!*(\d+)>$/i, function (matches) {
        var user = _this5.client.users.get('id', matches[1]);
        if (Math.random() < 0.5) {
          var name = user ? user.name : '<@' + matches[1] + '>';
          _this5.createImage(name);
        } else {
          if (user) {
            _this5.altImage(_this5.sender);
          }
        }
      });

      this.responds(/^rip ("|')(.+)\1$/i, function (matches) {
        _this5.createImage(matches[2]);
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'rip';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Rest in peace';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**rip** [text] - Here lies a dead soul']];
    }
  }]);

  return RIP;
}(_BaseCommand3.default);

module.exports = RIP;
//# sourceMappingURL=rip.js.map
