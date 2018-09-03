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

  var disabled = 'disabled';

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this;

          babelHelpers.classCallCheck(this, _class);
          _this = babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
          _this._evCount = {};
          return _this;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
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
        }, {
          key: "de",
          value: function de(name, detail) {
            var eventName = name + '-changed';
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this2 = this;

            props.forEach(function (prop) {
              if (_this2.hasOwnProperty(prop)) {
                var value = _this2[prop];
                delete _this2[prop];
                _this2[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",
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
      value: function define(name, fn, adjustClass) {
        var newClass =
        /*#__PURE__*/
        function (_XtallatX) {
          babelHelpers.inherits(newClass, _XtallatX);

          function newClass() {
            var _this3;

            babelHelpers.classCallCheck(this, newClass);
            _this3 = babelHelpers.possibleConstructorReturn(this, (newClass.__proto__ || Object.getPrototypeOf(newClass)).call(this));
            _this3._connected = false;
            _this3.style.display = 'none';
            return _this3;
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
          }], [{
            key: "is",
            get: function get() {
              return name;
            }
          }]);
          return newClass;
        }(XtallatX(HTMLElement));

        if (adjustClass) {
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