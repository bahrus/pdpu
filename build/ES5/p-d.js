import { P } from './p.js';
import { define } from "./node_modules/xtal-latx/define.js";
import { PDNavDown } from './PDNavDown.js';
var m = 'm';
/**
 * `p-d`
 *  Pass data from one element down the DOM tree to other elements
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var PD =
/*#__PURE__*/
function (_P) {
  babelHelpers.inherits(PD, _P);

  function PD() {
    var _this;

    babelHelpers.classCallCheck(this, PD);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
    _this._pdNavDown = []; //_hasMax!: boolean;

    _this._m = Infinity;
    return _this;
  }

  babelHelpers.createClass(PD, [{
    key: "pass",
    value: function pass(e) {
      var _this2 = this;

      this._lastEvent = e;
      this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

      this._pdNavDown.forEach(function (pdnd) {
        _this2.applyProps(pdnd);
      });

      this.attr('pds', '👂');
    }
  }, {
    key: "applyProps",
    value: function applyProps(pd) {
      var _this3 = this;

      pd.getMatches().forEach(function (el) {
        _this3._cssPropMap.filter(function (map) {
          return map.cssSelector === pd.match;
        }).forEach(function (map) {
          _this3.setVal(_this3._lastEvent, el, map);
        });
      });
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldVal, newVal) {
      switch (name) {
        case m:
          if (newVal !== null) {
            this._m = parseInt(newVal); //this._hasMax = true;
          } else {//this._hasMax = false;
            }

      }

      babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      this.onPropsChange();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this4 = this;

      babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

      this._upgradeProperties([m]);

      this._connected = true;
      this.attr('pds', '📞');
      var bndApply = this.applyProps.bind(this);

      this._cssPropMap.forEach(function (pm) {
        var pdnd = new PDNavDown(_this4, pm.cssSelector, function (nd) {
          return bndApply(nd);
        }, _this4.m);
        pdnd.init();

        _this4._pdNavDown.push(pdnd);
      });

      this.onPropsChange();
    }
  }, {
    key: "m",
    get: function get() {
      return this._m;
    },
    set: function set(val) {
      this.attr(m, val.toString());
    }
  }], [{
    key: "is",
    get: function get() {
      return 'p-d';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(babelHelpers.getPrototypeOf(PD), "observedAttributes", this).concat([m]);
    }
  }]);
  return PD;
}(P);
define(PD); //# sourceMappingURL=p-d.js.map