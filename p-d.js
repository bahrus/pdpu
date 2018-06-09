const on = 'on';
const to = 'to';
const m = 'm';
// export class PD extends XtallatX(HTMLElement){
export class PD extends HTMLElement {
    static get is() { return 'p-d'; }
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
    get to() {
        return this._passDown;
    }
    set to(val) {
        this.passDown = val;
    }
    get m() {
        return this._maxMatches;
    }
    set m(val) {
        this.maxMatches = val;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([on, to, m]);
    }
    attachEventListeners() {
        const attrFilters = [];
        const prevSibling = this.previous;
        this._on.split('|').forEach(token => {
        });
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case on:
                this._on = newVal;
                this.attachEventListeners();
                break;
        }
    }
}
if (!customElements.get(PD.is)) {
    customElements.define(PD.is, PD);
}
//# sourceMappingURL=p-d.js.map