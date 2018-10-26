import { P } from './p.js';
import { define } from "./node_modules/xtal-latx/define.js";
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

export var PD =
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
      this.attr('pds', '🔫');
      this.passDown(this.nextElementSibling, e, 0);
      this.attr('pds', '🥍');
    }
  }, {
    key: "passDown",
    value: function passDown(start, e, count) {
      var _this = this;

      var nextSib = start;

      while (nextSib) {
        if (nextSib.tagName !== 'SCRIPT') {
          this._cssPropMap.forEach(function (map) {
            if (map.cssSelector === '*' || nextSib.matches && nextSib.matches(map.cssSelector)) {
              count++;

              _this.setVal(e, nextSib, map);
            }

            var fec = nextSib.firstElementChild;

            if (_this.id && fec && nextSib.hasAttribute(p_d_if)) {
              //if(!nextSibling[PDIf]) nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
              if (_this.matches(nextSib.getAttribute(p_d_if))) {
                _this.passDown(fec, e, count);

                var addedSMOTracker = nextSib[_addedSMO];
                if (!addedSMOTracker) addedSMOTracker = nextSib[_addedSMO] = {};

                if (!addedSMOTracker[_this.id]) {
                  if (nextSib !== null) _this.addMutObs(nextSib, true);
                  nextSib[_addedSMO][_this.id] = true;
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
      this.onPropsChange();
    }
  }, {
    key: "addMutObs",
    value: function addMutObs(baseElement, isParent) {
      var _this2 = this;

      var elToObs = isParent ? baseElement : baseElement.parentElement;
      if (!elToObs) return; //TODO

      this._sibObs = new MutationObserver(function (m) {
        if (!_this2._lastEvent) return; //this.passDownProp(this._lastResult);

        _this2._hndEv(_this2._lastEvent);
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
define(PD); //# sourceMappingURL=p-d.js.map