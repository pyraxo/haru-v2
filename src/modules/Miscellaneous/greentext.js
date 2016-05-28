import BaseCommand from '../../base/BaseCommand'

class GreenText extends BaseCommand {
  static get name () {
    return 'greentext'
  }

  static get description () {
    return 'Greentexts a given input'
  }

  static get usage () {
    return [
      ['**greentext <text>** - Greentexts your text'],
      'e.g `greentext not using discord` will become:',
      '```css',
      '>not using discord',
      '```',
      'The text can be split up with ` | ` like so:',
      'e.g `greentext using skype | liking teamspeak | not using discord`:',
      '```css',
      '>using skype',
      '>using teamspeak',
      '>not using discord',
      '```'
    ]
  }

  handle () {
    this.responds(/^greentext (.+)$/i, matches => {
      let text = matches[1]
      let green = ''
      text.split(' | ').forEach((elem, idx) => {
        green += `>${elem}\n`
      })
      this.send(this.channel, [
        '```css',
        green,
        '```'
      ].join('\n'))
    })
  }
}

module.exports = GreenText
