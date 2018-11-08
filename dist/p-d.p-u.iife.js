
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
const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};
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
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
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
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
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
class NavDown {
    constructor(seed, match, notify, max, mutDebounce = 50) {
        this.seed = seed;
        this.match = match;
        this.notify = notify;
        this.max = max;
        this.mutDebounce = mutDebounce;
        //this.init();
    }
    init() {
        this._debouncer = debounce(() => {
            this.sync();
        }, this.mutDebounce);
        this.sync();
        this.addMutObs(this.seed.parentElement);
    }
    addMutObs(elToObs) {
        if (elToObs === null)
            return;
        this._mutObs = new MutationObserver((m) => {
            this._debouncer(true);
        });
        this._mutObs.observe(elToObs, { childList: true });
        // (<any>elToObs)._addedMutObs = true;
    }
    sibCheck(sib, c) { }
    sync(c = 0) {
        const isF = typeof this.match === 'function';
        this.matches = [];
        let ns = this.seed.nextElementSibling;
        while (ns !== null) {
            let isG = isF ? this.match(ns) : ns.matches(this.match);
            if (isG) {
                this.matches.push(ns);
                c++;
                if (c >= this.max) {
                    this.notify(this);
                    return;
                }
                ;
            }
            this.sibCheck(ns, c);
            ns = ns.nextElementSibling;
        }
        this.notify(this);
    }
    disconnect() {
        this._mutObs.disconnect();
    }
}
const p_d_if = 'p-d-if';
class PDNavDown extends NavDown {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    sibCheck(sib, c) {
        if (sib.__aMO)
            return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            sib.__aMO = true;
            return;
        }
        const fec = sib.firstElementChild;
        if (fec === null)
            return;
        if (this.root.matches(attr)) {
            const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
            pdnd.root = this.root;
            this.children.push(pdnd);
            pdnd.init();
            sib.__aMO = true;
        }
    }
    getMatches() {
        let ret = this.matches;
        this.children.forEach(child => {
            ret = ret.concat(child.getMatches());
        });
        return ret;
    }
}
const on = 'on';
const noblock = 'noblock';
const iff = 'if';
const to = 'to';
class P extends XtallatX(HTMLElement) {
    constructor() {
        super();
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
    // _input: any;
    // get input(){
    //     return this._input;
    // }
    // set input(val){
    //     this._input = val;
    // }
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
        this._upgradeProperties([on, to, noblock, iff]);
        setTimeout(() => this.doFake(), 50);
    }
    //_addedSMO = false;
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
        // if(!(<any>this)._addedSMO && (<any>this).addMutationObserver){
        //     (<any>this).addMutationObserver(<any>this as HTMLElement, false);
        //     this._addedSMO = true;
        // }
    }
    detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
    }
    disconnectedCallback() {
        const pS = this.getPSib();
        if (pS && this._bndHndlEv)
            this.detach(pS);
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
        const da = pS.getAttribute('disabled');
        if (da !== null) {
            if (da.length === 0 || da === "1") {
                pS.removeAttribute('disabled');
            }
            else {
                pS.setAttribute('disabled', (parseInt(da) - 1).toString());
            }
        }
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
        if (val === undefined)
            return;
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
}
const m = 'm';
/**
 * `p-d`
 *  Pass data from one element down the DOM tree to other elements
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PD extends P {
    constructor() {
        super(...arguments);
        this._pdNavDown = [];
        //_hasMax!: boolean;
        this._m = Infinity;
    }
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
        this._lastEvent = e;
        this.attr('pds', '🌩️');
        //this.passDown(this.nextElementSibling, e, 0);
        let count = 0;
        this._pdNavDown.forEach(pdnd => {
            count += this.applyProps(pdnd);
        });
        this.attr('pds', '👂');
        this.attr('mtch', count.toString());
    }
    applyProps(pd) {
        const matches = pd.getMatches();
        matches.forEach(el => {
            this._cssPropMap.filter(map => map.cssSelector === pd.match).forEach(map => {
                this.setVal(this._lastEvent, el, map);
            });
        });
        return matches.length;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case m:
                if (newVal !== null) {
                    this._m = parseInt(newVal);
                    //this._hasMax = true;
                }
                else {
                    //this._hasMax = false;
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
        const bndApply = this.applyProps.bind(this);
        this._cssPropMap.forEach(pm => {
            const pdnd = new PDNavDown(this, pm.cssSelector, nd => bndApply(nd), this.m);
            pdnd.root = this;
            pdnd.init();
            this._pdNavDown.push(pdnd);
        });
        this.onPropsChange();
    }
}
define(PD);
/**
 * `p-u`
 *  Pass data from one element to a targeted DOM element elsewhere
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PU extends P {
    static get is() { return 'p-u'; }
    pass(e) {
        this._cssPropMap.forEach(map => {
            const cssSel = map.cssSelector;
            let targetElement;
            const split = cssSel.split('/');
            const id = split[split.length - 1];
            if (cssSel.startsWith('/')) {
                targetElement = self[id];
            }
            else {
                const len = cssSel.startsWith('./') ? 0 : split.length;
                const host = this.getHost(this, 0, split.length);
                if (host) {
                    if (host.shadowRoot) {
                        targetElement = host.shadowRoot.getElementById(id);
                        if (!targetElement)
                            targetElement = host.querySelector('#' + id);
                    }
                    else {
                        targetElement = host.querySelector('#' + id);
                    }
                }
                else {
                    throw 'Target Element Not found';
                }
            }
            this.setVal(e, targetElement, map);
        });
    }
    getHost(el, level, maxLevel) {
        let parent = el;
        while (parent = parent.parentElement) {
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel >= maxLevel)
                    return parent['host'];
                return this.getHost(parent['host'], newLevel, maxLevel);
            }
            else if (parent.tagName === 'HTML') {
                return parent;
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this._connected = true;
        this.onPropsChange();
    }
}
define(PU);
    })();  
        