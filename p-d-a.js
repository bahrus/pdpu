import { PD } from './p-d.js';
const attrib_filter = 'attrib-filter';
export class PDA extends PD {
    static get is() { return 'p-d-a'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([attrib_filter]);
    }
    get attribFilter() { return this._attribFilter; }
    set attribFilter(newVal) {
        this.setAttribute(attrib_filter, newVal);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case attrib_filter:
                this._attribFilter = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
}
//# sourceMappingURL=p-d-a.js.map