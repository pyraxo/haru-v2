var Arena;

Arena = (function() {
  function Arena(options) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    this.id = (ref = options.id) != null ? ref : null, this.player1 = (ref1 = options.player1) != null ? ref1 : null, this.player2 = (ref2 = options.player2) != null ? ref2 : null, this.state = (ref3 = options.state) != null ? ref3 : 'idle', this.waiting = (ref4 = options.waiting) != null ? ref4 : null, this.bets = (ref5 = options.bets) != null ? ref5 : {};
  }

  return Arena;

})();

module.exports = Arena;

//# sourceMappingURL=Arena.js.map
