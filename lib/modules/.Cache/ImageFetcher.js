'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function imageSearch(board, query, val) {
  query = query || '';
  val = val ? '&' + val : '';
  var boards = {
    'danbooru': 'http://danbooru.donmai.us/posts.json?limit=1' + '&page=1&tags=order:random+',
    'gelbooru': 'http://gelbooru.com/index.php?page=dapi' + '&s=post&q=index&limit=1&json=1&tags=',
    'yandere': 'https://yande.re/post/index.json?limit=1' + '&page=1&tags=order:random+',
    'konachan': 'http://konachan.com/post/index.json?tags=order:random+'
  };
  return new Promise(function (res, rej) {
    if (!boards[board]) {
      rej('Image board ' + board + ' is not supported.');
    }
    _superagent2.default.get('' + boards[board] + query + val).end(function (err, result) {
      if (err) {
        rej(err);
      }
      res(result);
    });
  });
};
//# sourceMappingURL=ImageFetcher.js.map
