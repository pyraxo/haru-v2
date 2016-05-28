var Container, FDB, jsonfile,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

jsonfile = require('jsonfile');

Container = require('./Container');

FDB = (function(superClass) {
  extend(FDB, superClass);

  function FDB(filename) {
    this.filename = filename;
    this.db = jsonfile.readFileSync(this.filename);
  }

  return FDB;

})(Container);

module.exports = FDB;

//# sourceMappingURL=FlatDatabase.js.map
