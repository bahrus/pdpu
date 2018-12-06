
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
        de(name, detail, asIs = false) {
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
    constructor(seed, match, notify, max, ignore = null, mutDebounce = 50) {
        this.seed = seed;
        this.match = match;
        this.notify = notify;
        this.max = max;
        this.ignore = ignore;
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
        let ns = this._sis ? this.seed : this.seed.nextElementSibling;
        while (ns !== null) {
            if (this.ignore === null || !ns.matches(this.ignore)) {
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
            }
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
        //if ((<any>sib).__aMO) return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            sib.__aMO = true;
            return;
        }
        const fec = sib.firstElementChild;
        if (fec === null)
            return;
        if (this.root.matches(attr)) {
            const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, null, this.mutDebounce);
            pdnd.root = this.root;
            this.children.push(pdnd);
            pdnd._sis = true;
            pdnd.init();
            //(<any>sib).__aMO = true;
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
function createNestedProp(target, pathTokens, val, clone) {
    const firstToken = pathTokens.shift();
    const tft = target[firstToken];
    const returnObj = { [firstToken]: tft ? tft : {} };
    let tc = returnObj[firstToken]; //targetContext
    const lastToken = pathTokens.pop();
    pathTokens.forEach(token => {
        let newContext = tc[token];
        if (!newContext) {
            newContext = tc[token] = {};
        }
        tc = newContext;
    });
    if (tc[lastToken] && typeof (val) === 'object') {
        Object.assign(tc[lastToken], val);
    }
    else {
        if (lastToken === undefined) {
            returnObj[firstToken] = val;
        }
        else {
            tc[lastToken] = val;
        }
    }
    //this controversial line is to force the target to see new properties, even though we are updating nested properties.
    //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 
    if (clone)
        try {
            Object.assign(target, returnObj);
        }
        catch (e) { }
    ;
}
const on = 'on';
const noblock = 'noblock';
const iff = 'if';
const to = 'to';
const prop = 'prop';
const val = 'val';
class P extends XtallatX(HTMLElement) {
    constructor() {
        super();
        this._lastEvent = null;
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
    get prop() { return this._prop; }
    set prop(val) {
        this.attr(prop, val);
    }
    get val() { return this._val; }
    set val(val) {
        this.attr(prop, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([on, to, noblock, iff, prop, val]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        const f = '_' + name;
        switch (name) {
            case iff:
            case on:
            case prop:
            case val:
            case to:
                this[f] = newVal;
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
    getPreviousSib() {
        let pS = this;
        while (pS && pS.tagName.startsWith('P-')) {
            pS = pS.previousElementSibling;
        }
        if (pS === null)
            pS = this.parentElement;
        return pS;
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties([on, to, noblock, iff, prop, val]);
        this.init();
    }
    init() {
        this.attchEvListnrs();
        this.doFake();
    }
    ;
    attchEvListnrs() {
        if (this._bndHndlEv) {
            return;
        }
        else {
            this._bndHndlEv = this._hndEv.bind(this);
        }
        const pS = this.getPreviousSib();
        if (!pS)
            return;
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
    skI() {
        return this.hasAttribute('skip-init');
    }
    doFake() {
        if (!this._if && !this.skI()) {
            let lastEvent = this._lastEvent;
            if (!lastEvent) {
                lastEvent = {
                    target: this.getPreviousSib(),
                    isFake: true
                };
            }
            if (this._hndEv)
                this._hndEv(lastEvent);
        }
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
        this.pass(e);
    }
    //https://stackoverflow.com/questions/476436/is-there-a-null-coalescing-operator-in-javascript
    $N(value, ifnull) {
        if (value === null || value === undefined)
            return ifnull;
        return value;
    }
    setVal(e, target) {
        const gpfp = this.getPropFromPath.bind(this);
        const propFromEvent = this.val ? gpfp(e, this.val) : this.$N(gpfp(e, 'detail.value'), gpfp(e, 'target.value'));
        this.commit(target, propFromEvent);
    }
    commit(target, val) {
        if (val === undefined)
            return;
        target[this.prop] = val;
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
    detach(pS) {
        pS.removeEventListener(this._on, this._bndHndlEv);
    }
    disconnectedCallback() {
        const pS = this.getPreviousSib();
        if (pS && this._bndHndlEv)
            this.detach(pS);
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
        this._pdNavDown = null;
        //_hasMax!: boolean;
        this._m = Infinity;
        this._iIP = false;
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
        const count = this.applyProps(this._pdNavDown);
        this.attr('pds', '👂');
        this.attr('mtch', count.toString());
    }
    getMatches(pd) {
        return pd.matches;
    }
    applyProps(pd) {
        //if(this._iIP && this.skI()) return;
        if (this._iIP)
            return 0;
        const matches = this.getMatches(pd); //const matches = pd.getMatches();
        matches.forEach(el => {
            this.setVal(this._lastEvent, el);
        });
        return matches.length;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case m:
                if (newVal !== null) {
                    this._m = parseInt(newVal);
                }
                else {
                }
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    newNavDown() {
        const bndApply = this.applyProps.bind(this);
        return new NavDown(this, this.to, bndApply, this.m);
    }
    connectedCallback() {
        this._upgradeProperties([m]);
        this.attr('pds', '📞');
        if (!this.to) {
            //apply to next only
            this.to = '*';
            this.m = 1;
        }
        const pdnd = this.newNavDown();
        //const pdnd = new PDNavDown(this, this.to, nd => bndApply(nd), this.m);
        //pdnd.root = this;
        pdnd.ignore = 'p-d,p-d-x,p-d-r,script';
        this._iIP = true;
        pdnd.init();
        this._iIP = false;
        this._pdNavDown = pdnd;
        super.connectedCallback();
    }
}
define(PD);
class PDR extends PD {
    static get is() {
        return 'p-d-r';
    }
    getMatches(pd) {
        return pd.getMatches();
    }
    newNavDown() {
        const bndApply = this.applyProps.bind(this);
        const pdnd = new PDNavDown(this, this.to, bndApply, this.m);
        pdnd.root = this;
        return pdnd;
    }
}
define(PDR);
//import { ICssPropMap } from './p.js';
//const attrib_filter = 'attrib-filter';
class PDX extends PD {
    static get is() { return 'p-d-x'; }
    commit(target, val) {
        if (val === undefined)
            return;
        if (this.val === '.' && this.prop === '.') {
            Object.assign(target, val);
            return;
        }
        const targetPath = this.prop;
        if (targetPath.startsWith('.')) {
            const cssClass = targetPath.substr(1);
            const method = val ? 'add' : 'remove';
            target.classList[method](cssClass);
        }
        else if (targetPath.indexOf('.') > -1) {
            const pathTokens = targetPath.split('.');
            // const lastToken = pathTokens.pop();
            createNestedProp(target, pathTokens, val, true);
        }
        else {
            target[targetPath] = val;
        }
    }
    attchEvListnrs() {
        if (this._on[0] !== '[') {
            super.attchEvListnrs();
            return;
        }
        const prevSibling = this.getPreviousSib();
        if (!prevSibling)
            return;
        const split = this._on.split(',').map(s => s.substr(1, s.length - 2));
        const config = {
            attributes: true,
            attributeFilter: split
        };
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const values = {};
            split.forEach(attrib => {
                values[attrib] = prevSibling.getAttribute(attrib);
            });
            const fakeEvent = {
                mutationRecords: mutationRecords,
                values: values,
                target: prevSibling
            };
            this._hndEv(fakeEvent);
        });
        this._attributeObserver.observe(prevSibling, config);
    }
    disconnect() {
        if (this._attributeObserver)
            this._attributeObserver.disconnect();
    }
    disconnectedCallback() {
        this.disconnect();
        super.disconnectedCallback();
    }
}
define(PDX);
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
        const cssSel = this.to;
        const split = cssSel.split('/');
        const id = split[split.length - 1];
        let targetElement;
        if (cssSel.startsWith('/')) {
            targetElement = self[cssSel];
        }
        else {
            const len = cssSel.startsWith('./') ? 0 : split.length;
            const host = this.getHost(this, 0, len);
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
        this.setVal(e, targetElement);
    }
    getHost(el, level, maxLevel) {
        let parent = el;
        while (parent = parent.parentNode) {
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
    }
}
define(PU);
class PDestal extends PDX {
    constructor() {
        super(...arguments);
        this._previousValues = {};
    }
    static get is() { return 'p-destal'; }
    getPreviousSib() {
        let parent = this;
        while (parent = parent.parentNode) {
            if (parent.nodeType === 11) {
                return parent['host'];
            }
            else if (parent.tagName.indexOf('-') > -1) {
                return parent;
            }
            else if (parent.tagName === 'HTML') {
                this.watchLocation();
                return null;
            }
        }
    }
    doFakeEvent() {
        const split = this._on.split(',');
        const searchParams = new URLSearchParams(location.search);
        let changedVal = false;
        split.forEach(param => {
            const trimmedParam = param.substr(1, param.length - 2);
            const searchParm = searchParams.get(trimmedParam);
            if (!changedVal && (searchParm !== this._previousValues[trimmedParam])) {
                changedVal = true;
            }
            this._previousValues[trimmedParam] = searchParm;
        });
        if (changedVal) {
            const fakeEvent = {
                target: this._previousValues,
            };
            this._hndEv(fakeEvent);
        }
    }
    watchLocation() {
        window.addEventListener('popstate', e => {
            this.doFakeEvent();
        });
        this.doFakeEvent();
    }
}
define(PDestal);
class PS extends PDR {
    static get is() { return 'p-s'; }
    getPreviousSib() {
        const parent = this.parentElement;
        if (!parent)
            return null;
        //if(parent.firstChild !== this) return null;
        return parent;
    }
}
define(PS);
    })();  
        