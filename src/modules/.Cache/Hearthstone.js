import path from 'path'
import jsonfile from 'jsonfile'
import request from 'superagent'

function getCardSet (set) {
  set = set || 'Classic'
  try {
    let cards = require(path.join(process.cwd(), `db/hearthstone/${set}.json`))
    return cards
  } catch (err) {
    request
    .get(
      `https://omgvamp-hearthstone-v1.p.mashape.com/` +
      `cards/sets/${set}?collectible=1`
    )
    .set(
      'X-Mashape-Key', 'Io1U1l6uwPmshZbiD6YTcC8BbgQ4p1HrOw0jsnnJ0CwWw8wDWV'
    )
    .end((err, res) => {
      if (err) {
        console.error('Error fetching HS cards:\n' + err)
        return
      }
      let filepath = path.join(process.cwd(), `db/hearthstone/${set}.json`)
      jsonfile.writeFileSync(filepath, res.body, {spaces: 2})
      console.log(`Saved HS card set ${set} to ${filepath}`)
      return require(filepath)
    })
  }
}

module.exports = {
  Classic: getCardSet(),
  GVG: getCardSet('Goblins vs Gnomes'),
  WOTOG: getCardSet('Whispers of the Old Gods'),
  TGT: getCardSet('The Grand Tournament'),
  getCardSet: getCardSet
}
