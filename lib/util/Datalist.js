var Datalist, _, jsonfile;

jsonfile = require('jsonfile');

_ = require('lodash');

Datalist = (function() {
  function Datalist(filename) {
    var error;
    this.filename = filename;
    try {
      this.db = jsonfile.readFileSync(this.filename);
    } catch (error) {
      this.db = [];
      this.save;
    }
  }

  Datalist.prototype.getAll = function() {
    return this.db;
  };

  Datalist.prototype.push = function(val) {
    this.db.push(val);
    return this.save();
  };

  Datalist.prototype.has = function(val) {
    return this.db.indexOf(val) > -1;
  };

  Datalist.prototype.del = function(val) {
    _.pull(this.db, val);
    return this.save();
  };

  Datalist.prototype.save = function(cb) {
    if (this.filename != null) {
      return jsonfile.writeFile(this.filename, this.db, {
        spaces: 2
      }, function(err) {
        if (err != null) {
          return typeof cb === "function" ? cb(err) : void 0;
        }
      });
    }
  };

  return Datalist;

})();

module.exports = Datalist;

//# sourceMappingURL=Datalist.js.map
