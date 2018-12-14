//@ts-check
(function () {
  function _define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var debounce = function debounce(fn, time) {
    var timeout;
    return function () {
      var _this = this,
          _arguments = arguments;

      var functionCall = function functionCall() {
        return fn.apply(_this, _arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this2;

          babelHelpers.classCallCheck(this, _class);
          _this2 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this2._evCount = {};
          return _this2;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
              case disabled:
                this._disabled = newVal !== null;
                break;
            }
          }
          /**
           * Dispatch Custom Event
           * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
           * @param detail Information to be passed with the event
           * @param asIs If true, don't append event name with '-changed'
           */

        }, {
          key: "de",
          value: function de(name, detail) {
            var asIs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this3 = this;

            props.forEach(function (prop) {
              if (_this3.hasOwnProperty(prop)) {
                var value = _this3[prop];
                delete _this3[prop];
                _this3[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  var PDQ =
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
            var _this4;

            babelHelpers.classCallCheck(this, newClass);
            _this4 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(newClass).call(this));
            _this4._connected = false;
            _this4.style.display = 'none';
            return _this4;
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
})();