//@ts-check
(function () {
  function define(custEl) {
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
            var setOrRemove = val ? 'set' : 'remove';
            this[setOrRemove + 'Attribute'](name, trueVal || val);
          }
        }, {
          key: "to$",
          value: function to$(number) {
            var mod = number % 2;
            return (number - mod) / 2 + '-' + mod;
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

  var on = 'on';
  var noblock = 'noblock';
  var iff = 'if';
  var to = 'to';

  var P =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(P, _XtallatX);

    function P() {
      var _this3;

      babelHelpers.classCallCheck(this, P);
      _this3 = babelHelpers.possibleConstructorReturn(this, (P.__proto__ || Object.getPrototypeOf(P)).call(this));
      _this3.style.display = 'none';
      return _this3;
    }

    babelHelpers.createClass(P, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        var f = '_' + name;

        switch (name) {
          case iff:
          case on:
            this[f] = newVal;
            break;

          case to:
            this._destIsNA = newVal === '{NA}';
            if (newVal.endsWith('}')) newVal += ';';
            this._to = newVal;
            this.parseTo();
            if (this._lastEvent) this._handleEvent(this._lastEvent);
            break;

          case noblock:
            this[f] = newVal !== null;
        }

        babelHelpers.get(P.prototype.__proto__ || Object.getPrototypeOf(P.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      }
    }, {
      key: "getPreviousSib",
      value: function getPreviousSib() {
        var prevSibling = this;

        while (prevSibling && prevSibling.tagName.startsWith('P-')) {
          prevSibling = prevSibling.previousElementSibling;
        }

        return prevSibling;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this4 = this;

        this._upgradeProperties([on, to, noblock, 'input', iff]);

        setTimeout(function () {
          return _this4.doFake();
        }, 50);
      }
    }, {
      key: "doFake",
      value: function doFake() {
        if (!this._if && !this.hasAttribute('skip-init')) {
          var lastEvent = this._lastEvent;

          if (!lastEvent) {
            lastEvent = {
              target: this.getPreviousSib(),
              isFake: true
            };
          }

          if (this._handleEvent) this._handleEvent(lastEvent);
        }

        if (!this._addedSMO && this.addMutationObserver) {
          this.addMutationObserver(this, false);
          this._addedSMO = true;
        }
      }
    }, {
      key: "detach",
      value: function detach(prevSibling) {
        prevSibling.removeEventListener(this._on, this._boundHandleEvent);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var prevSibling = this.getPreviousSib();
        if (prevSibling && this._boundHandleEvent) this.detach(prevSibling);
        this.disconnectSiblingObserver();
      }
    }, {
      key: "_handleEvent",
      value: function _handleEvent(e) {
        if (this.hasAttribute('debug')) debugger;
        if (!e) return;
        if (e.stopPropagation && !this._noblock) e.stopPropagation();
        if (this._if && !e.target.matches(this._if)) return;
        this._lastEvent = e;

        if (!this._cssPropMap) {
          return;
        }

        this.pass(e);
      }
    }, {
      key: "attachEventListeners",
      value: function attachEventListeners() {
        var attrFilters = [];
        var prevSibling = this.getPreviousSib();
        if (!prevSibling) return;

        if (this._on === 'eval' && prevSibling.tagName === 'SCRIPT') {
          var evalObj = eval(prevSibling.innerHTML);

          if (typeof evalObj === 'function') {
            this._evalFn = evalObj;

            if (!this._destIsNA && !this.hasAttribute('skip-init')) {
              evalObj(this);
            }
          } else {
            this._handleEvent(evalObj);
          }
        } else {
          if (this._boundHandleEvent) {
            return;
          } else {
            this._boundHandleEvent = this._handleEvent.bind(this);
          }

          prevSibling.addEventListener(this._on, this._boundHandleEvent);
          prevSibling.removeAttribute('disabled');
        }
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        if (!this._connected || !this._on || !this._to) return;
        this.attachEventListeners();
      }
    }, {
      key: "parseMapping",
      value: function parseMapping(mapTokens, cssSelector) {
        var splitPropPointer = mapTokens[1].split(':');

        this._cssPropMap.push({
          cssSelector: cssSelector,
          propTarget: splitPropPointer[0],
          propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
        });
      }
    }, {
      key: "parseTo",
      value: function parseTo() {
        var _this5 = this;

        if (this._cssPropMap && this._to === this._lastTo) return;
        this._lastTo = this._to;
        this._cssPropMap = [];

        var splitPassDown = this._to.split('};');

        var onlyOne = splitPassDown.length <= 2;
        splitPassDown.forEach(function (passDownSelectorAndProp) {
          if (!passDownSelectorAndProp) return;
          var mapTokens = passDownSelectorAndProp.split('{');
          var cssSelector = mapTokens[0];

          if (!cssSelector && onlyOne) {
            cssSelector = '*';
            _this5._m = 1;
            _this5._hasMax = true;
          }

          _this5.parseMapping(mapTokens, cssSelector);
        });
      }
    }, {
      key: "setVal",
      value: function setVal(e, target, map) {
        var gpfp = this.getPropFromPath.bind(this);
        var propFromEvent = map.propSource ? gpfp(e, map.propSource) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, map, propFromEvent);
      }
    }, {
      key: "commit",
      value: function commit(target, map, val) {
        target[map.propTarget] = val;
      }
    }, {
      key: "getPropFromPath",
      value: function getPropFromPath(val, path) {
        if (!path || path === '.') return val;
        return this.getPropFromPathTokens(val, path.split('.'));
      }
    }, {
      key: "getPropFromPathTokens",
      value: function getPropFromPathTokens(val, pathTokens) {
        var context = val;
        var firstToken = true;
        var cp = 'composedPath';
        var cp_ = cp + '_';
        pathTokens.forEach(function (token) {
          if (context) {
            if (firstToken && context[cp]) {
              firstToken = false;
              var cpath = token.split(cp_);

              if (cpath.length === 1) {
                context = context[cpath[0]];
              } else {
                context = context[cp]()[parseInt(cpath[1])];
              }
            } else {
              context = context[token];
            }
          }
        });
        return context;
      }
    }, {
      key: "disconnectSiblingObserver",
      value: function disconnectSiblingObserver() {
        if (this._siblingObserver) this._siblingObserver.disconnect();
      }
    }, {
      key: "on",
      get: function get() {
        return this._on;
      },
      set: function set(val) {
        this.attr(on, val);
      }
    }, {
      key: "to",
      get: function get() {
        return this._to;
      },
      set: function set(val) {
        this.attr(to, val);
      }
    }, {
      key: "noblock",
      get: function get() {
        return this._noblock;
      },
      set: function set(val) {
        this.attr(noblock, val, '');
      }
    }, {
      key: "if",
      get: function get() {
        return this._if;
      },
      set: function set(val) {
        this.attr(iff, val);
      }
    }, {
      key: "input",
      get: function get() {
        return this._input;
      },
      set: function set(val) {
        this._input = val;

        if (this._evalFn && (!this._destIsNA || val && !val.isFake)) {
          var returnObj = this._evalFn(this);

          if (returnObj) {
            this._handleEvent(returnObj);
          }
        } //this._handleEvent(this._lastEvent);

      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(P.__proto__ || Object.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff]);
      }
    }]);
    return P;
  }(XtallatX(HTMLElement));

  var m = 'm';
  var p_d_if = 'p-d-if';
  var PDIf = 'PDIf';
  var _addedSMO = '_addedSMO'; //addedSiblingMutationObserver

  /**
   * `p-d`
   *  Pass data from one element down the DOM tree to other elements
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var PD =
  /*#__PURE__*/
  function (_P) {
    babelHelpers.inherits(PD, _P);

    function PD() {
      babelHelpers.classCallCheck(this, PD);
      return babelHelpers.possibleConstructorReturn(this, (PD.__proto__ || Object.getPrototypeOf(PD)).apply(this, arguments));
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        this.passDown(this.nextElementSibling, e, 0);
      }
    }, {
      key: "passDown",
      value: function passDown(start, e, count) {
        var _this6 = this;

        var nextSibling = start;

        while (nextSibling) {
          if (nextSibling.tagName !== 'SCRIPT') {
            this._cssPropMap.forEach(function (map) {
              if (map.cssSelector === '*' || nextSibling.matches && nextSibling.matches(map.cssSelector)) {
                count++;

                _this6.setVal(e, nextSibling, map);
              }

              var fec = nextSibling.firstElementChild;

              if (_this6.id && fec && nextSibling.hasAttribute(p_d_if)) {
                //if(!nextSibling[PDIf]) nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
                if (_this6.matches(nextSibling.getAttribute(p_d_if))) {
                  _this6.passDown(fec, e, count);

                  var addedSMOTracker = nextSibling[_addedSMO];
                  if (!addedSMOTracker) addedSMOTracker = nextSibling[_addedSMO] = {};

                  if (!addedSMOTracker[_this6.id]) {
                    _this6.addMutationObserver(nextSibling, true);

                    nextSibling[_addedSMO][_this6.id] = true;
                  }
                }
              }
            });

            if (this._hasMax && count >= this._m) break;
          }

          nextSibling = nextSibling.nextElementSibling;
        }
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
          case m:
            if (newVal !== null) {
              this._m = parseInt(newVal);
              this._hasMax = true;
            } else {
              this._hasMax = false;
            }

        }

        babelHelpers.get(PD.prototype.__proto__ || Object.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
        this.onPropsChange();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        babelHelpers.get(PD.prototype.__proto__ || Object.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

        this._upgradeProperties([m]);

        this._connected = true;
        this.onPropsChange();
      }
    }, {
      key: "addMutationObserver",
      value: function addMutationObserver(baseElement, isParent) {
        var _this7 = this;

        var elementToObserve = isParent ? baseElement : baseElement.parentElement;
        if (!elementToObserve) return; //TODO

        this._siblingObserver = new MutationObserver(function (mutationsList) {
          if (!_this7._lastEvent) return; //this.passDownProp(this._lastResult);

          _this7._handleEvent(_this7._lastEvent);
        });

        this._siblingObserver.observe(elementToObserve, {
          childList: true
        });
      }
    }, {
      key: "m",
      get: function get() {
        return this._m;
      },
      set: function set(val) {
        this.setAttribute(val.toString());
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-d';
      }
    }, {
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(PD.__proto__ || Object.getPrototypeOf(PD), "observedAttributes", this).concat([m]);
      }
    }]);
    return PD;
  }(P);

  define(PD);
  /**
   * `p-u`
   *  Pass data from one element to a targeted DOM element elsewhere
   *
   * @customElement
   * @polymer
   * @demo demo/index.html
   */

  var PU =
  /*#__PURE__*/
  function (_P2) {
    babelHelpers.inherits(PU, _P2);

    function PU() {
      babelHelpers.classCallCheck(this, PU);
      return babelHelpers.possibleConstructorReturn(this, (PU.__proto__ || Object.getPrototypeOf(PU)).apply(this, arguments));
    }

    babelHelpers.createClass(PU, [{
      key: "pass",
      value: function pass(e) {
        var _this8 = this;

        this._cssPropMap.forEach(function (map) {
          var cssSel = map.cssSelector;
          var targetElement;
          var split = cssSel.split('/');
          var id = split[split.length - 1];

          if (cssSel.startsWith('/')) {
            targetElement = self[id];
          } else {
            var len = cssSel.startsWith('./') ? 0 : split.length;

            var host = _this8.getHost(_this8, 0, split.length);

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

          _this8.setVal(e, targetElement, map);
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

  define(PU);
})();