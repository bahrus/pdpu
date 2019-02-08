import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
import { define as _define } from "./node_modules/xtal-latx/define.js";
import { destruct } from "./node_modules/xtal-latx/destruct.js";
export var PDQ =
/*#__PURE__*/
function () {
  function PDQ() {
    babelHelpers.classCallCheck(this, PDQ);
  }

  babelHelpers.createClass(PDQ, null, [{
    key: "define",
    value: function define(name, fn) {
      var adjustClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var newClass =
      /*#__PURE__*/
      function (_XtallatX) {
        babelHelpers.inherits(newClass, _XtallatX);

        function newClass() {
          var _this;

          babelHelpers.classCallCheck(this, newClass);
          _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(newClass).call(this));
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
            babelHelpers.get(babelHelpers.getPrototypeOf(newClass.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);

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
        }], [{
          key: "is",
          get: function get() {
            return name;
          }
        }]);
        return newClass;
      }(XtallatX(HTMLElement));

      var p = newClass.prototype;
      var fnString = fn.toString().trim();

      if (fnString.startsWith('({')) {
        var iPos = fnString.indexOf('})', 2);
        var args = fnString.substring(2, iPos).split(',').map(function (s) {
          return s.trim();
        }); //const p = newClass.prototype;

        args.forEach(function (arg) {
          destruct(p, arg, 'input');
        });
      }

      if (adjustClass !== null) {
        if (!adjustClass(newClass)) return;
      }

      _define(newClass);
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