import { P, ICssPropMap } from './p.js';
import { define } from 'xtal-latx/define.js';
import {PDNavDown} from './PDNavDown.js';

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
    static get is() { return 'p-d'; }
    _pdNavDown: PDNavDown[] = [];
    //_hasMax!: boolean;
    _m: number = Infinity; 
    get m() {
        return this._m;
    }
    set m(val) {
        this.attr(m, val.toString());
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([m]);
    }



    pass(e: Event) {
        this._lastEvent = e;
        this.attr('pds', '🌩️');
        //this.passDown(this.nextElementSibling, e, 0);
        this._pdNavDown.forEach(pdnd =>{
            this.applyProps(pdnd);
        })
        this.attr('pds', '👂');
    }

    applyProps(pd: PDNavDown){
        pd.getMatches().forEach(el =>{
            this._cssPropMap.filter(map => map.cssSelector === pd.match). forEach(map => {
                this.setVal(this._lastEvent, el, map)
            });
        })
    }



    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {

            case m:
                if (newVal !== null) {
                    this._m = parseInt(newVal);
                    //this._hasMax = true;
                } else {
                    //this._hasMax = false;
                }
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    connectedCallback() {
        super.connectedCallback();
        this._upgradeProperties([m])
        this._connected = true;
        this.attr('pds', '📞');
        const bndApply = this.applyProps.bind(this);
        this._cssPropMap.forEach(pm =>{
            const pdnd = new PDNavDown(this, pm.cssSelector, nd => bndApply(nd), this.m);
            pdnd.init();
            this._pdNavDown.push(pdnd);
        })
        
        this.onPropsChange();

    }



}
define(PD);
