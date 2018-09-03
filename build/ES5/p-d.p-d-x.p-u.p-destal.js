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
      _this3._addedSMO = false;
      _this3._connected = false;
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
            break;
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

        this.style.display = 'none';

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
        this.disconnect();
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
        return this.getProp(val, path.split('.'));
      }
    }, {
      key: "getProp",
      value: function getProp(val, pathTokens) {
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
      key: "disconnect",
      value: function disconnect() {
        if (this._sibObs) this._sibObs.disconnect();
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

        var nextSib = start;

        while (nextSib) {
          if (nextSib.tagName !== 'SCRIPT') {
            this._cssPropMap.forEach(function (map) {
              if (map.cssSelector === '*' || nextSib.matches && nextSib.matches(map.cssSelector)) {
                count++;

                _this6.setVal(e, nextSib, map);
              }

              var fec = nextSib.firstElementChild;

              if (_this6.id && fec && nextSib.hasAttribute(p_d_if)) {
                //if(!nextSibling[PDIf]) nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
                if (_this6.matches(nextSib.getAttribute(p_d_if))) {
                  _this6.passDown(fec, e, count);

                  var addedSMOTracker = nextSib[_addedSMO];
                  if (!addedSMOTracker) addedSMOTracker = nextSib[_addedSMO] = {};

                  if (!addedSMOTracker[_this6.id]) {
                    if (nextSib !== null) _this6.addMutObs(nextSib, true);
                    nextSib[_addedSMO][_this6.id] = true;
                  }
                }
              }
            });

            if (this._hasMax && count >= this._m) break;
          }

          nextSib = nextSib.nextElementSibling;
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
      key: "addMutObs",
      value: function addMutObs(baseElement, isParent) {
        var _this7 = this;

        var elementToObserve = isParent ? baseElement : baseElement.parentElement;
        if (!elementToObserve) return; //TODO

        this._sibObs = new MutationObserver(function (mutationsList) {
          if (!_this7._lastEvent) return; //this.passDownProp(this._lastResult);

          _this7._handleEvent(_this7._lastEvent);
        });

        this._sibObs.observe(elementToObserve, {
          childList: true
        });
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
        return babelHelpers.get(PD.__proto__ || Object.getPrototypeOf(PD), "observedAttributes", this).concat([m]);
      }
    }]);
    return PD;
  }(P);

  define(PD); //const attrib_filter = 'attrib-filter';

  var PDX =
  /*#__PURE__*/
  function (_PD) {
    babelHelpers.inherits(PDX, _PD);

    function PDX() {
      babelHelpers.classCallCheck(this, PDX);
      return babelHelpers.possibleConstructorReturn(this, (PDX.__proto__ || Object.getPrototypeOf(PDX)).apply(this, arguments));
    }

    babelHelpers.createClass(PDX, [{
      key: "parseMapping",
      value: function parseMapping(mapTokens, cssSelector) {
        var _this8 = this;

        var splitPropPointer1 = mapTokens[1].split(';');
        splitPropPointer1.forEach(function (token) {
          var splitPropPointer = token.split(':');

          _this8._cssPropMap.push({
            cssSelector: cssSelector,
            propTarget: splitPropPointer[0],
            propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
          });
        });
      }
    }, {
      key: "commit",
      value: function commit(target, map, val) {
        if (map.propSource === '.' && map.propTarget === '.') {
          Object.assign(target, val);
          return;
        }

        var targetPath = map.propTarget;

        if (targetPath.startsWith('.')) {
          var cssClass = targetPath.substr(1);
          var method = val ? 'add' : 'remove';
          target.classList[method](cssClass);
        } else if (targetPath.indexOf('.') > -1) {
          var pathTokens = targetPath.split('.'); // const lastToken = pathTokens.pop();

          this.createNestedProp(target, pathTokens, val);
        } else {
          target[targetPath] = val;
        }
      }
    }, {
      key: "createNestedProp",
      value: function createNestedProp(target, pathTokens, val) {
        var firstToken = pathTokens.shift();
        var tft = target[firstToken];
        var returnObj = babelHelpers.defineProperty({}, firstToken, tft ? tft : {});
        var targetContext = returnObj[firstToken];
        var lastToken = pathTokens.pop();
        pathTokens.forEach(function (token) {
          var newContext = targetContext[token];

          if (!newContext) {
            newContext = targetContext[token] = {};
          }

          targetContext = newContext;
        });
        targetContext[lastToken] = val; //this controversial line is to force the target to see new properties, even though we are updating nested properties.
        //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 

        try {
          Object.assign(target, returnObj);
        } catch (e) {}

        ;
      }
    }, {
      key: "attachEventListeners",
      value: function attachEventListeners() {
        var _this9 = this;

        if (this._on[0] !== '[') {
          babelHelpers.get(PDX.prototype.__proto__ || Object.getPrototypeOf(PDX.prototype), "attachEventListeners", this).call(this);
          return;
        }

        var prevSibling = this.getPreviousSib();
        if (!prevSibling) return;

        var split = this._on.split(',').map(function (s) {
          return s.substr(1, s.length - 2);
        });

        var config = {
          attributes: true,
          attributeFilter: split
        };
        this._attributeObserver = new MutationObserver(function (mutationRecords) {
          var values = {};
          split.forEach(function (attrib) {
            values[attrib] = prevSibling.getAttribute(attrib);
          });
          var fakeEvent = {
            mutationRecords: mutationRecords,
            values: values,
            target: prevSibling
          };

          _this9._handleEvent(fakeEvent);
        });

        this._attributeObserver.observe(prevSibling, config);
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        if (this._attributeObserver) this._attributeObserver.disconnect();
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.disconnect();
        babelHelpers.get(PDX.prototype.__proto__ || Object.getPrototypeOf(PDX.prototype), "disconnectedCallback", this).call(this);
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-d-x';
      }
    }]);
    return PDX;
  }(PD);

  if (!customElements.get(PDX.is)) customElements.define(PDX.is, PDX);
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
        var _this10 = this;

        this._cssPropMap.forEach(function (map) {
          var cssSel = map.cssSelector;
          var targetElement;
          var split = cssSel.split('/');
          var id = split[split.length - 1];

          if (cssSel.startsWith('/')) {
            targetElement = self[id];
          } else {
            var len = cssSel.startsWith('./') ? 0 : split.length;

            var host = _this10.getHost(_this10, 0, split.length);

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

          _this10.setVal(e, targetElement, map);
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

  var PDestal =
  /*#__PURE__*/
  function (_PDX) {
    babelHelpers.inherits(PDestal, _PDX);

    function PDestal() {
      var _this11;

      babelHelpers.classCallCheck(this, PDestal);
      _this11 = babelHelpers.possibleConstructorReturn(this, (PDestal.__proto__ || Object.getPrototypeOf(PDestal)).apply(this, arguments));
      _this11._previousValues = {};
      return _this11;
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
        var _this12 = this;

        var split = this._on.split(',');

        var searchParams = new URLSearchParams(location.search);
        var changedVal = false;
        split.forEach(function (param) {
          var trimmedParam = param.substr(1, param.length - 2);
          var searchParm = searchParams.get(trimmedParam);

          if (!changedVal && searchParm !== _this12._previousValues[trimmedParam]) {
            changedVal = true;
          }

          _this12._previousValues[trimmedParam] = searchParm;
        });

        if (changedVal) {
          var fakeEvent = {
            target: this._previousValues
          };

          this._handleEvent(fakeEvent);
        }
      }
    }, {
      key: "watchLocation",
      value: function watchLocation() {
        var _this13 = this;

        window.addEventListener('popstate', function (e) {
          _this13.doFakeEvent();
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

  define(PDestal);
})();