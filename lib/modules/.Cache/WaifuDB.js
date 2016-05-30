'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function read(filename) {
  return _lodash2.default.compact(_fs2.default.readFileSync(_path2.default.join(process.cwd(), 'db/waifu', filename + '.txt'), 'utf-8').split('\n'));
}

module.exports = {
  Waifus: read('waifus'),
  Shipgirls: read('shipgirls'),
  Abyssals: read('abyssals')
};
//# sourceMappingURL=WaifuDB.js.map
