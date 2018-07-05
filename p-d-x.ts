import { PD } from './p-d.js';
import { ICssPropMap } from './p.js';
//const attrib_filter = 'attrib-filter';

export class PDX extends PD {
    static get is() { return 'p-d-x'; }

    parseMapping(mapTokens: string[], cssSelector: string) {
        const splitPropPointer1 = mapTokens[1].split(';');
        splitPropPointer1.forEach(token => {
            const splitPropPointer = token.split(':');
            this._cssPropMap.push({
                cssSelector: cssSelector,
                propTarget: splitPropPointer[0],
                propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
            });
        })
    }

    commit(target: HTMLElement, map: ICssPropMap, val: any) {
        if (map.propSource === '.' && map.propTarget === '.') {
            Object.assign(target, val);
            return;
        }
        const targetPath = map.propTarget;
        if (targetPath.startsWith('.')) {
            const cssClass = targetPath.substr(1);
            const method = val ? 'add' : 'remove';
            target.classList[method](cssClass);
        } else if (targetPath.indexOf('.') > -1) {
            const pathTokens = targetPath.split('.');
            const lastToken = pathTokens.pop();
            this.getPropFromPathTokens(target, pathTokens, true)[lastToken] = val;
        } else {
            target[targetPath] = val;
        }

    }

    _attributeObserver: MutationObserver;
    attachEventListeners() {
        if (!this._on.startsWith('@')) {
            super.attachEventListeners();
            return;
        }
        const prevSibling = this.getPreviousSib();
        if(!prevSibling) return;
        const split = this._on.split('@');
        const config = {
            attributes: true,
            attributeFilter: split
        } as MutationObserverInit;
        
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const fakeEvent = <any>{
                mutationRecords: mutationRecords,
                target: prevSibling
            } as Event;
            this._handleEvent(fakeEvent);
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
if (!customElements.get(PDX.is)) customElements.define(PDX.is, PDX);