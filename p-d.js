import { P } from './p.js';
import { define } from 'xtal-latx/define.js';
import { NavDown } from 'xtal-latx/NavDown.js';
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
    getMatches(pd) {
        return pd.matches;
    }
    applyProps(pd) {
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
        const pdnd = this.newNavDown();
        //const pdnd = new PDNavDown(this, this.to, nd => bndApply(nd), this.m);
        //pdnd.root = this;
        pdnd.ignore = 'p-d,p-d-x,script';
        pdnd.init();
        this._pdNavDown.push(pdnd);
        super.connectedCallback();
    }
}
define(PD);
//# sourceMappingURL=p-d.js.map