import { P } from './p.js';
const m = 'm';
const p_d_if = 'p-d-if';
const PDIf = 'PDIf';
const _addedSMO = '_addedSMO'; //addedSiblingMutationObserver
/**
 * `p-d`
 *  Pass data from one element down the DOM tree to other elements
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class PD extends P {
    static get is() { return 'p-d'; }
    get m() {
        return this._m;
    }
    set m(val) {
        this.setAttribute(val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([m]);
    }
    detach(prevSibling) {
        prevSibling.removeEventListener(this._on, this._boundHandleEvent);
    }
    pass(e) {
        this.passDown(this.nextElementSibling, e, 0);
    }
    passDown(start, e, count) {
        let nextSibling = start;
        while (nextSibling) {
            this._cssPropMap.forEach(map => {
                if (!map.cssSelector)
                    debugger;
                if (map.cssSelector === '*' || (nextSibling.matches && nextSibling.matches(map.cssSelector))) {
                    count++;
                    this.setVal(e, nextSibling, map);
                }
                const fec = nextSibling.firstElementChild;
                if (this.id && fec && nextSibling.hasAttribute(p_d_if)) {
                    //if(!nextSibling[PDIf]) nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
                    if (this.matches(nextSibling.getAttribute(p_d_if))) {
                        this.passDown(fec, e, count);
                        let addedSMOTracker = nextSibling[_addedSMO];
                        if (!addedSMOTracker)
                            addedSMOTracker = nextSibling[_addedSMO] = {};
                        if (!addedSMOTracker[this.id]) {
                            this.addMutationObserver(nextSibling, true);
                            nextSibling[_addedSMO][this.id] = true;
                        }
                    }
                }
            });
            if (this._hasMax && count >= this._m)
                break;
            nextSibling = nextSibling.nextElementSibling;
        }
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case m:
                if (newVal !== null) {
                    this._m = parseInt(newVal);
                    this._hasMax = true;
                }
                else {
                    this._hasMax = false;
                }
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties([m]);
        this._connected = true;
        this.onPropsChange();
    }
    addMutationObserver(baseElement, isParent) {
        let elementToObserve = isParent ? baseElement : baseElement.parentElement;
        if (!elementToObserve)
            return; //TODO
        this._siblingObserver = new MutationObserver((mutationsList) => {
            if (!this._lastEvent)
                return;
            //this.passDownProp(this._lastResult);
            this._handleEvent(this._lastEvent);
        });
        this._siblingObserver.observe(elementToObserve, { childList: true });
    }
}
if (!customElements.get(PD.is)) {
    customElements.define(PD.is, PD);
}
//# sourceMappingURL=p-d.js.map