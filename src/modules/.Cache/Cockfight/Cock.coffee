class Cock
  constructor: (options) ->
    {
      @id = null
      @name = null
      @wins = 0
      @losses = 0
      @hp = 10
      @dmg = 1
    } = options

module.exports = Cock
