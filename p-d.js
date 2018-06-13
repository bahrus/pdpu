//import {XtallatX} from 'xtal-latx/xtal-latx.js';
import { Prev } from './Prev.js';
const to = 'to';
const m = 'm';
const p_d_if = 'p-d-if';
const PDIf = 'PDIf';
export class PD extends Prev {
    static get is() { return 'p-d'; }
    get to() {
        return this._to;
    }
    set to(val) {
        this.setAttribute(to, val);
    }
    get m() {
        return this._m;
    }
    set m(val) {
        this.setAttribute(val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([to, m]);
    }
    getPreviousSib() {
        let prevSibling = this;
        while (prevSibling && prevSibling.tagName === 'P-D') {
            prevSibling = prevSibling.previousElementSibling;
        }
        return prevSibling;
    }
    detach(prevSibling) {
        prevSibling.removeEventListener(this._on, this._boundHandleEvent);
    }
    _handleEvent(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        this._lastEvent = e;
        if (!this._cssPropMap) {
            return;
        }
        //const prevSibling = this.getPreviousSib();
        this.passDown(this.nextElementSibling, e);
    }
    passDown(start, e) {
        let nextSibling = start;
        let count = 0;
        while (nextSibling) {
            this._cssPropMap.forEach(map => {
                if (map.cssSelector === '*' || nextSibling.matches(map.cssSelector)) {
                    count++;
                    if (!map.propSource) {
                        let defaultProp = this.getPropFromPath(e, 'detail.value');
                        if (!defaultProp)
                            defaultProp = this.getPropFromPath(e, 'target.value');
                        nextSibling[map.propTarget] = defaultProp;
                    }
                    nextSibling[map.propTarget] = this.getPropFromPath(e, map.propSource);
                }
                if (this.id && nextSibling.hasAttribute(p_d_if)) {
                    if (!nextSibling[PDIf])
                        nextSibling[PDIf] = JSON.parse(nextSibling.getAttribute(p_d_if));
                    if (nextSibling[PDIf].contains(this.id)) {
                        this.passDown(nextSibling, e);
                    }
                }
            });
            if (this._hasMax && count >= this._m)
                break;
            nextSibling = nextSibling.nextElementSibling;
        }
    }
    getPropFromPath(val, path) {
        if (!path)
            return val;
        let context = val;
        path.split('.').forEach(token => {
            if (context)
                context = context[token];
        });
        return context;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case to:
                if (newVal.endsWith('}'))
                    newVal += ';';
                this._to = newVal;
                this.parseTo();
                if (this._lastEvent)
                    this._handleEvent(this._lastEvent);
                break;
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
        this._upgradeProperties([to, m]);
        this._connected = true;
        this.onPropsChange();
    }
    disconnectedCallback() {
        const prevSibling = this.getPreviousSib();
        if (prevSibling && this._boundHandleEvent)
            this.detach(prevSibling);
        this.disconnectSiblingObserver();
    }
    onPropsChange() {
        if (!this._connected || !this._on || !this._to)
            return;
        //this.parseTo();
        this.attachEventListeners();
    }
    addMutationObserver() {
        if (!this.parentElemen)
            return; //TODO
        const config = { childList: true };
        this._siblingObserver = new MutationObserver((mutationsList) => {
            if (!this._lastEvent)
                return;
            //this.passDownProp(this._lastResult);
            this._handleEvent(this._lastEvent);
        });
        this._siblingObserver.observe(this.parentElement, config);
    }
    disconnectSiblingObserver() {
        if (this._siblingObserver)
            this._siblingObserver.disconnect();
    }
    parseTo() {
        if (this._cssPropMap && this._to === this._lastTo)
            return;
        this._lastTo = this._to;
        this._cssPropMap = [];
        const splitPassDown = this._to.split('};');
        splitPassDown.forEach(passDownSelectorAndProp => {
            if (!passDownSelectorAndProp)
                return;
            const mapTokens = passDownSelectorAndProp.split('{');
            const splitPropPointer = mapTokens[1].split(':');
            let cssSelector = mapTokens[0];
            if (!cssSelector) {
                cssSelector = "*";
                this._m = 1;
                this._hasMax = true;
            }
            this._cssPropMap.push({
                cssSelector: cssSelector,
                propTarget: splitPropPointer[0],
                propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
            });
        });
        if (!this._addedSiblingMutationObserver) {
            this.addMutationObserver();
        }
    }
}
if (!customElements.get(PD.is)) {
    customElements.define(PD.is, PD);
}
//# sourceMappingURL=p-d.js.map