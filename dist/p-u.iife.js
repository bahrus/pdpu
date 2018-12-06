
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
    })();  
        