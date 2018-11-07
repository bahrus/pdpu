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

  var NavDown =
  /*#__PURE__*/
  function () {
    function NavDown(seed, match, notify, max) {
      var mutDebounce = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 50;
      babelHelpers.classCallCheck(this, NavDown);
      this.seed = seed;
      this.match = match;
      this.notify = notify;
      this.max = max;
      this.mutDebounce = mutDebounce; //this.init();
    }

    babelHelpers.createClass(NavDown, [{
      key: "init",
      value: function init() {
        var _this3 = this;

        this._debouncer = debounce(function () {
          _this3.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
      }
    }, {
      key: "addMutObs",
      value: function addMutObs(elToObs) {
        var _this4 = this;

        if (elToObs === null || elToObs._addedMutObs) return;
        this._mutObs = new MutationObserver(function (m) {
          _this4._debouncer(true);
        });

        this._mutObs.observe(elToObs, {
          childList: true
        });

        elToObs._addedMutObs = true;
      }
    }, {
      key: "sibCheck",
      value: function sibCheck(sib, c) {}
    }, {
      key: "sync",
      value: function sync() {
        var c = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var isF = typeof this.match === 'function';
        this.matches = [];
        var ns = this.seed.nextElementSibling;

        while (ns !== null) {
          var isG = isF ? this.match(ns) : ns.matches(this.match);

          if (isG) {
            this.matches.push(ns);
            c++;

            if (c >= this.max) {
              this.notify(this);
              return;
            }

            ;
          }

          this.sibCheck(ns, c);
          ns = ns.nextElementSibling;
        }

        this.notify(this);
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        this._mutObs.disconnect();
      }
    }]);
    return NavDown;
  }();

  var p_d_if = 'p-d-if';

  var PDNavDown =
  /*#__PURE__*/
  function (_NavDown) {
    babelHelpers.inherits(PDNavDown, _NavDown);

    function PDNavDown() {
      var _this5;

      babelHelpers.classCallCheck(this, PDNavDown);
      _this5 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDNavDown).apply(this, arguments));
      _this5.children = [];
      return _this5;
    }

    babelHelpers.createClass(PDNavDown, [{
      key: "sibCheck",
      value: function sibCheck(sib, c) {
        if (sib.__addMutObs) return;
        var attr = sib.getAttribute(p_d_if);

        if (attr === null) {
          sib.__addMutObs = true;
          return;
        }

        var fec = sib.firstElementChild;
        if (fec === null) return;

        if (attr !== null) {
          if (this.seed.matches(attr)) {
            var pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
            this.children.push(pdnd);
            sib.__addMutObs = true;
          }
        }
      }
    }, {
      key: "getMatches",
      value: function getMatches() {
        var ret = this.matches;
        this.children.forEach(function (child) {
          return ret.concat(child.getMatches());
        });
        return ret;
      }
    }]);
    return PDNavDown;
  }(NavDown);

  var on = 'on';
  var noblock = 'noblock';
  var iff = 'if';
  var to = 'to';

  var P =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(P, _XtallatX);

    function P() {
      var _this6;

      babelHelpers.classCallCheck(this, P);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(P).call(this));
      _this6._connected = false;
      return _this6;
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
        var _this7 = this;

        this.style.display = 'none';

        this._upgradeProperties([on, to, noblock, iff]);

        setTimeout(function () {
          return _this7.doFake();
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
        this.disconnect();
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
        var _this8 = this;

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
            _this8._m = 1;
            _this8._hasMax = true;
          }

          _this8.parseMapping(mT, cssSel);
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
      var _this9;

      babelHelpers.classCallCheck(this, PD);
      _this9 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
      _this9._pdNavDown = []; //_hasMax!: boolean;

      _this9._m = Infinity;
      return _this9;
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        var _this10 = this;

        this._lastEvent = e;
        this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

        this._pdNavDown.forEach(function (pdnd) {
          _this10.applyProps(pdnd);
        });

        this.attr('pds', '👂');
      }
    }, {
      key: "applyProps",
      value: function applyProps(pd) {
        var _this11 = this;

        pd.getMatches().forEach(function (el) {
          _this11._cssPropMap.filter(function (map) {
            return map.cssSelector === pd.match;
          }).forEach(function (map) {
            _this11.setVal(_this11._lastEvent, el, map);
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
        var _this12 = this;

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

        this._upgradeProperties([m]);

        this._connected = true;
        this.attr('pds', '📞');
        var bndApply = this.applyProps.bind(this);

        this._cssPropMap.forEach(function (pm) {
          var pdnd = new PDNavDown(_this12, pm.cssSelector, function (nd) {
            return bndApply(nd);
          }, _this12.m);
          pdnd.init();

          _this12._pdNavDown.push(pdnd);
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

  define(PD);
})();