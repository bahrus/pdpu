
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr(name, ec[name].toString());
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
//# sourceMappingURL=xtal-latx.js.map
class PDQ {
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
customElements['PDQ'] = PDQ;
//# sourceMappingURL=PDQ.js.map
    })();  
        