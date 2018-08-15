import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
export var PDQ =
/*#__PURE__*/
function () {
  function PDQ() {
    babelHelpers.classCallCheck(this, PDQ);
  }

  babelHelpers.createClass(PDQ, null, [{
    key: "define",
    value: function define(name, fn, adjustClass) {
      var newClass =
      /*#__PURE__*/
      function (_XtallatX) {
        babelHelpers.inherits(newClass, _XtallatX);

        function newClass() {
          var _this;

          babelHelpers.classCallCheck(this, newClass);
          _this = babelHelpers.possibleConstructorReturn(this, (newClass.__proto__ || Object.getPrototypeOf(newClass)).call(this));
          _this._connected = false;
          _this.style.display = 'none';
          return _this;
        }

        babelHelpers.createClass(newClass, [{
          key: "connectedCallback",
          value: function connectedCallback() {
            this._upgradeProperties(['input', 'disabled']);

            this._connected = true;
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            babelHelpers.get(newClass.prototype.__proto__ || Object.getPrototypeOf(newClass.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);

            switch (name) {
              case 'input':
                this.input = JSON.parse(newVal);
                break;

              default:
                this.onPropsChange();
            }
          }
        }, {
          key: "onPropsChange",
          value: function onPropsChange() {
            if (this._disabled) return;
            var val = this.value;
            this.de('value', {
              value: val
            });
            var valueSummary = null;

            switch (babelHelpers.typeof(val)) {
              case 'string':
              case 'boolean':
              case 'number':
                valueSummary = val.toString().substr(0, 10);
                break;

              case 'object':
                if (!val) return;

                if (Array.isArray(val)) {
                  valueSummary = val.length;
                } else {
                  valueSummary = Object.keys(val).toString();
                }

            }

            if (valueSummary !== null) this.setAttribute('value-ish', valueSummary);
          }
        }, {
          key: "input",
          get: function get() {
            return this._input;
          },
          set: function set(val) {
            this._input = val;
            this.value = fn(val);
            this.onPropsChange();
          }
        }]);
        return newClass;
      }(XtallatX(HTMLElement));

      if (adjustClass) {
        if (!adjustClass(newClass)) return;
      }

      customElements.define(name, newClass);
    }
  }, {
    key: "$",
    value: function $(str) {
      return str.replace(/(<([^>]+)>)/ig, '');
    }
  }]);
  return PDQ;
}();
customElements['PDQ'] = PDQ; // for ES6 Module challenged browsers.
//# sourceMappingURL=PDQ.js.map