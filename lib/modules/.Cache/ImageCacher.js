'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageCacher = function () {
  function ImageCacher() {
    _classCallCheck(this, ImageCacher);

    this.img = {};
  }

  _createClass(ImageCacher, [{
    key: 'add',
    value: function add(id, img) {
      this.img[id] = img;
      return this.img;
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.img[id];
    }
  }, {
    key: 'has',
    value: function has(id) {
      return typeof this.img[id] !== 'undefined';
    }
  }]);

  return ImageCacher;
}();

var IC = new ImageCacher();
module.exports = IC;
//# sourceMappingURL=ImageCacher.js.map
