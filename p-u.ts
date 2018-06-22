import {P, ICssPropMap} from './p.js';

/**
 * `p-u`
 *  Pass data from one element to a targeted DOM element elsewhere
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class PU extends P{
    static get is(){return 'p-u';}
    pass(e: Event){
        
        this._cssPropMap.forEach(map =>{
            const cssSel = map.cssSelector;
            let targetElement: HTMLElement
            if(cssSel.startsWith('/')){
                targetElement = self[cssSel.substr(1)];
            }else{
                const split = cssSel.split('/');
                const id = split[split.length - 1];
                const host = this.getHost(<any>this as HTMLElement, 0, split.length);
				if(host){
					if(host.shadowRoot){
						targetElement = host.shadowRoot.getElementById(id);
						if(!targetElement) targetElement = host.getElementById(id);
					}else{
						targetElement = host.getElementById(id);
					}
				}
            }
            if(targetElement){
                this.setVal(e, targetElement, map);
            }
        })
    }

    _host: HTMLElement
    getHost(el: HTMLElement, level: number, maxLevel : number){
        let parent : HTMLElement;
        do{
            parent = el.parentNode as HTMLElement;
            if(parent.nodeType === 11){
                const newLevel = level + 1;
                if(newLevel === maxLevel) return parent['host'];
                return this.getHost(parent['host'], newLevel, maxLevel);
            }else if(parent.tagName === 'BODY'){
                return parent;
            }
        }while(parent)
    }

    
}
if(!customElements.get(PU.is)){
    customElements.define(PU.is, PU);
}