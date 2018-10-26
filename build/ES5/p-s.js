import { PDX } from './p-d-x.js';
import { define } from "./node_modules/xtal-latx/define.js";
export var PS =
/*#__PURE__*/
function (_PDX) {
  babelHelpers.inherits(PS, _PDX);

  function PS() {
    babelHelpers.classCallCheck(this, PS);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PS).apply(this, arguments));
  }

  babelHelpers.createClass(PS, [{
    key: "pass",
    value: function pass(e) {
      this.passDown(e.target, e, 0);
    }
  }], [{
    key: "is",
    get: function get() {
      return 'p-s';
    }
  }]);
  return PS;
}(PDX);
define(PS); //# sourceMappingURL=p-s.js.map