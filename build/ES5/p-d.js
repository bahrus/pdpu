import { P } from './p.js';
import { define } from "./node_modules/xtal-latx/define.js";
import { NavDown } from "./node_modules/xtal-latx/NavDown.js";
var m = 'm';
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
    var _this;

    babelHelpers.classCallCheck(this, PD);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(PD).apply(this, arguments));
    _this._pdNavDown = null; //_hasMax!: boolean;

    _this._m = Infinity;
    _this._iIP = false;
    return _this;
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
      var _this2 = this;

      //if(this._iIP && this.skI()) return;
      if (this._iIP) return 0;
      var matches = this.getMatches(pd); //const matches = pd.getMatches();

      matches.forEach(function (el) {
        if (pd._inMutLoop) {
          if (el.dataset.__pdWIP !== '1') return;
        }

        _this2.setVal(_this2._lastEvent, el);
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
          }

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