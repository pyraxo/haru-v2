import request from 'superagent'

module.exports = function imageSearch (board, query, val) {
  query = query || ''
  val = val ? `&${val}` : ''
  let boards = {
    'danbooru': 'http://danbooru.donmai.us/posts.json?limit=1' +
    '&page=1&tags=order:random+',
    'gelbooru': 'http://gelbooru.com/index.php?page=dapi' +
    '&s=post&q=index&limit=1&json=1&tags=',
    'yandere': 'https://yande.re/post/index.json?limit=1' +
    '&page=1&tags=order:random+',
    'konachan': 'http://konachan.com/post/index.json?tags=order:random+'
  }
  return new Promise((res, rej) => {
    if (!boards[board]) {
      rej(`Image board ${board} is not supported.`)
    }
    request
    .get(`${boards[board]}${query}${val}`)
    .end((err, result) => {
      if (err) {
        rej(err)
      }
      res(result)
    })
  })
}
