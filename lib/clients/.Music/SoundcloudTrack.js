'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Track2 = require('./Track');

var _Track3 = _interopRequireDefault(_Track2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SoundcloudTrack = function (_Track) {
  _inherits(SoundcloudTrack, _Track);

  function SoundcloudTrack(options, logger) {
    _classCallCheck(this, SoundcloudTrack);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SoundcloudTrack).call(this, {
      addedBy: options.addedBy,
      url: options.url
    }));

    _this.title = options.title;
    _this.author = options.author;
    _this.length = options.length;
    _this.plays = options.plays;
    return _this;
  }

  _createClass(SoundcloudTrack, [{
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
      return this.plays ? this.plays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'unknown';
    }
  }, {
    key: 'prettyTime',
    get: function get() {
      var millis = this.length;
      var minutes = Math.floor(millis / 60000);
      var seconds = (millis % 60000 / 1000).toFixed(0);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }
  }, {
    key: 'fullInfo',
    get: function get() {
      return this.prettyPrint + ' [' + this.prettyTime + '] ' + ('- added by ' + this.addedBy.username);
    }
  }]);

  return SoundcloudTrack;
}(_Track3.default);

module.exports = SoundcloudTrack;
//# sourceMappingURL=SoundcloudTrack.js.map
