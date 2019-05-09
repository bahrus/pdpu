import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { define } from 'trans-render/define.js';
import { destruct } from 'xtal-element/destruct.js';
export class PDQ {
    static define(name, fn, adjustClass = null) {
        class newClass extends XtallatX(hydrate(HTMLElement)) {
            constructor() {
                super();
                this._connected = false;
                this.style.display = 'none';
            }
            static get is() { return name; }
            connectedCallback() {
                this.propUp(['input', 'disabled']);
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
                        valueSummary = val.toString().substr(0, 10);
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
        const p = newClass.prototype;
        const fnString = fn.toString().trim();
        if (fnString.startsWith('({')) {
            const iPos = fnString.indexOf('})', 2);
            const args = fnString.substring(2, iPos).split(',').map(s => s.trim());
            //const p = newClass.prototype;
            args.forEach(arg => {
                destruct(p, arg, 'input');
            });
        }
        if (adjustClass !== null) {
            if (!adjustClass(newClass))
                return;
        }
        define(newClass);
    }
    static $(str) {
        return str.replace(/(<([^>]+)>)/ig, '');
    }
}
customElements['PDQ'] = PDQ; // for ES6 Module challenged browsers.
