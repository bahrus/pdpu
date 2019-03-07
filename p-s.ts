import {PDR} from './p-d-r.js';
import {define} from 'xtal-element/define.js';
export class PS extends PDR{
    static get is(){return 'p-s';}

    getPreviousSib() : Element | null{
        const parent = this.parentElement;
        if(!parent) return null;
        //if(parent.firstChild !== this) return null;
        return parent;
    }

}
define(PS);