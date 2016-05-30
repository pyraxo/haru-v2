import fs from 'fs'
import path from 'path'
import _ from 'lodash'

function read (filename) {
  return _.compact(
    fs.readFileSync(path.join(process.cwd(), 'db/waifu', filename + '.txt'), 'utf-8')
    .split('\n')
  )
}

module.exports = {
  Waifus: read('waifus'),
  Shipgirls: read('shipgirls'),
  Abyssals: read('abyssals')
}
