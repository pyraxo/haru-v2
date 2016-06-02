'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCommand2 = require('../../base/BaseCommand');

var _BaseCommand3 = _interopRequireDefault(_BaseCommand2);

var _Database = require('../../util/Database');

var _Database2 = _interopRequireDefault(_Database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagManager = new _Database2.default('tags');

var Tags = function (_BaseCommand) {
  _inherits(Tags, _BaseCommand);

  function Tags() {
    _classCallCheck(this, Tags);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Tags).apply(this, arguments));
  }

  _createClass(Tags, [{
    key: 'checkEntries',
    value: function checkEntries(entry, cb) {
      var _this2 = this;

      TagManager.has(entry.id, function (err, res) {
        if (err) {
          _this2.logger.error(_this2.sender.name + ' encountered an error querying tag', err);
          _this2.reply('Error querying for entries: ' + err);
          return;
        }
        return cb(res);
      });
    }
  }, {
    key: 'getEntry',
    value: function getEntry(entry, cb) {
      var _this3 = this;

      TagManager.get(entry.id, function (err, tags) {
        if (err) {
          _this3.logger.error(_this3.sender.name + ' encountered an error fetching tag list', err);
          _this3.reply('Error fetching entry: ' + err);
          return;
        }
        return cb(tags);
      });
    }
  }, {
    key: 'setEntry',
    value: function setEntry(entry, value, cb) {
      var _this4 = this;

      TagManager.set(entry.id, value, function (err) {
        if (err) {
          _this4.logger.error(_this4.sender.name + ' encountered an error saving an entry', err);
          _this4.reply('Error saving entry: ' + err);
          return;
        }
        return cb(true);
      });
    }
  }, {
    key: 'handle',
    value: function handle() {
      var _this5 = this;

      // tags : server ID / user ID : json object
      this.responds(/^tags$/i, function () {
        _this5.getEntry(_this5.server, function (tags) {
          if (!tags) {
            _this5.reply('No tags are saved on this server.');
            return;
          }
          _this5.send(_this5.channel, [':mag_right:  Tags saved in this server:', '`' + Object.keys(tags).join(', ') + '`'].join('\n'));
        });
      });

      this.responds(/^tags (create|add|\+) .* >*$/i, function () {
        _this5.send(_this5.channel, ['To add a tag, enter __' + _this5.prefix + 'tags create **<tag name>** > **<text>**__', '```', _this5.prefix + 'tags create here comes dat boi > o shit waddup', '```'].join('\n'));
      });

      this.responds(/^tags (create|add|\+) (.+) > (.+)$/i, function (matches) {
        var tag = matches[2];
        var text = matches[3];
        _this5.getEntry(_this5.server, function (tags) {
          if (tags === null) {
            var entry = {};
            entry[tag] = text;
            _this5.setEntry(_this5.server, entry, function (success) {
              if (success === true) {
                _this5.send(_this5.channel, [':white_check_mark:  Saved tag **' + tag + '** with text *' + text + '*', 'Use `>>' + tag + '` to access the saved text!'].join('\n'));
              }
            });
          } else {
            if (Object.keys(tags).indexOf(tag) > -1) {
              _this5.reply(['The tag **' + tag + '** already exists!', 'To edit a tag, enter __' + _this5.prefix + 'tags edit **<tag name>** > **<new text>**'].join('\n'));
            } else {
              tags[tag] = text;
              _this5.setEntry(_this5.server, tags, function (success) {
                if (success === true) {
                  _this5.send(_this5.channel, [':white_check_mark:  Saved tag **' + tag + '** with text *' + text + '*', 'Use `>>' + tag + '` to access the saved text!'].join('\n'));
                }
              });
            }
          }
        });
      });

      this.responds(/^tags edit .* >*$/i, function () {
        _this5.send(_this5.channel, ['To edit a tag, enter __' + _this5.prefix + 'tags edit **<tag name>** > **<new text>**', '```', _this5.prefix + 'tags edit ayy > LMAO', '```', '__NOTE:__ Anyone can edit tags.'].join('\n'));
      });

      this.responds(/^tags edit (.+) > (.+)$/i, function (matches) {
        var tag = matches[1];
        var text = matches[2];
        _this5.getEntry(_this5.server, function (tags) {
          if (tags === null) {
            _this5.reply(['The tag **' + tag + '** doesn\'t exist!', 'To create a new tag, enter __' + _this5.prefix + 'tags create **<tag name>** > **<text>**__'].join('\n'));
          } else {
            if (Object.keys(tags).indexOf(tag) === -1) {
              _this5.reply(['The tag **' + tag + '** doesn\'t exist!', 'To create a new tag, enter __' + _this5.prefix + 'tags create **<tag name>** > **<text>**__'].join('\n'));
            } else {
              tags[tag] = text;
              _this5.setEntry(_this5.server, tags, function (success) {
                if (success === true) {
                  _this5.send(_this5.channel, [':white_check_mark:  Edited tag **' + tag + '** to text *' + text + '*', 'Use `>>' + tag + '` to access the new tag!'].join('\n'));
                }
              });
            }
          }
        });
      });

      this.responds(/^tags (delete|rm|\-)$/i, function () {
        _this5.send(_this5.channel, ['To delete a tag, enter __' + _this5.prefix + 'tags delete **<tag name>**', '```', _this5.prefix + 'tags delete here comes dat boi', '```', '__NOTE:__ Anyone can delete tags.'].join('\n'));
      });

      this.responds(/^tags (delete|rm|\-) (.+)$/i, function (matches) {
        var tag = matches[2];
        _this5.getEntry(_this5.server, function (tags) {
          if (tags === null) {
            _this5.reply(['The tag **' + tag + '** doesn\'t exist!', 'To create a new tag, enter __' + _this5.prefix + 'tags create **<tag name>** > **<text>**__'].join('\n'));
          } else {
            if (Object.keys(tags).indexOf(tag) === -1) {
              _this5.reply(['The tag **' + tag + '** doesn\'t exist!', 'To create a new tag, enter __' + _this5.prefix + 'tags create **<tag name>** > **<text>**__'].join('\n'));
            } else {
              delete tags[tag];
              _this5.setEntry(_this5.server, tags, function (success) {
                if (success === true) {
                  _this5.send(_this5.channel, [':white_check_mark:  Deleted tag **' + tag + '**'].join('\n'));
                }
              });
            }
          }
        });
      });

      this.hears(/^>>(.+)$/, function (matches) {
        _this5.getEntry(_this5.server, function (tags) {
          if (tags !== null) {
            if (typeof tags[matches[1]] !== 'undefined') {
              _this5.send(_this5.channel, tags[matches[1]]);
            }
          }
        });
      });
    }
  }, {
    key: 'noPrivate',
    get: function get() {
      return true;
    }
  }], [{
    key: 'name',
    get: function get() {
      return 'tags';
    }
  }, {
    key: 'description',
    get: function get() {
      return 'Save and retrieve snippets of text';
    }
  }, {
    key: 'usage',
    get: function get() {
      return [['```ruby', '== Tag Management System ==', '```', 'Tags allow you to save and retrieve snippets of text.', 'Tags are server-specific - tags you create on one server will not be found on another.\n'].join('\n'), ['tags create **<tag name>** > **<text>** - Creates a tag', 'tags edit **<tag name>** > **<new text>** - Edits a tag', 'tags delete **<tag name>** - Deletes a tag'], ['\n__NOTE:__ Anyone can edit and delete tags.', '**Retrieving tags**:, prefix the tag name with `>>`', 'For example: `>>here comes dat boi`'].join('\n')];
    }
  }]);

  return Tags;
}(_BaseCommand3.default);

module.exports = Tags;
//# sourceMappingURL=tags.js.map
