'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _discordie = require('discordie');

var _discordie2 = _interopRequireDefault(_discordie);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _ytdlCore = require('ytdl-core');

var _ytdlCore2 = _interopRequireDefault(_ytdlCore);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _BaseClient2 = require('../base/BaseClient');

var _BaseClient3 = _interopRequireDefault(_BaseClient2);

var _Stream = require('./.Music/Stream');

var _Stream2 = _interopRequireDefault(_Stream);

var _YoutubeTrack = require('./.Music/YoutubeTrack');

var _YoutubeTrack2 = _interopRequireDefault(_YoutubeTrack);

var _SoundcloudTrack = require('./.Music/SoundcloudTrack');

var _SoundcloudTrack2 = _interopRequireDefault(_SoundcloudTrack);

var _FlatDatabase = require('../../util/FlatDatabase');

var _FlatDatabase2 = _interopRequireDefault(_FlatDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var apiKeys = new _FlatDatabase2.default(_path2.default.join(process.cwd(), 'config/keys.json')).getAll();

var Disco = function (_BaseClient) {
  _inherits(Disco, _BaseClient);

  function Disco(container) {
    _classCallCheck(this, Disco);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Disco).call(this, container));

    _this.streams = {};
    _this.logger = container.get('logger');
    return _this;
  }

  _createClass(Disco, [{
    key: 'prettify',


    // Commands

    value: function prettify(content, id, prefix) {
      return _lodash2.default.trim(content.replace(new RegExp('^(<@' + id + '>)|(\\' + prefix + ')'), ''));
    }
  }, {
    key: 'isBotMentioned',
    value: function isBotMentioned(user, msg, prefix) {
      return msg.content.indexOf(prefix) === 0 || user.isMentioned(msg) || !msg.guild;
    }
  }, {
    key: 'send',
    value: function send(channel, content) {
      var _this2 = this;

      var msgRem = '';
      if (content.length > 20000) {
        return this.logger.error('Error sending a message larger than the character and rate limit\n' + content);
      }
      if (content.length > 2000) {
        content = content.match(/.{1,20000}/g);
        msgRem = content.shift();
        content = content.join('');
      }
      return new Promise(function (res, rej) {
        channel.sendMessage(content).then(function (msg) {
          if (msgRem) {
            return _this2.send(channel, content).then(function (msg) {
              return res(Array.isArray(msg) ? msg.concat(msg) : [msg]);
            }).catch(rej);
          }
          res(msg);
        }).catch(rej);
      });
    }
  }, {
    key: 'reply',
    value: function reply(msg, content) {
      return new Promise(function (res, rej) {
        msg.reply(content).then(res).catch(rej);
      });
    }
  }, {
    key: 'wrongUsage',
    value: function wrongUsage(msg, name) {
      var prefix = this.container.getParam('prefix');
      this.reply(msg, 'Please run `' + prefix + 'help ' + name + '` to use this command properly');
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint(regex, matches) {
      return _prettyjson2.default.render({
        'Music Module (Discordie)': {
          regex: regex ? regex.toString() : '',
          matches: matches
        }
      }, {
        dashColor: 'magenta',
        keysColor: 'cyan'
      });
    }
  }, {
    key: 'responds',
    value: function responds(content, regex, cb) {
      var matches = regex.exec(content);

      if (matches === null) {
        return false;
      }

      var result = cb(matches);
      var noPrint = !this.container.get('debug');
      if (!noPrint && result !== false) {
        this.logger.debug('\n' + this.prettyPrint(regex, matches));
      }
    }

    // Music

  }, {
    key: 'queueYT',
    value: function queueYT(id, msg) {
      var _this3 = this;

      this.streams[msg.guild.id].queue(new _YoutubeTrack2.default(id, msg.author, this.logger, function (err) {
        if (err) {
          if (err.toString().indexOf('Code 150') > -1) {
            _this3.send(msg.channel, 'This video is unavailable in the country I am running in. ' + 'Please try a different video.');
          } else if (err.message === 'Could not extract signature deciphering actions') {
            _this3.send(msg.channel, 'YouTube streams have changed their formats. ' + 'Please get the admin to update `ytdl-core`.');
          } else if (err.message === 'status code 404') {
            _this3.send(msg.channel, 'That video does not exist.');
          } else {
            _this3.send(msg.channel, 'An error occurred while getting video information. ' + 'Please try a different video.');
          }
        }
        _this3.streams[msg.guild.id].playlist.pop();
      }));
      var check = function check(vid, m) {
        if (vid.plays && vid.length) {
          m.edit(':white_check_mark:  Queued ' + vid.prettyPrint + ' - ' + msg.author.mention);
          if (!_this3.streams[msg.guild.id].currentVideo) _this3.playNext(msg.guild);
          return;
        } else {
          setTimeout(function () {
            return check(vid, m);
          }, 3000);
        }
      };
      msg.delete();
      this.send(msg.channel, ':mag:  Queuing song...').then(function (msg) {
        check(_lodash2.default.last(_this3.streams[msg.guild.id].playlist), msg);
      });
    }
  }, {
    key: 'queueSC',
    value: function queueSC(query, msg) {
      var _this4 = this;

      query = query.split(' ').join('_');
      var cid = apiKeys['soundcloud'];
      this.send(msg.channel, ':mag:  Queuing song...').then(function (msg) {
        _superagent2.default.get('https://api.soundcloud.com/tracks/?client_id=' + cid + '&q=' + query).end(function (err, res) {
          if (err) {
            _this4.logger.error('Error occurred while fetching from SC', err);
            return;
          }
          if (res.statusCode === 200) {
            if (typeof res.body[0] !== 'undefined') {
              res = res.body[0];
              var vid = new _SoundcloudTrack2.default({
                addedBy: msg.author,
                url: 'https://api.soundcloud.com/tracks/' + res.id + ('/stream?client_id=' + cid),
                title: res.title,
                author: res.user.username,
                length: res.duration,
                plays: res.playback_count
              }, _this4.logger);
              _this4.streams[msg.guild.id].queue(vid);
              msg.edit(':white_check_mark:  Queued ' + vid.prettyPrint);
              if (!_this4.streams[msg.guild.id].currentVideo) {
                _this4.playNext(msg.guild);
              }
              return;
            }
            msg.edit('::negative_squared_cross_mark: :  Could not find any songs.');
          }
        });
      });
    }
  }, {
    key: 'playNext',
    value: function playNext(guild) {
      this.streams[guild.id].currentVideo = null;
      var stream = this.streams[guild.id];
      if (stream && stream.playlist.length > 0) {
        var vid = this.streams[guild.id].playlist.shift();
        this.send(this.streams[guild.id].text, ':loud_sound:  Playing ' + vid.basicPrint);
        this.play(vid, guild, stream.voiceConnection);
        this.streams[guild.id].currentVideo = vid;
      }
    }
  }, {
    key: 'play',
    value: function play(vid, guild, voice) {
      var _this5 = this;

      return new Promise(function (res, rej) {
        if (vid instanceof _YoutubeTrack2.default) {
          var onMediaInfo = function onMediaInfo(err, mediaInfo) {
            if (err) {
              _this5.logger.error('[Discordie] ytdl produced an error:', err);
              return;
            }
            var formats = mediaInfo.formats.filter(function (f) {
              return f.container === 'webm';
            }).sort(function (a, b) {
              return b.audioBitrate - a.audioBitrate;
            });

            var bestAudio = formats.find(function (f) {
              return f.audioBitrate > 0 && !f.bitrate;
            }) || formats.find(function (f) {
              return f.audioBitrate > 0;
            });
            if (!bestAudio) {
              _this5.logger.info(_chalk2.default.cyan('[Discordie] No valid formats'));
              return;
            }

            var encoder = voice.voiceConnection.createExternalEncoder({
              type: 'ffmpeg', source: bestAudio.url,
              debug: true
            });
            encoder.once('end', function () {
              _this5.send(_this5.streams[guild.id].text, ':speaker:  Finished playing ' + vid.basicPrint);
              _this5.playNext(guild);
            });
            encoder.play();
          };
          try {
            _ytdlCore2.default.getInfo(vid.url, onMediaInfo);
          } catch (err) {
            _this5.logger.error('[Discordie] ytdl produced an error:', err);
            return rej(err);
          }
        } else if (vid instanceof _SoundcloudTrack2.default) {
          var encoder = voice.voiceConnection.createExternalEncoder({
            type: 'ffmpeg', source: vid.url,
            debug: true
          });
          encoder.once('end', function () {
            _this5.send(_this5.streams[guild.id].text, ':speaker:  Finished playing ' + vid.basicPrint);
            _this5.playNext(guild);
          });
          encoder.play();
        }
        res();
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this6 = this;

      var client = new _discordie2.default();
      client.connect({
        token: this.container.getParam('token')
      });

      client.Dispatcher.on('GATEWAY_READY', function (e) {
        _this6.logger.info('Music module connected - ' + ('' + _chalk2.default.green(client.User.username)));
      });

      client.Dispatcher.on('MESSAGE_CREATE', function (e) {
        var prefix = _this6.container.getParam('prefix');
        if (e.message.author.id === client.User.id) return;

        _this6.responds(e.message.content, /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu.be\/)(\S{11})$/i, function (matches) {
          if (Object.keys(_this6.streams).length > 0 && _this6.streams[e.message.guild.id] && !e.message.isPrivate) {
            if (_this6.streams[e.message.guild.id].text.id === e.message.channel.id) {
              _this6.queueYT(matches[2], e.message);
            }
          }
        });

        if (!_this6.isBotMentioned(client.User, e.message, prefix)) {
          return;
        }

        var m = _this6.prettify(e.message.content, client.User.id, prefix);
        _this6.responds(m, /^(summon|join)$/i, function () {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          if (Object.keys(_this6.streams).length > 0) {
            for (var stream in _this6.streams) {
              if (_this6.streams.hasOwnProperty(stream)) {
                if (stream === e.message.guild.id) {
                  _this6.reply(e.message, 'I\'m already in a voice channel ' + ('\'**' + _this6.streams[stream].voice.name + '**\''));
                  return;
                }
              }
            }
          }
          var voiceChannels = e.message.guild.voiceChannels.filter(function (vc) {
            return vc.members.map(function (m) {
              return m.id;
            }).indexOf(e.message.author.id) > -1;
          });
          if (voiceChannels.length > 0) {
            (function () {
              voiceChannels[0].join(false, false);
              var check = function check(msg) {
                if (client.VoiceConnections.getForGuild(msg.guild)) {
                  msg.edit(':headphones:  Connected to \'**' + voiceChannels[0].name + '**\' ' + ('and bound to <#' + e.message.channel.id + '>.'));
                  _this6.streams[e.message.guild.id] = new _Stream2.default({
                    text: e.message.channel,
                    voice: voiceChannels[0],
                    voiceConnection: client.VoiceConnections.getForGuild(msg.guild)
                  });
                } else {
                  setTimeout(function () {
                    return check(msg);
                  }, 10);
                }
              };

              _this6.send(e.message.channel, ':headphones:  Connecting to voice...').then(function (msg, err) {
                check(msg);
              });
            })();
          }
        });

        _this6.responds(m, /^(leave|destroy)$/i, function () {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          if (Object.keys(_this6.streams).length > 0 && _this6.streams[e.message.guild.id]) {
            var stream = _this6.streams[e.message.guild.id];
            if (stream.text.id !== e.message.channel.id) {
              return;
            }
            _this6.send(e.message.channel, ':headphones:  Disconnected from \'**' + stream.voice.name + '**\' ' + ('and unbound from <#' + stream.text.id + '>'));
            stream.voice.leave();
            delete _this6.streams[e.message.guild.id];
          } else {
            _this6.reply(e.message, 'I\'m not in any voice channels.');
          }
        });

        _this6.responds(m, /^(youtube|yt)$/i, function () {
          _this6.wrongUsage(e.message, 'yt');
        });

        _this6.responds(m, /^(soundcloud|sc)$/i, function () {
          _this6.wrongUsage(e.message, 'sc');
        });

        _this6.responds(m, /^(m|music) (next|skip|>>)$/i, function () {
          if (Object.keys(_this6.streams).length === 0 || !_this6.streams[e.message.guild.id]) {
            _this6.reply(e.message, 'Add me to a voice channel first.');
            return;
          } else if (_this6.streams[e.message.guild.id].text.id !== e.message.channel.id) {
            return;
          }
          var stream = _this6.streams[e.message.guild.id];
          var vc = stream.voiceConnection;
          if (!vc) {
            _this6.reply(e.message, 'No voice connection found.');
            return;
          }
          _this6.playNext(e.message.guild);
        });

        _this6.responds(m, /^(m|music) (\|\||stop)$/i, function () {
          if (Object.keys(_this6.streams).length === 0 || !_this6.streams[e.message.guild.id]) {
            _this6.reply(e.message, 'I\'m not in any voice channel.');
            return;
          } else if (_this6.streams[e.message.guild.id].text.id !== e.message.channel.id) {
            return;
          }
          var stream = _this6.streams[e.message.guild.id].voiceConnection;
          if (!stream) {
            _this6.reply(e.message, 'No voice connection found.');
            return;
          }
          var encoderStream = stream.voiceConnection.getEncoderStream();
          encoderStream.unpipeAll();
          _this6.send(e.message.channel, ':pause_button:  Stopped playing music.');
        });

        _this6.responds(m, /^(youtube|yt) (add|queue|\+) (https:\/\/www\.youtube\.com\/watch\?v=(\S{11}))$/i, function (matches) {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          if (Object.keys(_this6.streams).length === 0 || !_this6.streams[e.message.guild.id]) {
            _this6.reply(e.message, 'Add me in a voice channel first!');
            return;
          } else if (_this6.streams[e.message.guild.id].text.id !== e.message.channel.id) {
            return;
          }
          _this6.queueYT(matches[4], e.message);
        });

        _this6.responds(m, /^(youtube|yt) (q|find|search|query|\?) (.+)$/i, function (matches) {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          if (Object.keys(_this6.streams).length === 0 || !_this6.streams[e.message.guild.id]) {
            _this6.reply(e.message, 'Add me in a voice channel first!');
            return;
          } else if (_this6.streams[e.message.guild.id].text.id !== e.message.channel.id) {
            return;
          }
          _superagent2.default.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + escape(matches[3]) + ('&key=' + apiKeys['google_api'])).end(function (err, res) {
            if (err) {
              _this6.reply(e.message, 'An error occurred during the YT search.');
              _this6.logger.error('Error found during YT search', err);
              return;
            }
            var payload = res.body;
            if (payload['items'].length === 0) {
              _this6.send(e.message.channel, 'Query ' + matches[3] + ' gave no answer.');
              return;
            }
            var videos = payload.items.filter(function (item) {
              return item.id.kind === 'youtube#video';
            });
            if (videos.length === 0) {
              _this6.send(e.message.channel, 'Query ' + matches[3] + ' gave no videos.');
              return;
            }

            var video = videos[0];
            _this6.queueYT(video.id.videoId, e.message);
          });
        });

        _this6.responds(m, /^(soundcloud|sc) (.+)$/i, function (matches) {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          if (Object.keys(_this6.streams).length === 0 || !_this6.streams[e.message.guild.id]) {
            _this6.reply(e.message, 'Add me in a voice channel first!');
            return;
          } else if (_this6.streams[e.message.guild.id].text.id !== e.message.channel.id) {
            return;
          }
          _this6.queueSC(matches[2], e.message);
        });

        _this6.responds(m, /^(playlist|pl)$/i, function () {
          if (e.message.isPrivate) {
            _this6.send(e.message.channel, 'This command cannot be run in PMs.');
            return;
          }
          var stream = _this6.streams[e.message.guild.id];
          if (Object.keys(_this6.streams).length === 0 || !stream) {
            _this6.reply(e.message, 'Add me in a voice channel first!');
            return;
          } else if (stream.text.id !== e.message.channel.id) {
            return;
          }
          var songs = [];
          if (_lodash2.default.keys(stream.playlist).length === 0 && !stream.currentVideo) {
            _this6.reply(e.message, 'I don\'t have any songs currently queued.');
            return;
          } else if (stream.currentVideo) {
            _this6.send(e.message.channel, ':sound:  Currently playing: ' + stream.currentVideo.fullInfo);
          }
          stream.playlist.forEach(function (elem, idx) {
            songs.push(idx + 1 + '. ' + elem.prettyPrint);
          });
          _this6.send(e.message.channel, songs.length > 0 ? 'List of queued songs in playlist:\n' + songs.join('\n') : 'There are no remaining songs in the playlist. Go add some!');
        });
      });
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'discordie';
    }
  }]);

  return Disco;
}(_BaseClient3.default);

module.exports = Disco;
//# sourceMappingURL=Discordie.js.map
