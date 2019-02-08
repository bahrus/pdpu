import { P } from './p.js';
import { define } from "./node_modules/xtal-latx/define.js";
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
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PU).apply(this, arguments));
  }

  babelHelpers.createClass(PU, [{
    key: "pass",
    value: function pass(e) {
      var cssSel = this.to;
      var split = cssSel.split('/');
      var id = split[split.length - 1];
      var targetElement;

      if (cssSel.startsWith('/')) {
        targetElement = self[cssSel];
      } else {
        var len = cssSel.startsWith('./') ? 0 : split.length;
        var host = this.getHost(this, 0, len);

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

      this.setVal(e, targetElement);
    }
  }, {
    key: "getHost",
    value: function getHost(el, level, maxLevel) {
      var parent = el;

      while (parent = parent.parentNode) {
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
      babelHelpers.get(babelHelpers.getPrototypeOf(PU.prototype), "connectedCallback", this).call(this);
    }
  }], [{
    key: "is",
    get: function get() {
      return 'p-u';
    }
  }]);
  return PU;
}(P);
define(PU);