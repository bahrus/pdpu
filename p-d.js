import { XtallatX } from 'xtal-latx/xtal-latx.js';
const on = 'on';
const to = 'to';
const m = 'm';
export class PD extends XtallatX(HTMLElement) {
    static get is() { return 'p-d'; }
    get on() {
        return this._on;
    }
    set on(val) {
        this.setAttribute(on, val);
    }
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
        return super.observedAttributes.concat([on, to, m]);
    }
    detatchEventListeners() {
        if (this._siblingObserver)
            this._siblingObserver.disconnect();
        const prevSibling = this.previousElementSibling;
        this._on.split('|').forEach(token => {
            if (!token.startsWith('@')) {
                prevSibling.removeEventListener(token, this._handleEvent);
            }
        });
    }
    getPreviousSib() {
        let prevSibling = this;
        while (prevSibling && prevSibling.tagName === 'P-D') {
            prevSibling = prevSibling.previousElementSibling;
        }
        return prevSibling;
    }
    attachEventListeners() {
        const attrFilters = [];
        const prevSibling = this.getPreviousSib();
        this._boundHandleEvent = this._handleEvent.bind(this);
        prevSibling.addEventListener(this._on, this._boundHandleEvent);
        prevSibling.removeAttribute('disabled');
    }
    _handleEvent(e) {
        e.stopPropagation();
        if (!this._cssPropMap) {
            this._lastEvent = e;
            return;
        }
        else {
            delete this._lastEvent;
        }
        //const prevSibling = this.getPreviousSib();
        let nextSibling = this.nextElementSibling;
        let count = 0;
        while (nextSibling) {
            this._cssPropMap.forEach(map => {
                if (map.cssSelector === '*' || nextSibling.matches(map.cssSelector)) {
                    count++;
                    nextSibling[map.propTarget] = this.getPropFromPath(e, map.propSource);
                }
            });
            if (this._hasMax && count >= this._m)
                break;
            nextSibling = nextSibling.nextElementSibling;
        }
    }
    passDownProp(val) {
        let nextSibling = this.nextElementSibling;
        let count = 0;
        while (nextSibling) {
            this._cssPropMap.forEach(map => {
                if (map.cssSelector === '*' || nextSibling.matches(map.cssSelector)) {
                    count++;
                    nextSibling[map.propTarget] = this.getPropFromPath(val, map.propSource);
                }
            });
            if (this._hasMax && count >= this._maxMatches)
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
            case on:
                this._on = newVal;
                //this.attachEventListeners();
                break;
            case to:
                if (newVal.endsWith('}'))
                    newVal += ';';
                this._to = newVal;
                this.parseTo();
                if (this._lastEvent)
                    this._handleEvent(this._lastEvent);
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    connectedCallback() {
        this._connected = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._connected || !this._on || !this._to)
            return;
        this.parseTo();
        this.attachEventListeners();
    }
    addMutationObserver() {
        const config = { childList: true };
        this._siblingObserver = new MutationObserver((mutationsList) => {
            this.passDownProp(this._lastResult);
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
            // if(splitPropPointer.length > 0){
            //     const rhs = splitPropPointer[1]
            //     splitPropPointer[1] = rhs.substr(0, rhs.length - 1);
            // }
            let cssSelector = mapTokens[0];
            if (!cssSelector) {
                cssSelector = "*";
                this.maxMatches = 1;
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