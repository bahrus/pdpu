import {PD} from './p-d.js';
import { define } from 'xtal-element/define.js';
import {PDNavDown} from './PDNavDown.js';

export class PDR extends PD{
    static get is(){
        return 'p-d-r';
    }
    getMatches(pd: PDNavDown){
        return pd.getMatches();
    }
    newNavDown(){
        const bndApply = this.applyProps.bind(this);
        const pdnd = new PDNavDown(this, this.to, bndApply, this.m);
        pdnd.root = this;
        return pdnd;
    }
}
define(PDR);