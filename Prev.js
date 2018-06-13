import { XtallatX } from 'xtal-latx/xtal-latx.js';
const on = 'on';
const noblock = 'noblock';
export class Prev extends XtallatX(HTMLElement) {
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
    get noblock() {
        return this._noblock;
    }
    set noblock(val) {
        if (val) {
            this.setAttribute(noblock, '');
        }
        else {
            this.removeAttribute(noblock);
        }
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([on]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case on:
                this._on = newVal;
                //this.attachEventListeners();
                break;
            case noblock:
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    getPreviousSib() {
        let prevSibling = this;
        while (prevSibling && prevSibling.tagName === 'P-D') {
            prevSibling = prevSibling.previousElementSibling;
        }
        return prevSibling;
    }
    connectedCallback() {
        this._upgradeProperties([on]);
    }
    disconnectedCallback() {
        const prevSibling = this.getPreviousSib();
        if (prevSibling && this._boundHandleEvent)
            this.detach(prevSibling);
        this.disconnectSiblingObserver();
    }
    attachEventListeners() {
        const attrFilters = [];
        const prevSibling = this.getPreviousSib();
        if (this._on === 'eval' && prevSibling.tagName === 'SCRIPT') {
            const evalObj = eval(prevSibling.innerText);
            this._handleEvent(evalObj);
        }
        else {
            if (this._boundHandleEvent) {
                return;
            }
            else {
                this._boundHandleEvent = this._handleEvent.bind(this);
            }
            const fakeEvent = {
                target: prevSibling
            };
            this._handleEvent(fakeEvent);
            prevSibling.addEventListener(this._on, this._boundHandleEvent);
            prevSibling.removeAttribute('disabled');
        }
    }
}
//# sourceMappingURL=Prev.js.map