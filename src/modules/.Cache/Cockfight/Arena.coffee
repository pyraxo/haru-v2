class Arena
  constructor: (options) ->
    {
      @id = null
      @player1 = null  # all null values here will be overwritten with IDs
      @player2 = null
      @state = 'idle'
      @waiting = null
      @bets = {}
    } = options

module.exports = Arena
