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

  var NavDown =
  /*#__PURE__*/
  function () {
    function NavDown(seed, match, notify, max) {
      var ignore = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var mutDebounce = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 50;
      babelHelpers.classCallCheck(this, NavDown);
      this.seed = seed;
      this.match = match;
      this.notify = notify;
      this.max = max;
      this.ignore = ignore;
      this.mutDebounce = mutDebounce; //this.init();
    }

    babelHelpers.createClass(NavDown, [{
      key: "init",
      value: function init() {
        var _this4 = this;

        this._debouncer = debounce(function () {
          _this4.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
      }
    }, {
      key: "addMutObs",
      value: function addMutObs(elToObs) {
        var _this5 = this;

        if (elToObs === null) return;
        this._mutObs = new MutationObserver(function (m) {
          _this5._debouncer(true);
        });

        this._mutObs.observe(elToObs, {
          childList: true
        }); // (<any>elToObs)._addedMutObs = true;

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
        var ns = this._sis ? this.seed : this.seed.nextElementSibling;

        while (ns !== null) {
          if (this.ignore === null || !ns.matches(this.ignore)) {
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
          }

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
      var _this6;

      babelHelpers.classCallCheck(this, PDNavDown);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDNavDown).apply(this, arguments));
      _this6.children = [];
      return _this6;
    }

    babelHelpers.createClass(PDNavDown, [{
      key: "sibCheck",
      value: function sibCheck(sib, c) {
        //if ((<any>sib).__aMO) return;
        var attr = sib.getAttribute(p_d_if);

        if (attr === null) {
          sib.__aMO = true;
          return;
        }

        var fec = sib.firstElementChild;
        if (fec === null) return;

        if (this.root.matches(attr)) {
          var pdnd = new PDNavDown(fec, this.match, this.notify, this.max, null, this.mutDebounce);
          pdnd.root = this.root;
          this.children.push(pdnd);
          pdnd._sis = true;
          pdnd.init(); //(<any>sib).__aMO = true;
        }
      }
    }, {
      key: "getMatches",
      value: function getMatches() {
        var ret = this.matches;
        this.children.forEach(function (child) {
          ret = ret.concat(child.getMatches());
        });
        return ret;
      }
    }]);
    return PDNavDown;
  }(NavDown);

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
  var prop = 'prop';
  var val = 'val';

  var P =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(P, _XtallatX);

    function P() {
      var _this7;

      babelHelpers.classCallCheck(this, P);
      _this7 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(P).call(this));
      _this7._lastEvent = null;
      return _this7;
    }

    babelHelpers.createClass(P, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        var f = '_' + name;

        switch (name) {
          case iff:
          case on:
          case prop:
          case val:
          case to:
            this[f] = newVal;
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
      key: "getPreviousSib",
      value: function getPreviousSib() {
        var pS = this;

        while (pS && pS.tagName.startsWith('P-')) {
          pS = pS.previousElementSibling;
        }

        if (pS === null) pS = this.parentElement;
        return pS;
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'none';

        this._upgradeProperties([on, to, noblock, iff, prop, val]);

        this.init();
      }
    }, {
      key: "init",
      value: function init() {
        this.attchEvListnrs();
        this.doFake();
      }
    }, {
      key: "attchEvListnrs",
      value: function attchEvListnrs() {
        if (this._bndHndlEv) {
          return;
        } else {
          this._bndHndlEv = this._hndEv.bind(this);
        }

        var pS = this.getPreviousSib();
        if (!pS) return;
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
      key: "skI",
      value: function skI() {
        return this.hasAttribute('skip-init');
      }
    }, {
      key: "doFake",
      value: function doFake() {
        if (!this._if && !this.skI()) {
          var lastEvent = this._lastEvent;

          if (!lastEvent) {
            lastEvent = {
              target: this.getPreviousSib(),
              isFake: true
            };
          }

          if (this._hndEv) this._hndEv(lastEvent);
        }
      }
    }, {
      key: "_hndEv",
      value: function _hndEv(e) {
        if (this.hasAttribute('debug')) debugger;
        if (!e) return;
        if (e.stopPropagation && !this._noblock) e.stopPropagation();
        if (this._if && !e.target.matches(this._if)) return;
        this._lastEvent = e;
        this.pass(e);
      } //https://stackoverflow.com/questions/476436/is-there-a-null-coalescing-operator-in-javascript

    }, {
      key: "$N",
      value: function $N(value, ifnull) {
        if (value === null || value === undefined) return ifnull;
        return value;
      }
    }, {
      key: "setVal",
      value: function setVal(e, target) {
        var gpfp = this.getPropFromPath.bind(this);
        var propFromEvent = this.val ? gpfp(e, this.val) : this.$N(gpfp(e, 'detail.value'), gpfp(e, 'target.value'));
        this.commit(target, propFromEvent);
      }
    }, {
      key: "commit",
      value: function commit(target, val) {
        if (val === undefined) return;
        target[this.prop] = val;
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
      key: "detach",
      value: function detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        var pS = this.getPreviousSib();
        if (pS && this._bndHndlEv) this.detach(pS);
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
      key: "prop",
      get: function get() {
        return this._prop;
      },
      set: function set(val) {
        this.attr(prop, val);
      }
    }, {
      key: "val",
      get: function get() {
        return this._val;
      },
      set: function set(val) {
        this.attr(prop, val);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff, prop, val]);
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
      var _this8;

      babelHelpers.classCallCheck(this, PD);
      _this8 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
      _this8._pdNavDown = null; //_hasMax!: boolean;

      _this8._m = Infinity;
      _this8._iIP = false;
      return _this8;
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        this._lastEvent = e;
        this.attr('pds', '🌩️'); //this.passDown(this.nextElementSibling, e, 0);

        var count = this.applyProps(this._pdNavDown);
        this.attr('pds', '👂');
        this.attr('mtch', count.toString());
      }
    }, {
      key: "getMatches",
      value: function getMatches(pd) {
        return pd.matches;
      }
    }, {
      key: "applyProps",
      value: function applyProps(pd) {
        var _this9 = this;

        //if(this._iIP && this.skI()) return;
        if (this._iIP) return 0;
        var matches = this.getMatches(pd); //const matches = pd.getMatches();

        matches.forEach(function (el) {
          _this9.setVal(_this9._lastEvent, el);
        });
        return matches.length;
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
          case m:
            if (newVal !== null) {
              this._m = parseInt(newVal);
            } else {}

        }

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      }
    }, {
      key: "newNavDown",
      value: function newNavDown() {
        var bndApply = this.applyProps.bind(this);
        return new NavDown(this, this.to, bndApply, this.m);
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._upgradeProperties([m]);

        this.attr('pds', '📞');

        if (!this.to) {
          //apply to next only
          this.to = '*';
          this.m = 1;
        }

        var pdnd = this.newNavDown(); //const pdnd = new PDNavDown(this, this.to, nd => bndApply(nd), this.m);
        //pdnd.root = this;

        pdnd.ignore = 'p-d,p-d-x,p-d-r,script';
        this._iIP = true;
        pdnd.init();
        this._iIP = false;
        this._pdNavDown = pdnd;
        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);
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

  var PDR =
  /*#__PURE__*/
  function (_PD) {
    babelHelpers.inherits(PDR, _PD);

    function PDR() {
      babelHelpers.classCallCheck(this, PDR);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDR).apply(this, arguments));
    }

    babelHelpers.createClass(PDR, [{
      key: "getMatches",
      value: function getMatches(pd) {
        return pd.getMatches();
      }
    }, {
      key: "newNavDown",
      value: function newNavDown() {
        var bndApply = this.applyProps.bind(this);
        var pdnd = new PDNavDown(this, this.to, bndApply, this.m);
        pdnd.root = this;
        return pdnd;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-d-r';
      }
    }]);
    return PDR;
  }(PD);

  define(PDR); //import { ICssPropMap } from './p.js';
  //const attrib_filter = 'attrib-filter';

  var PDX =
  /*#__PURE__*/
  function (_PD2) {
    babelHelpers.inherits(PDX, _PD2);

    function PDX() {
      babelHelpers.classCallCheck(this, PDX);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDX).apply(this, arguments));
    }

    babelHelpers.createClass(PDX, [{
      key: "commit",
      value: function commit(target, val) {
        if (val === undefined) return;

        if (this.val === '.' && this.prop === '.') {
          Object.assign(target, val);
          return;
        }

        var targetPath = this.prop;

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
        var _this10 = this;

        if (this._on[0] !== '[') {
          babelHelpers.get(babelHelpers.getPrototypeOf(PDX.prototype), "attchEvListnrs", this).call(this);
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

          _this10._hndEv(fakeEvent);
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

  var PDestal =
  /*#__PURE__*/
  function (_PDX) {
    babelHelpers.inherits(PDestal, _PDX);

    function PDestal() {
      var _this11;

      babelHelpers.classCallCheck(this, PDestal);
      _this11 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PDestal).apply(this, arguments));
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

          this._hndEv(fakeEvent);
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

  var PS =
  /*#__PURE__*/
  function (_PDR) {
    babelHelpers.inherits(PS, _PDR);

    function PS() {
      babelHelpers.classCallCheck(this, PS);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PS).apply(this, arguments));
    }

    babelHelpers.createClass(PS, [{
      key: "getPreviousSib",
      value: function getPreviousSib() {
        var parent = this.parentElement;
        if (!parent) return null; //if(parent.firstChild !== this) return null;

        return parent;
      }
    }], [{
      key: "is",
      get: function get() {
        return 'p-s';
      }
    }]);
    return PS;
  }(PDR);

  define(PS);
})();