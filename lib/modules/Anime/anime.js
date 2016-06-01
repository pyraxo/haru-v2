'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentXml2jsparser = require('superagent-xml2jsparser');

var _superagentXml2jsparser2 = _interopRequireDefault(_superagentXml2jsparser);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _FlatDatabase = require('../../util/FlatDatabase');

var _FlatDatabase2 = _interopRequireDefault(_FlatDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'config/mal.json')).getAll();

var Anime = function (_BaseCommand) {
  _inherits(Anime, _BaseCommand);

  function Anime() {
    _classCallCheck(this, Anime);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Anime).apply(this, arguments));
  }

  _createClass(Anime, [{
    key: 'genEntry',
    value: function genEntry(entry) {
      var synopsis = entry.synopsis[0] ? _he2.default.decode(entry.synopsis[0]).replace(/<br\s*[\/]?>/gi, '').replace(/\[\/*i\]\s*/gi, '*').replace(/\[\/*b\]\s*/gi, '**') : 'none';
      if (synopsis.length > 500) {
        synopsis = synopsis.substring(0, 500);
        synopsis += '...';
      }
      this.send(this.channel, ['\n:mag_right:  **' + entry.title + '**', entry.english ? '\n**Alternate Title**: ' + entry.english : '\n', '**Score**: ' + entry.score, '**Episodes**: ' + entry.episodes, '**Status**: ' + entry.status, '**Type**: ' + (entry.type ? entry.type : 'None'), '**Start Date**: ' + entry.start_date, '**End Date**: ' + entry.end_date, '**Synopsis**: ' + synopsis, 'http://myanimelist.net/anime/' + entry.id].join('\n'));
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this2 = this;

      this.responds(/^anime (.+)$/i, function (matches) {
        var query = matches[1].split(' ').join('+');
        _superagent2.default.get('http://myanimelist.net/api/anime/search.xml?q=' + query).auth(config.user, config.pass).accept('xml').buffer(true).parse(_superagentXml2jsparser2.default).end(function (err, res) {
          if (err) {
            _this2.logger.error('Error fetching MAL DB:\n', err);
            _this2.reply('**Error** querying MAL DB: ' + err);
            return;
          }
          if (res.body === null) {
            _this2.reply('No anime by the name **' + matches[1] + '** could be found.');
            return;
          }
          var entries = res.body.anime.entry;
          if (entries.length === 1) {
            _this2.genEntry(entries[0]);
            return;
          }
          if (entries.length > 10) entries.length = 10;
          var reply = ['**Please choose your desired show by entering its number:**\n'];
          entries.forEach(function (elem, idx) {
            reply.push(idx + 1 + '. ' + elem.title);
          });
          _this2.client.awaitResponse(_this2.message, reply.join('\n')).then(function (msg) {
            if (!/^\d+$/.test('10')) {
              _this2.reply('That is an invalid response.');
              return;
            }
            var num = parseInt(msg.content, 10);
            if (num > 10) {
              _this2.reply('There\'s no anime entry with that index!');
            }
            _this2.genEntry(entries[num - 1]);
          });
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'anime';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'The command for weebs';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['**anime** <anime title> - Searches for an anime']];
    }
  }]);

  return Anime;
}(_BaseCommand3.default);

module.exports = Anime;
//# sourceMappingURL=anime.js.map
