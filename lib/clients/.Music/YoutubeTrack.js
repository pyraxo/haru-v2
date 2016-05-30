'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Track2 = require('./Track');

var _Track3 = _interopRequireDefault(_Track2);

var _ytdlCore = require('ytdl-core');

var _ytdlCore2 = _interopRequireDefault(_ytdlCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YoutubeTrack = function (_Track) {
  _inherits(YoutubeTrack, _Track);

  function YoutubeTrack(id, author, logger, callback) {
    _classCallCheck(this, YoutubeTrack);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(YoutubeTrack).call(this, {
      url: 'http://www.youtube.com/?v=' + id,
      addedBy: author
    }));

    _this.logger = logger;
    _ytdlCore2.default.getInfo(_this.url, {
      filter: function filter(format) {
        return format.container === 'mp4';
      }, quality: 'lowest'
    }, function (err, info) {
      if (err) {
        _this.logger.error(err);
        return callback(err);
      }
      _this.title = info.title;
      _this.author = info.author;
      _this.plays = info.view_count;
      _this.length = info.length_seconds;
    });
    return _this;
  }

  _createClass(YoutubeTrack, [{
    key: 'basicPrint',
    get: function get() {
      return '**' + this.title + '** ';
    }
  }, {
    key: 'prettyPrint',
    get: function get() {
      return this.basicPrint + ' (' + this.prettyPlays + ' plays) by ' + this.author;
    }
  }, {
    key: 'prettyPlays',
    get: function get() {
      return this.plays ? this.plays.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'unknown';
    }
  }, {
    key: 'prettyTime',
    get: function get() {
      var seconds = this.length;
      return Math.round((seconds - Math.ceil(seconds % 60)) / 60) + ':' + ('' + String('00' + Math.ceil(seconds % 60)).slice(-2));
    }
  }, {
    key: 'fullInfo',
    get: function get() {
      return this.prettyPrint + ' [' + this.prettyTime + '] ' + ('- added by ' + this.addedBy.username);
    }
  }, {
    key: 'stream',
    get: function get() {
      return (0, _ytdlCore2.default)(this.url, {
        filter: function filter(format) {
          return format.container === 'mp4';
        }, quality: 'lowest'
      });
    }
  }]);

  return YoutubeTrack;
}(_Track3.default);

module.exports = YoutubeTrack;
//# sourceMappingURL=YoutubeTrack.js.map
