import { PD } from './p-d.js';
//import { ICssPropMap } from './p.js';
import { define } from 'xtal-element/define.js';
import {createNestedProp} from 'xtal-element/createNestedProp.js';

//const attrib_filter = 'attrib-filter';

export class PDX extends PD {
    static get is() { return 'p-d-x'; }


    commit(target: HTMLElement, val: any) {
        if(val === undefined) return;
        if (this.val === '.' && this.prop === '.') {
            Object.assign(target, val);
            return;
        }
        const targetPath = this.prop;
        if (targetPath.startsWith('.')) {
            const cssClass = targetPath.substr(1);
            const method = val ? 'add' : 'remove';
            target.classList[method](cssClass);
        } else if (targetPath.indexOf('.') > -1) {
            const pathTokens = targetPath.split('.');
            // const lastToken = pathTokens.pop();
            createNestedProp(target, pathTokens, val, true);
        } else {
            (<any>target)[targetPath] = val;
        }

    }



    _attributeObserver!: MutationObserver;
    attchEvListnrs() {
        if (this._on[0] !== '[') {
            super.attchEvListnrs();
            return;
        }
        const prevSibling = this.getPreviousSib();
        if(!prevSibling) return;
        const split = this._on.split(',').map(s => s.substr(1, s.length - 2));
        const config = {
            attributes: true,
            attributeFilter: split
        } as MutationObserverInit;
        
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const values : {[key:string] : string | null} = {};
            split.forEach(attrib =>{
                values[attrib] = prevSibling.getAttribute(attrib);
            })
            const fakeEvent = <any>{
                mutationRecords: mutationRecords,
                values: values,
                target: prevSibling
            } as Event;
            this._hndEv(fakeEvent);
        });
        this._attributeObserver.observe(prevSibling, config);
    }
    disconnect() {
        if (this._attributeObserver) this._attributeObserver.disconnect();
    }
    disconnectedCallback() {
        this.disconnect();
        super.disconnectedCallback();
    }


}
define(PDX);