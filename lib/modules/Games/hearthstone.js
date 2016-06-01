'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _nodeBase64Image = require('node-base64-image');

var _nodeBase64Image2 = _interopRequireDefault(_nodeBase64Image);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Hearthstone = require('../.Cache/Hearthstone');

var _Hearthstone2 = _interopRequireDefault(_Hearthstone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var canvas = new _canvas2.default(2700, 1615);
var ctx = canvas.getContext('2d');

var src = _fs2.default.readFileSync(_path2.default.join(process.cwd(), 'db/images/packs.png'));
var base = new _canvas.Image();
base.src = src;
ctx.drawImage(base, 0, 0, base.width, base.height);

var Hearthstone = function (_BaseCommand) {
  _inherits(Hearthstone, _BaseCommand);

  function Hearthstone() {
    _classCallCheck(this, Hearthstone);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Hearthstone).apply(this, arguments));
  }

  _createClass(Hearthstone, [{
    key: 'openCards',
    value: function openCards(cards) {
      var pack = [];

      var _loop = function _loop() {
        var num = Math.floor(Math.random() * 10000) + 1;
        if (pack.length === 4 && _lodash2.default.filter(cards, ['rarity', 'Common']).length === 4) {
          num = Math.floor(Math.random() * 10000 - 7166) + 7166;
        }
        var rarity = null;
        var golden = false;
        if (num <= 7037) {
          rarity = 'Common';
        } else if (num > 7038 && num <= 9196) {
          rarity = 'Rare';
        } else if (num > 9197 && num <= 9604) {
          rarity = 'Epic';
        } else if (num > 9605 && num <= 9752) {
          rarity = 'Legendary';
        } else if (num > 9753 && num < 9879) {
          rarity = 'Common';
          golden = true;
        } else if (num > 9880 && num < 9973) {
          rarity = 'Rare';
          golden = true;
        } else if (num > 9974 && num < 9992) {
          rarity = 'Epic';
          golden = true;
        } else if (num > 9993 && num < 10000) {
          rarity = 'Legendary';
          golden = true;
        }
        var list = _lodash2.default.filter(cards, ['rarity', rarity]);
        var sample = function sample() {
          var card = _lodash2.default.sample(list);
          if (card.rarity === rarity) {
            pack.push({
              card: card,
              golden: golden
            });
          } else {
            sample();
          }
        };
        sample();
      };

      while (pack.length < 5) {
        _loop();
      }
      this.drawImage(pack);
    }
  }, {
    key: 'drawImage',
    value: function drawImage(cards) {
      var _this2 = this;

      var pack = [];
      var fetch = function fetch(elem, q, local) {
        _nodeBase64Image2.default.base64encoder(q, {
          string: true,
          localFile: local
        }, function (err, image) {
          if (err) {
            return _this2.logger.error('Image fetch from ' + elem.img + ' failed', err);
          }
          var c = new _canvas.Image();
          c.src = new Buffer(image, 'base64');
          pack.push(c);
        });
      };
      cards.forEach(function (elem, idx) {
        var q = null;
        if (elem.golden) {
          (function () {
            var file = _path2.default.join(process.cwd(), 'db/images/golden/' + elem.card.cardId + '.png');
            if (_fs2.default.existsSync(file)) {
              q = file;
              fetch(elem, q, false);
            } else {
              (0, _gm2.default)(elem.card.imgGold + '[0]').write(file, function (err) {
                if (err) {
                  _this2.logger.error('Error saving golden card ' + elem.card.cardId, err);
                  return;
                }
                q = file;
                fetch(elem, q, true);
              });
            }
          })();
        } else {
          q = elem.card.img;
          fetch(elem, q, false);
        }
      });
      var check = function check(arr) {
        if (arr.length === 5) {
          _this2.saveFile(pack);
        } else {
          setTimeout(function () {
            check(pack);
          }, 500);
        }
      };
      check(pack);
    }
  }, {
    key: 'saveFile',
    value: function saveFile(pack) {
      var _this3 = this;

      var coords = [{
        x: 1150,
        y: 870
      }, {
        x: 1732,
        y: 870
      }, {
        x: 943,
        y: 145
      }, {
        x: 1433,
        y: 20
      }, {
        x: 1973,
        y: 145
      }];
      pack.forEach(function (c, idx) {
        ctx.drawImage(c, coords[idx].x, coords[idx].y, 480, 750);
      });
      var out = _fs2.default.createWriteStream(_path2.default.join(process.cwd(), 'db/images/' + this.message.id + '.png'));
      var stream = canvas.pngStream();

      stream.on('data', function (chunk) {
        out.write(chunk);
      });

      stream.on('end', function () {
        setTimeout(function () {
          _this3.sendPack();
        }, 500);
      });
    }
  }, {
    key: 'sendPack',
    value: function sendPack() {
      var _this4 = this;

      this.upload(_path2.default.join(process.cwd(), 'db/images/' + this.message.id + '.png'), 'pack.png').then(function () {
        _this4.client.updateMessage(_this4.toUpdate, 'Pack opened, ' + _this4.sender.mention() + '!');
        _fs2.default.unlink(_path2.default.join(process.cwd(), 'db/images/' + _this4.message.id + '.png'));
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this5 = this;

      this.responds(/^hs$/i, function (matches) {
        _this5.reply('Opening a **Classic** Hearthstone pack...').then(function (msg) {
          _this5.toUpdate = msg;
        });
        _this5.openCards(_Hearthstone2.default.getCardSet());
      });

      this.responds(/^hs gvg$/i, function (matches) {
        _this5.reply('Opening a **Goblins vs Gnomes** Hearthstone pack...').then(function (msg) {
          _this5.toUpdate = msg;
        });
        _this5.openCards(_Hearthstone2.default.getCardSet('Goblins vs Gnomes'));
      });

      this.responds(/^hs wotog$/i, function (matches) {
        _this5.reply('Opening a **Whispers of the Old Gods** Hearthstone pack...').then(function (msg) {
          _this5.toUpdate = msg;
        });
        _this5.openCards(_Hearthstone2.default.getCardSet('Whispers of the Old Gods'));
      });

      this.responds(/^hs tgt$/i, function (matches) {
        _this5.reply('Opening a **The Grand Tournament** Hearthstone pack...').then(function (msg) {
          _this5.toUpdate = msg;
        });
        _this5.openCards(_Hearthstone2.default.getCardSet('The Grand Tournament'));
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'hs';
    }
  }, {
    key: 'aliases',
    get: function get() {
      return ['hearthstone'];
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Opens a new Hearthstone pack';
    }
  }, {
    key: 'usage',
    get: function get() {
      return ['- Opens a new Classic Hearthstone pack', 'gvg - Opens a new GoG HS pack', 'wotog - Opens a new WotOG pack'];
    }
  }]);

  return Hearthstone;
}(_BaseCommand3.default);

module.exports = Hearthstone;
//# sourceMappingURL=hearthstone.js.map
