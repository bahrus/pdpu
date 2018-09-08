import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
var on = 'on';
var noblock = 'noblock';
var iff = 'if';
var to = 'to';
export var P =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(P, _XtallatX);

  function P() {
    var _this;

    babelHelpers.classCallCheck(this, P);
    _this = babelHelpers.possibleConstructorReturn(this, (P.__proto__ || Object.getPrototypeOf(P)).call(this));
    _this._addedSMO = false;
    _this._connected = false;
    return _this;
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
      var _this2 = this;

      this.style.display = 'none';

      this._upgradeProperties([on, to, noblock, 'input', iff]);

      setTimeout(function () {
        return _this2.doFake();
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

      if (this._boundHandleEvent) {
        return;
      } else {
        this._boundHandleEvent = this._handleEvent.bind(this);
      }

      prevSibling.addEventListener(this._on, this._boundHandleEvent);
      prevSibling.removeAttribute('disabled');
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
      var _this3 = this;

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
          _this3._m = 1;
          _this3._hasMax = true;
        }

        _this3.parseMapping(mapTokens, cssSelector);
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
      return babelHelpers.get(P.__proto__ || Object.getPrototypeOf(P), "observedAttributes", this).concat([on, to, noblock, iff]);
    }
  }]);
  return P;
}(XtallatX(HTMLElement)); //# sourceMappingURL=p.js.map