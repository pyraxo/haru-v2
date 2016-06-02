import BaseCommand from '../../base/BaseCommand'
import Database from '../../util/Database'

let TagManager = new Database('tags')

class Tags extends BaseCommand {
  static get name () {
    return 'tags'
  }

  static get description () {
    return 'Save and retrieve snippets of text'
  }

  static get usage () {
    return [
      [
        '```ruby',
        '== Tag Management System ==',
        '```',
        'Tags allow you to save and retrieve snippets of text.',
        'Tags are server-specific - tags you create on one server will not be found on another.\n'
      ].join('\n'),
      [
        'tags create **<tag name>** > **<text>** - Creates a tag',
        'tags edit **<tag name>** > **<new text>** - Edits a tag',
        'tags delete **<tag name>** - Deletes a tag'
      ],
      [
        '\n__NOTE:__ Anyone can edit and delete tags.',
        '**Retrieving tags**:, prefix the tag name with `>>`',
        'For example: `>>here comes dat boi`'
      ].join('\n')
    ]
  }

  get noPrivate () {
    return true
  }

  checkEntries (entry, cb) {
    TagManager.has(entry.id, (err, res) => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error querying tag`, err
        )
        this.reply(`Error querying for entries: ${err}`)
        return
      }
      return cb(res)
    })
  }

  getEntry (entry, cb) {
    TagManager.get(entry.id, (err, tags) => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error fetching tag list`, err
        )
        this.reply(`Error fetching entry: ${err}`)
        return
      }
      return cb(tags)
    })
  }

  setEntry (entry, value, cb) {
    TagManager.set(entry.id, value, err => {
      if (err) {
        this.logger.error(
          `${this.sender.name} encountered an error saving an entry`, err
        )
        this.reply(`Error saving entry: ${err}`)
        return
      }
      return cb(true)
    })
  }

  handle () {
    // tags : server ID / user ID : json object
    this.responds(/^tags$/i, () => {
      this.getEntry(this.server, tags => {
        if (!tags) {
          this.reply('No tags are saved on this server.')
          return
        }
        this.send(this.channel, [
          ':mag_right:  Tags saved in this server:',
          `\`${Object.keys(tags).join(', ')}\``
        ].join('\n'))
      })
    })

    this.responds(/^tags (create|add|\+) .* >*$/i, () => {
      this.send(this.channel, [
        `To add a tag, enter __${this.prefix}tags create **<tag name>** > **<text>**__`,
        '```',
        `${this.prefix}tags create here comes dat boi > o shit waddup`,
        '```'
      ].join('\n'))
    })

    this.responds(/^tags (create|add|\+) (.+) > (.+)$/i, matches => {
      let tag = matches[2]
      let text = matches[3]
      this.getEntry(this.server, tags => {
        if (tags === null) {
          let entry = {}
          entry[tag] = text
          this.setEntry(this.server, entry, success => {
            if (success === true) {
              this.send(this.channel, [
                `:white_check_mark:  Saved tag **${tag}** with text *${text}*`,
                `Use \`>>${tag}\` to access the saved text!`
              ].join('\n'))
            }
          })
        } else {
          if (Object.keys(tags).indexOf(tag) > -1) {
            this.reply([
              `The tag **${tag}** already exists!`,
              `To edit a tag, enter __${this.prefix}tags edit **<tag name>** > **<new text>**`
            ].join('\n'))
          } else {
            tags[tag] = text
            this.setEntry(this.server, tags, success => {
              if (success === true) {
                this.send(this.channel, [
                  `:white_check_mark:  Saved tag **${tag}** with text *${text}*`,
                  `Use \`>>${tag}\` to access the saved text!`
                ].join('\n'))
              }
            })
          }
        }
      })
    })

    this.responds(/^tags edit .* >*$/i, () => {
      this.send(this.channel, [
        `To edit a tag, enter __${this.prefix}tags edit **<tag name>** > **<new text>**`,
        '```',
        `${this.prefix}tags edit ayy > LMAO`,
        '```',
        '__NOTE:__ Anyone can edit tags.'
      ].join('\n'))
    })

    this.responds(/^tags edit (.+) > (.+)$/i, matches => {
      let tag = matches[1]
      let text = matches[2]
      this.getEntry(this.server, tags => {
        if (tags === null) {
          this.reply([
            `The tag **${tag}** doesn't exist!`,
            `To create a new tag, enter __${this.prefix}tags create **<tag name>** > **<text>**__`
          ].join('\n'))
        } else {
          if (Object.keys(tags).indexOf(tag) === -1) {
            this.reply([
              `The tag **${tag}** doesn't exist!`,
              `To create a new tag, enter __${this.prefix}tags create **<tag name>** > **<text>**__`
            ].join('\n'))
          } else {
            tags[tag] = text
            this.setEntry(this.server, tags, success => {
              if (success === true) {
                this.send(this.channel, [
                  `:white_check_mark:  Edited tag **${tag}** to text *${text}*`,
                  `Use \`>>${tag}\` to access the new tag!`
                ].join('\n'))
              }
            })
          }
        }
      })
    })

    this.responds(/^tags (delete|rm|\-)$/i, () => {
      this.send(this.channel, [
        `To delete a tag, enter __${this.prefix}tags delete **<tag name>**`,
        '```',
        `${this.prefix}tags delete here comes dat boi`,
        '```',
        '__NOTE:__ Anyone can delete tags.'
      ].join('\n'))
    })

    this.responds(/^tags (delete|rm|\-) (.+)$/i, matches => {
      let tag = matches[2]
      this.getEntry(this.server, tags => {
        if (tags === null) {
          this.reply([
            `The tag **${tag}** doesn't exist!`,
            `To create a new tag, enter __${this.prefix}tags create **<tag name>** > **<text>**__`
          ].join('\n'))
        } else {
          if (Object.keys(tags).indexOf(tag) === -1) {
            this.reply([
              `The tag **${tag}** doesn't exist!`,
              `To create a new tag, enter __${this.prefix}tags create **<tag name>** > **<text>**__`
            ].join('\n'))
          } else {
            delete tags[tag]
            this.setEntry(this.server, tags, success => {
              if (success === true) {
                this.send(this.channel, [
                  `:white_check_mark:  Deleted tag **${tag}**`
                ].join('\n'))
              }
            })
          }
        }
      })
    })

    this.hears(/^>>(.+)$/, matches => {
      this.getEntry(this.server, tags => {
        if (tags !== null) {
          if (typeof tags[matches[1]] !== 'undefined') {
            this.send(this.channel, tags[matches[1]])
          }
        }
      })
    })
  }
}

module.exports = Tags
