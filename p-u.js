import { XtallatX } from 'xtal-latx/xtal-latx.js';
const on = 'on';
export class PU extends XtallatX(HTMLElement) {
    static get is() { return 'p-u'; }
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
}
if (!customElements.get(PU.is)) {
    customElements.define(PU.is, PU);
}
//# sourceMappingURL=p-u.js.map