import { P } from './p.js';
import { define } from 'xtal-latx/define.js';
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
        this.attr(m, val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([m]);
    }
    pass(e) {
        this.passDown(this.nextElementSibling, e, 0);
    }
    passDown(start, e, count) {
        let nextSib = start;
        while (nextSib) {
            if (nextSib.tagName !== 'SCRIPT') {
                this._cssPropMap.forEach(map => {
                    if (map.cssSelector === '*' || (nextSib.matches && nextSib.matches(map.cssSelector))) {
                        count++;
                        this.setVal(e, nextSib, map);
                    }
                    const fec = nextSib.firstElementChild;
                    if (this.id && fec && nextSib.hasAttribute(p_d_if)) {
                        //if(!nextSibling[PDIf]) nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
                        if (this.matches(nextSib.getAttribute(p_d_if))) {
                            this.passDown(fec, e, count);
                            let addedSMOTracker = nextSib[_addedSMO];
                            if (!addedSMOTracker)
                                addedSMOTracker = nextSib[_addedSMO] = {};
                            if (!addedSMOTracker[this.id]) {
                                if (nextSib !== null)
                                    this.addMutObs(nextSib, true);
                                nextSib[_addedSMO][this.id] = true;
                            }
                        }
                    }
                });
            }
            if (this._hasMax && count >= this._m)
                break;
            nextSib = nextSib.nextElementSibling;
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
    addMutObs(baseElement, isParent) {
        let elementToObserve = isParent ? baseElement : baseElement.parentElement;
        if (!elementToObserve)
            return; //TODO
        this._sibObs = new MutationObserver((mutationsList) => {
            if (!this._lastEvent)
                return;
            //this.passDownProp(this._lastResult);
            this._hndEv(this._lastEvent);
        });
        this._sibObs.observe(elementToObserve, { childList: true });
    }
}
define(PD);
//# sourceMappingURL=p-d.js.map