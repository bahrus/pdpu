import { P } from './p.js';
import { define } from 'trans-render/define.js';
/**
 * `p-u`
 *  Pass data from one element to a targeted DOM element elsewhere
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class PU extends P {
    static get is() { return 'p-u'; }
    pass(e: Event) {
        
        const cssSel = this.to;
        const split = cssSel.split('/');
        const id = split[split.length - 1];
        let targetElement: HTMLElement;
        if (cssSel.startsWith('/')) {
            targetElement = (<any>self)[cssSel.substr(1)];
        } else {
            const len = cssSel.startsWith('./') ? 0 : split.length;
            const host = this.getHost(<any>this as HTMLElement, 0, len) as HTMLElement;
            if (host) {
                if (host.shadowRoot) {
                    targetElement = host.shadowRoot.getElementById(id) as HTMLElement;
                    if (!targetElement) targetElement = host.querySelector('#' + id) as HTMLElement;
                } else {
                    targetElement = host.querySelector('#' + id) as HTMLElement;
                }
            } else {
                throw 'Target Element Not found';
            }
        }
        this.setVal(e, targetElement);
    }

    _host!: HTMLElement
    getHost(el: HTMLElement, level: number, maxLevel: number): HTMLElement | undefined {
        let parent = el as HTMLElement;
        while (parent = parent.parentNode as HTMLElement) {
            if (parent.nodeType === 11) {
                const newLevel = level + 1;
                if (newLevel >= maxLevel) return (<any>parent)['host'];
                return this.getHost((<any>parent)['host'], newLevel, maxLevel);
            } else if (parent.tagName === 'HTML') {
                return parent;
            }
        }

    }
    connectedCallback() {
        super.connectedCallback();
    }


}
define(PU);