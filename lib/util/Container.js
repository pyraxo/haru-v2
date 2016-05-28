var Container, jsonfile;

jsonfile = require('jsonfile');

Container = (function() {
  function Container(options) {
    this.db = options != null ? options : {
      options: {
        params: {}
      }
    };
  }

  Container.prototype.getAll = function() {
    return this.db;
  };

  Container.prototype.has = function(key) {
    return typeof this.db[key] !== 'undefined';
  };

  Container.prototype.get = function(key) {
    return this.db[key];
  };

  Container.prototype.set = function(key, val, cb) {
    this.db[key] = val;
    this.save();
    return typeof cb === "function" ? cb(this.db) : void 0;
  };

  Container.prototype.del = function(key, cb) {
    if (this.has(key)) {
      delete this.db[key];
      this.save();
      return typeof cb === "function" ? cb(this.db) : void 0;
    } else {
      return false;
    }
  };

  Container.prototype.save = function(cb) {
    if (this.filename != null) {
      return jsonfile.writeFile(this.filename, this.db, {
        spaces: 2
      }, err(function() {
        if (typeof err !== "undefined" && err !== null) {
          return typeof cb === "function" ? cb(err) : void 0;
        }
      }));
    }
  };

  Container.prototype.hasParam = function(key) {
    return typeof this.db.params[key] !== 'undefined';
  };

  Container.prototype.getParam = function(key) {
    return this.db.params[key];
  };

  Container.prototype.setParam = function(key, val, cb) {
    this.db.params[key] = val;
    this.save();
    return typeof cb === "function" ? cb(this.db.params) : void 0;
  };

  Container.prototype.delParam = function(key, cb) {
    if (this.hasParam(key)) {
      delete this.db.params[key];
      this.save();
      return typeof cb === "function" ? cb(this.db) : void 0;
    } else {
      return false;
    }
  };

  return Container;

})();

module.exports = Container;

//# sourceMappingURL=Container.js.map
