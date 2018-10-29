import { PD } from './p-d.js';
import { define } from "./node_modules/xtal-latx/define.js"; //const attrib_filter = 'attrib-filter';

export var PDX =
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
      var _this = this;

      var splitPropPointer1 = mapTokens[1].split(';');
      splitPropPointer1.forEach(function (token) {
        var splitPropPointer = token.split(':');

        _this._cssPropMap.push({
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
        tc[lastToken] = val;
      } //this controversial line is to force the target to see new properties, even though we are updating nested properties.
      //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 


      try {
        Object.assign(target, returnObj);
      } catch (e) {}

      ;
    }
  }, {
    key: "attchEvListnrs",
    value: function attchEvListnrs() {
      var _this2 = this;

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

        _this2._hndEv(fakeEvent);
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
define(PDX); //# sourceMappingURL=p-d-x.js.map