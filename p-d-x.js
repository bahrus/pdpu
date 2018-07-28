import { PD } from './p-d.js';
import { XtallatX } from 'xtal-latx/xtal-latx.js';
//const attrib_filter = 'attrib-filter';
export class PDX extends PD {
    static get is() { return 'p-d-x'; }
    parseMapping(mapTokens, cssSelector) {
        const splitPropPointer1 = mapTokens[1].split(';');
        splitPropPointer1.forEach(token => {
            const splitPropPointer = token.split(':');
            this._cssPropMap.push({
                cssSelector: cssSelector,
                propTarget: splitPropPointer[0],
                propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
            });
        });
    }
    commit(target, map, val) {
        if (map.propSource === '.' && map.propTarget === '.') {
            Object.assign(target, val);
            return;
        }
        const targetPath = map.propTarget;
        if (targetPath.startsWith('.')) {
            const cssClass = targetPath.substr(1);
            const method = val ? 'add' : 'remove';
            target.classList[method](cssClass);
        }
        else if (targetPath.indexOf('.') > -1) {
            const pathTokens = targetPath.split('.');
            // const lastToken = pathTokens.pop();
            this.createNestedProp(target, pathTokens, val);
        }
        else {
            target[targetPath] = val;
        }
    }
    createNestedProp(target, pathTokens, val) {
        const firstToken = pathTokens.shift();
        const tft = target[firstToken];
        const returnObj = { [firstToken]: tft ? tft : {} };
        let targetContext = returnObj[firstToken];
        const lastToken = pathTokens.pop();
        pathTokens.forEach(token => {
            let newContext = targetContext[token];
            if (!newContext) {
                newContext = targetContext[token] = {};
            }
            targetContext = newContext;
        });
        targetContext[lastToken] = val;
        Object.assign(target, returnObj);
    }
    attachEventListeners() {
        if (this._on[0] !== '[') {
            super.attachEventListeners();
            return;
        }
        const prevSibling = this.getPreviousSib();
        if (!prevSibling)
            return;
        const split = this._on.split(',').map(s => s.substr(1, s.length - 2));
        const config = {
            attributes: true,
            attributeFilter: split
        };
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const values = {};
            split.forEach(attrib => {
                values[attrib] = prevSibling.getAttribute(attrib);
            });
            const fakeEvent = {
                mutationRecords: mutationRecords,
                values: values,
                target: prevSibling
            };
            this._handleEvent(fakeEvent);
        });
        this._attributeObserver.observe(prevSibling, config);
    }
    disconnect() {
        if (this._attributeObserver)
            this._attributeObserver.disconnect();
    }
    disconnectedCallback() {
        this.disconnect();
        super.disconnectedCallback();
    }
    static define(name, fn) {
        class newClass extends XtallatX(HTMLElement) {
            constructor() {
                super(...arguments);
                this._connected = false;
            }
            connectedCallback() {
                this._upgradeProperties(['input', 'disabled']);
                this._connected = true;
            }
            get input() {
                return this._input;
            }
            set input(val) {
                this._input = val;
                this.value = fn(val);
                this.onPropsChange();
            }
            attributeChangedCallback(name, oldVal, newVal) {
                super.attributeChangedCallback(name, oldVal, newVal);
                switch (name) {
                    case 'input':
                        this.input = JSON.parse(newVal);
                        break;
                    default:
                        this.onPropsChange();
                }
            }
            onPropsChange() {
                if (!this._disabled)
                    return;
                this.de('value', {
                    value: this.value
                });
            }
        }
        customElements.define(name, newClass);
    }
}
if (!customElements.get(PDX.is))
    customElements.define(PDX.is, PDX);
//# sourceMappingURL=p-d-x.js.map