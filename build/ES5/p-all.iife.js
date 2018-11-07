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
          var _this;

          babelHelpers.classCallCheck(this, _class);
          _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this._evCount = {};
          return _this;
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
          value: function de(name, detail, asIs) {
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

  function createNestedProp(target, pathTokens, val, clone) {
    var firstToken = pathTokens.shift();
    var tft = target[firstToken];
    var returnObj = babelHelpers.defineProperty({}, firstToken, tft ? tft : {});
    var tc = returnObj[firstToken]; //targetContext

    var lastToken = pathTokens.pop();
    pathTokens.forEach(function (token) {
      var newContext = tc[token];

      if (!newContext) {
        newContext = tc[token] = {};
      }

      tc = newContext;
    });

    if (tc[lastToken] && babelHelpers.typeof(val) === 'object') {
      Object.assign(tc[lastToken], val);
    } else {
      if (lastToken === undefined) {
        returnObj[firstToken] = val;
      } else {
        tc[lastToken] = val;
      }
    } //this controversial line is to force the target to see new properties, even though we are updating nested properties.
    //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 


    if (clone) try {
      Object.assign(target, returnObj);
    } catch (e) {}
    ;
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
      _this3 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(P).call(this));
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
            if (this._lastEvent) this._hndEv(this._lastEvent);
            break;

          case noblock:
            this[f] = newVal !== null;
            break;
        }

        babelHelpers.get(babelHelpers.getPrototypeOf(P.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      }
      /**
       * get previous sibling
       */

    }, {
      key: "getPSib",
      value: function getPSib() {
        var pS = this;

        while (pS && pS.tagName.startsWith('P-')) {
          pS = pS.previousElementSibling;
        }

        return pS;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this4 = this;

        this.style.display = 'none';

        this._upgradeProperties([on, to, noblock, iff]);

        setTimeout(function () {
          return _this4.doFake();
        }, 50);
      } //_addedSMO = false;

    }, {
      key: "doFake",
      value: function doFake() {
        if (!this._if && !this.hasAttribute('skip-init')) {
          var lastEvent = this._lastEvent;

          if (!lastEvent) {
            lastEvent = {
              target: this.getPSib(),
              isFake: true
            };
          }

          if (this._hndEv) this._hndEv(lastEvent);
        } // if(!(<any>this)._addedSMO && (<any>this).addMutationObserver){
        //     (<any>this).addMutationObserver(<any>this as HTMLElement, false);
        //     this._addedSMO = true;
        // }

      }
    }, {
      key: "detach",
      value: function detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var pS = this.getPSib();
        if (pS && this._bndHndlEv) this.detach(pS);
      }
    }, {
      key: "_hndEv",
      value: function _hndEv(e) {
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
      key: "attchEvListnrs",
      value: function attchEvListnrs() {
        var attrFilters = [];
        var pS = this.getPSib();
        if (!pS) return;

        if (this._bndHndlEv) {
          return;
        } else {
          this._bndHndlEv = this._hndEv.bind(this);
        }

        pS.addEventListener(this._on, this._bndHndlEv);
        var da = pS.getAttribute('disabled');

        if (da !== null) {
          if (da.length === 0 || da === "1") {
            pS.removeAttribute('disabled');
          } else {
            pS.setAttribute('disabled', (parseInt(da) - 1).toString());
          }
        }
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        if (!this._connected || !this._on || !this._to) return;
        this.attchEvListnrs();
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
        splitPassDown.forEach(function (pdItem) {
          if (!pdItem) return;
          var mT = pdItem.split('{');
          var cssSel = mT[0];

          if (!cssSel && onlyOne) {
            cssSel = '*';
            _this5._m = 1;
            _this5._hasMax = true;
          }

          _this5.parseMapping(mT, cssSel);
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
        if (val === undefined) return;
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
      } // _input: any;
      // get input(){
      //     return this._input;
      // }
      // set input(val){
      //     this._input = val;
      // }

    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff]);
      }
    }]);
    return P;
  }(XtallatX(HTMLElement));

  var m = 'm';
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
      var _this6;

      babelHelpers.classCallCheck(this, PD);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
      _this6._pdNavDown = []; //_hasMax!: boolean;

      _this6._m = Infinity;
      return _this6;
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        var _this7 = this;

        this._lastEvent = e;
        this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

        this._pdNavDown.forEach(function (pdnd) {
          _this7.applyProps(pdnd);
        });

        this.attr('pds', '👂');
      }
    }, {
      key: "applyProps",
      value: function applyProps(pd) {
        var _this8 = this;

        pd.getMatches().forEach(function (el) {
          _this8._cssPropMap.filter(function (map) {
            return map.cssSelector === pd.match;
          }).forEach(function (map) {
            _this8.setVal(_this8._lastEvent, el, map);
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
        var _this9 = this;

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

        this._upgradeProperties([m]);

        this._connected = true;
        this.attr('pds', '📞');
        var bndApply = this.applyProps.bind(this);

        this._cssPropMap.forEach(function (pm) {
          var pdnd = new PDNavDown(_this9, pm.cssSelector, function (nd) {
            return bndApply(nd);
          }, _this9.m);
          pdnd.root = _this9;
          pdnd.init();

          _this9._pdNavDown.push(pdnd);
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

  define(PD); //const attrib_filter = 'attrib-filter';

  var PDX =
  /*#__PURE__*/
  function (_PD) {
    babelHelpers.inherits(PDX, _PD);

    function PDX() {
      babelHelpers.classCallCheck(this, PDX);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDX).apply(this, arguments));
    }

    babelHelpers.createClass(PDX, [{
      key: "parseMapping",
      value: function parseMapping(mapTokens, cssSelector) {
        var _this10 = this;

        var splitPropPointer1 = mapTokens[1].split(';');
        splitPropPointer1.forEach(function (token) {
          var splitPropPointer = token.split(':');

          _this10._cssPropMap.push({
            cssSelector: cssSelector,
            propTarget: splitPropPointer[0],
            propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
          });
        });
      }
    }, {
      key: "commit",
      value: function commit(target, map, val) {
        if (val === undefined) return;

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

          createNestedProp(target, pathTokens, val, true);
        } else {
          target[targetPath] = val;
        }
      }
    }, {
      key: "attchEvListnrs",
      value: function attchEvListnrs() {
        var _this11 = this;

        if (this._on[0] !== '[') {
          babelHelpers.get(babelHelpers.getPrototypeOf(PDX.prototype), "attchEvListnrs", this).call(this);
          return;
        }

        var prevSibling = this.getPSib();
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

          _this11._hndEv(fakeEvent);
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
        babelHelpers.get(babelHelpers.getPrototypeOf(PDX.prototype), "disconnectedCallback", this).call(this);
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-d-x';
      }
    }]);
    return PDX;
  }(PD);

  define(PDX);
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
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PU).apply(this, arguments));
    }

    babelHelpers.createClass(PU, [{
      key: "pass",
      value: function pass(e) {
        var _this12 = this;

        this._cssPropMap.forEach(function (map) {
          var cssSel = map.cssSelector;
          var targetElement;
          var split = cssSel.split('/');
          var id = split[split.length - 1];

          if (cssSel.startsWith('/')) {
            targetElement = self[id];
          } else {
            var len = cssSel.startsWith('./') ? 0 : split.length;

            var host = _this12.getHost(_this12, 0, split.length);

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

          _this12.setVal(e, targetElement, map);
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
        babelHelpers.get(babelHelpers.getPrototypeOf(PU.prototype), "connectedCallback", this).call(this);
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
      var _this13;

      babelHelpers.classCallCheck(this, PDestal);
      _this13 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDestal).apply(this, arguments));
      _this13._previousValues = {};
      return _this13;
    }

    babelHelpers.createClass(PDestal, [{
      key: "getPSib",
      value: function getPSib() {
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
        var _this14 = this;

        var split = this._on.split(',');

        var searchParams = new URLSearchParams(location.search);
        var changedVal = false;
        split.forEach(function (param) {
          var trimmedParam = param.substr(1, param.length - 2);
          var searchParm = searchParams.get(trimmedParam);

          if (!changedVal && searchParm !== _this14._previousValues[trimmedParam]) {
            changedVal = true;
          }

          _this14._previousValues[trimmedParam] = searchParm;
        });

        if (changedVal) {
          var fakeEvent = {
            target: this._previousValues
          };

          this._hndEv(fakeEvent);
        }
      }
    }, {
      key: "watchLocation",
      value: function watchLocation() {
        var _this15 = this;

        window.addEventListener('popstate', function (e) {
          _this15.doFakeEvent();
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

  var PS =
  /*#__PURE__*/
  function (_PDX2) {
    babelHelpers.inherits(PS, _PDX2);

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

  define(PS);
})();