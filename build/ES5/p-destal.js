import { PDX } from './p-d-x.js';
import { define } from "./node_modules/xtal-latx/define.js";
export var PDestal =
/*#__PURE__*/
function (_PDX) {
  babelHelpers.inherits(PDestal, _PDX);

  function PDestal() {
    var _this;

    babelHelpers.classCallCheck(this, PDestal);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDestal).apply(this, arguments));
    _this._previousValues = {};
    return _this;
  }

  babelHelpers.createClass(PDestal, [{
    key: "getPreviousSib",
    value: function getPreviousSib() {
      var parent = this;

      while (parent = parent.parentNode) {
        if (parent.nodeType === 11) {
          return parent['host'];
        } else if (parent.tagName.indexOf('-') > -1) {
          return parent;
        } else if (parent.tagName === 'HTML') {
          this.watchLocation();
          return null;
        }
      }
    }
  }, {
    key: "doFakeEvent",
    value: function doFakeEvent() {
      var _this2 = this;

      var split = this._on.split(',');

      var searchParams = new URLSearchParams(location.search);
      var changedVal = false;
      split.forEach(function (param) {
        var trimmedParam = param.substr(1, param.length - 2);
        var searchParm = searchParams.get(trimmedParam);

        if (!changedVal && searchParm !== _this2._previousValues[trimmedParam]) {
          changedVal = true;
        }

        _this2._previousValues[trimmedParam] = searchParm;
      });

      if (changedVal) {
        var fakeEvent = {
          target: this._previousValues
        };

        this._hndEv(fakeEvent);
      }
    }
  }, {
    key: "watchLocation",
    value: function watchLocation() {
      var _this3 = this;

      window.addEventListener('popstate', function (e) {
        _this3.doFakeEvent();
      });
      this.doFakeEvent();
    }
  }], [{
    key: "is",
    get: function get() {
      return 'p-destal';
    }
  }]);
  return PDestal;
}(PDX);
define(PDestal); //# sourceMappingURL=p-destal.js.map