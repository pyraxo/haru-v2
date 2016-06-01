'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCardSet(set) {
  set = set || 'Classic';
  try {
    var cards = require(_path2.default.join(process.cwd(), 'db/hearthstone/' + set + '.json'));
    return cards;
  } catch (err) {
    _superagent2.default.get('https://omgvamp-hearthstone-v1.p.mashape.com/' + ('cards/sets/' + set + '?collectible=1')).set('X-Mashape-Key', 'Io1U1l6uwPmshZbiD6YTcC8BbgQ4p1HrOw0jsnnJ0CwWw8wDWV').end(function (err, res) {
      if (err) {
        console.error('Error fetching HS cards:\n' + err);
        return;
      }
      var filepath = _path2.default.join(process.cwd(), 'db/hearthstone/' + set + '.json');
      _jsonfile2.default.writeFileSync(filepath, res.body, { spaces: 2 });
      console.log('Saved HS card set ' + set + ' to ' + filepath);
      return require(filepath);
    });
  }
}

module.exports = {
  Classic: getCardSet(),
  GVG: getCardSet('Goblins vs Gnomes'),
  WOTOG: getCardSet('Whispers of the Old Gods'),
  TGT: getCardSet('The Grand Tournament'),
  getCardSet: getCardSet
};
//# sourceMappingURL=Hearthstone.js.map
