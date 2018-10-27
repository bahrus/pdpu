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
           * @param name Name of event to dispatch (with -changed if asIs is false)
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
           * Any component that emits events should not do so ef it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in sure ensure it doesn't call "de" if this property is set to true.
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
              target: this.getPSib(),
              isFake: true
            };
          }

          if (this._hndEv) this._hndEv(lastEvent);
        }

        if (!this._addedSMO && this.addMutationObserver) {
          this.addMutationObserver(this, false);
          this._addedSMO = true;
        }
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
        pS.removeAttribute('disabled');
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
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff]);
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
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
    }

    babelHelpers.createClass(PD, [{
      key: "pass",
      value: function pass(e) {
        this.attr('pds', '🌩️');
        this.passDown(this.nextElementSibling, e, 0);
        this.attr('pds', '👂');
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
          }

          if (this._hasMax && count >= this._m) break;
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

        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
        this.onPropsChange();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        babelHelpers.get(babelHelpers.getPrototypeOf(PD.prototype), "connectedCallback", this).call(this);

        this._upgradeProperties([m]);

        this._connected = true;
        this.attr('pds', '📞');
        this.onPropsChange();
      }
    }, {
      key: "addMutObs",
      value: function addMutObs(baseElement, isParent) {
        var _this7 = this;

        var elToObs = isParent ? baseElement : baseElement.parentElement;
        if (!elToObs) return; //TODO

        this._sibObs = new MutationObserver(function (m) {
          if (!_this7._lastEvent) return; //this.passDownProp(this._lastResult);

          _this7._hndEv(_this7._lastEvent);
        });

        this._sibObs.observe(elToObs, {
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
        return babelHelpers.get(babelHelpers.getPrototypeOf(PD), "observedAttributes", this).concat([m]);
      }
    }]);
    return PD;
  }(P);

  define(PD);
})();