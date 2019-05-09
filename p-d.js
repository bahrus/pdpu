import { P } from './p.js';
import { define } from 'trans-render/define.js';
import { NavDown } from 'xtal-element/NavDown.js';
const m = 'm';
/**
 * `p-d`
 *  Pass data from one element down the DOM tree to other elements
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class PD extends P {
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
            if (pd._inMutLoop) {
                if (el.dataset.__pdWIP !== '1')
                    return;
            }
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
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    newNavDown() {
        const bndApply = this.applyProps.bind(this);
        return new NavDown(this, this.to, bndApply, this.m);
    }
    connectedCallback() {
        this.propUp([m]);
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
