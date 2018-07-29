import {PDX} from './p-d-x.js';

export class PS extends PDX{
    static get is(){return 'p-s';}

    pass(e: Event){
        this.passDown(e.target as HTMLElement, e, 0);
    }
}

if (!customElements.get(PS.is)) customElements.define(PS.is, PS);