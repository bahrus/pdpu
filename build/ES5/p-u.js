import { P } from './p.js';
/**
 * `p-u`
 *  Pass data from one element to a targeted DOM element elsewhere
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var PU =
/*#__PURE__*/
function (_P) {
  babelHelpers.inherits(PU, _P);

  function PU() {
    babelHelpers.classCallCheck(this, PU);
    return babelHelpers.possibleConstructorReturn(this, (PU.__proto__ || Object.getPrototypeOf(PU)).apply(this, arguments));
  }

  babelHelpers.createClass(PU, [{
    key: "pass",
    value: function pass(e) {
      var _this = this;

      this._cssPropMap.forEach(function (map) {
        var cssSel = map.cssSelector;
        var targetElement;
        var split = cssSel.split('/');
        var id = split[split.length - 1];

        if (cssSel.startsWith('/')) {
          targetElement = self[id];
        } else {
          var len = cssSel.startsWith('./') ? 0 : split.length;

          var host = _this.getHost(_this, 0, split.length);

          if (host) {
            if (host.shadowRoot) {
              targetElement = host.shadowRoot.getElementById(id);
              if (!targetElement) targetElement = host.querySelector('#' + id);
            } else {
              targetElement = host.querySelector('#' + id);
            }
          } else {
            throw 'Target Element Not found';
          }
        }

        _this.setVal(e, targetElement, map);
      });
    }
  }, {
    key: "getHost",
    value: function getHost(el, level, maxLevel) {
      var parent = el;

      while (parent = parent.parentElement) {
        if (parent.nodeType === 11) {
          var newLevel = level + 1;
          if (newLevel >= maxLevel) return parent['host'];
          return this.getHost(parent['host'], newLevel, maxLevel);
        } else if (parent.tagName === 'HTML') {
          return parent;
        }
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      babelHelpers.get(PU.prototype.__proto__ || Object.getPrototypeOf(PU.prototype), "connectedCallback", this).call(this);
      this._connected = true;
      this.onPropsChange();
    }
  }], [{
    key: "is",
    get: function get() {
      return 'p-u';
    }
  }]);
  return PU;
}(P);

if (!customElements.get(PU.is)) {
  customElements.define(PU.is, PU);
} //# sourceMappingURL=p-u.js.map