import { XtallatX } from 'xtal-latx/xtal-latx.js';
export class PDQ {
    static define(name, fn, adjustClass) {
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
                if (this._disabled)
                    return;
                const val = this.value;
                this.de('value', {
                    value: val
                });
                let valueSummary = null;
                switch (typeof (val)) {
                    case 'string':
                    case 'boolean':
                    case 'number':
                        valueSummary = 'array:' + val.toString();
                        break;
                    case 'object':
                        if (!val)
                            return;
                        if (Array.isArray(val)) {
                            valueSummary = val.length;
                        }
                        else {
                            valueSummary = Object.keys(val).toString();
                        }
                }
                if (valueSummary !== null)
                    this.setAttribute('value-ish', valueSummary);
            }
        }
        if (adjustClass) {
            if (!adjustClass(newClass))
                return;
        }
        customElements.define(name, newClass);
    }
}
//# sourceMappingURL=PDQ.js.map