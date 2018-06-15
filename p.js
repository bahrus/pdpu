import { XtallatX } from 'xtal-latx/xtal-latx.js';
const on = 'on';
const noblock = 'noblock';
const to = 'to';
export class P extends XtallatX(HTMLElement) {
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
        return super.observedAttributes.concat([on, to, noblock]);
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
            case noblock:
                this._noblock = newVal !== null;
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
        this._upgradeProperties([on, to, noblock]);
    }
    disconnectedCallback() {
        const prevSibling = this.getPreviousSib();
        if (prevSibling && this._boundHandleEvent)
            this.detach(prevSibling);
        this.disconnectSiblingObserver();
    }
    _handleEvent(e) {
        if (e.stopPropagation && !this._noblock)
            e.stopPropagation();
        this._lastEvent = e;
        if (!this._cssPropMap) {
            return;
        }
        this.pass(e);
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
        if (!this._addedSMO) {
            this.addMutationObserver(this);
            this._addedSMO = true;
        }
    }
    setVal(e, target, map) {
        if (!map.propSource) {
            let defaultProp = this.getPropFromPath(e, 'detail.value');
            if (!defaultProp)
                defaultProp = this.getPropFromPath(e, 'target.value');
            target[map.propTarget] = defaultProp;
        }
        else {
            target[map.propTarget] = this.getPropFromPath(e, map.propSource);
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
}
//# sourceMappingURL=p.js.map