
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so ef it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in sure ensure it doesn't call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch (with -changed if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
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
const on = 'on';
const noblock = 'noblock';
const iff = 'if';
const to = 'to';
class P extends XtallatX(HTMLElement) {
    constructor() {
        super();
        this._addedSMO = false;
        this._connected = false;
    }
    get on() {
        return this._on;
    }
    set on(val) {
        this.attr(on, val);
    }
    get to() {
        return this._to;
    }
    set to(val) {
        this.attr(to, val);
    }
    get noblock() {
        return this._noblock;
    }
    set noblock(val) {
        this.attr(noblock, val, '');
    }
    get if() { return this._if; }
    set if(val) {
        this.attr(iff, val);
    }
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([on, to, noblock, iff]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        const f = '_' + name;
        switch (name) {
            case iff:
            case on:
                this[f] = newVal;
                break;
            case to:
                this._destIsNA = newVal === '{NA}';
                if (newVal.endsWith('}'))
                    newVal += ';';
                this._to = newVal;
                this.parseTo();
                if (this._lastEvent)
                    this._hndEv(this._lastEvent);
                break;
            case noblock:
                this[f] = newVal !== null;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    /**
     * get previous sibling
     */
    getPSib() {
        let pS = this;
        while (pS && pS.tagName.startsWith('P-')) {
            pS = pS.previousElementSibling;
        }
        return pS;
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties([on, to, noblock, 'input', iff]);
        setTimeout(() => this.doFake(), 50);
    }
    doFake() {
        if (!this._if && !this.hasAttribute('skip-init')) {
            let lastEvent = this._lastEvent;
            if (!lastEvent) {
                lastEvent = {
                    target: this.getPSib(),
                    isFake: true
                };
            }
            if (this._hndEv)
                this._hndEv(lastEvent);
        }
        if (!this._addedSMO && this.addMutationObserver) {
            this.addMutationObserver(this, false);
            this._addedSMO = true;
        }
    }
    detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
    }
    disconnectedCallback() {
        const pS = this.getPSib();
        if (pS && this._bndHndlEv)
            this.detach(pS);
        this.disconnect();
    }
    _hndEv(e) {
        if (this.hasAttribute('debug'))
            debugger;
        if (!e)
            return;
        if (e.stopPropagation && !this._noblock)
            e.stopPropagation();
        if (this._if && !e.target.matches(this._if))
            return;
        this._lastEvent = e;
        if (!this._cssPropMap) {
            return;
        }
        this.pass(e);
    }
    attchEvListnrs() {
        const attrFilters = [];
        const pS = this.getPSib();
        if (!pS)
            return;
        if (this._bndHndlEv) {
            return;
        }
        else {
            this._bndHndlEv = this._hndEv.bind(this);
        }
        pS.addEventListener(this._on, this._bndHndlEv);
        pS.removeAttribute('disabled');
    }
    onPropsChange() {
        if (!this._connected || !this._on || !this._to)
            return;
        this.attchEvListnrs();
    }
    parseMapping(mapTokens, cssSelector) {
        const splitPropPointer = mapTokens[1].split(':');
        this._cssPropMap.push({
            cssSelector: cssSelector,
            propTarget: splitPropPointer[0],
            propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : undefined
        });
    }
    parseTo() {
        if (this._cssPropMap && this._to === this._lastTo)
            return;
        this._lastTo = this._to;
        this._cssPropMap = [];
        const splitPassDown = this._to.split('};');
        const onlyOne = splitPassDown.length <= 2;
        splitPassDown.forEach(pdItem => {
            if (!pdItem)
                return;
            const mT = pdItem.split('{');
            let cssSel = mT[0];
            if (!cssSel && onlyOne) {
                cssSel = '*';
                this._m = 1;
                this._hasMax = true;
            }
            this.parseMapping(mT, cssSel);
        });
    }
    setVal(e, target, map) {
        const gpfp = this.getPropFromPath.bind(this);
        const propFromEvent = map.propSource ? gpfp(e, map.propSource) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, map, propFromEvent);
    }
    commit(target, map, val) {
        target[map.propTarget] = val;
    }
    getPropFromPath(val, path) {
        if (!path || path === '.')
            return val;
        return this.getProp(val, path.split('.'));
    }
    getProp(val, pathTokens) {
        let context = val;
        let firstToken = true;
        const cp = 'composedPath';
        const cp_ = cp + '_';
        pathTokens.forEach(token => {
            if (context) {
                if (firstToken && context[cp]) {
                    firstToken = false;
                    const cpath = token.split(cp_);
                    if (cpath.length === 1) {
                        context = context[cpath[0]];
                    }
                    else {
                        context = context[cp]()[parseInt(cpath[1])];
                    }
                }
                else {
                    context = context[token];
                }
            }
        });
        return context;
    }
    disconnect() {
        if (this._sibObs)
            this._sibObs.disconnect();
    }
}
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
class PD extends P {
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
        this.attr('pds', '🌩️');
        this.passDown(this.nextElementSibling, e, 0);
        this.attr('pds', '👂');
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
        this.attr('pds', '📞');
        this.onPropsChange();
    }
    addMutObs(baseElement, isParent) {
        let elToObs = isParent ? baseElement : baseElement.parentElement;
        if (!elToObs)
            return; //TODO
        this._sibObs = new MutationObserver((m) => {
            if (!this._lastEvent)
                return;
            //this.passDownProp(this._lastResult);
            this._hndEv(this._lastEvent);
        });
        this._sibObs.observe(elToObs, { childList: true });
    }
}
define(PD);
    })();  
        