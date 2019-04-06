import { XtallatX } from 'xtal-element/xtal-latx.js';
import { up } from 'trans-render/hydrate.js';
const on = 'on';
const noblock = 'noblock';
const iff = 'if';
const to = 'to';
const prop = 'prop';
const val = 'val';
export class P extends XtallatX(HTMLElement) {
    constructor() {
        super();
        this._s = null;
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
        switch (typeof val) {
            case 'symbol':
                this._prop = val;
                break;
            default:
                this.attr(prop, val);
        }
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
        if (name === val && newVal !== null) {
            if (newVal === '.') {
                this._s = [];
            }
            else {
                const split = newVal.split('.');
                split.forEach((s, idx) => {
                    const fnCheck = s.split('(');
                    if (fnCheck.length === 2) {
                        const args = fnCheck[1].split(',');
                        const lenMinus1 = args.length - 1;
                        const lastEl = args[lenMinus1];
                        args[lenMinus1] = args[lenMinus1].substr(0, lastEl.length - 1);
                        split[idx] = [fnCheck[0], args];
                    }
                });
                this._s = split;
            }
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
        this[up]([on, to, noblock, iff, prop, val]);
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
        const gpfp = this.getProp.bind(this);
        const propFromEvent = this._s !== null ? gpfp(e, this._s) : this.$N(gpfp(e, ['detail', 'value']), gpfp(e, ['target', 'value']));
        this.commit(target, propFromEvent);
    }
    commit(target, val) {
        if (val === undefined)
            return;
        target[this.prop] = val;
    }
    // getPropFromPath(val: any, path: string){
    //     if(!path || path==='.') return val;
    //     return this.getProp(val, path.split('.'));
    // }
    getProp(val, pathTokens) {
        let context = val;
        pathTokens.forEach(token => {
            if (context) {
                switch (typeof token) {
                    case 'string':
                        context = context[token];
                        break;
                    default:
                        context = context[token[0]].apply(context, token[1]);
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
