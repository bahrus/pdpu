import { P} from './p.js';
import {define} from 'xtal-latx/define.js';

const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    getHost() {
        let parent = this as Node | null;
        while (parent = parent!.parentNode) {
            if ((<HTMLElement>parent).nodeType === 11) {
                return (<any>parent)['host'];
            } else if ((<HTMLElement>parent).tagName.indexOf('-') > -1) {
                return parent;
            } else if ((<HTMLElement>parent).tagName === 'HTML') {
                return null;
            }
        }
    }
    pass(e: Event) {
        const detail = {};
        this.setVal(e, detail);
        const customEventInit = new CustomEvent(this.to, {
            bubbles: this._bubbles,
            composed: this._composed,
            detail: detail,
        } as CustomEventInit);
        const host = this.getHost();
        if( host!== null){
            host.dispatchEvent(customEventInit);
        }else{
            this.dispatchEvent(customEventInit);
        }
    }
    _bubbles!: boolean;
    get bubbles() {
        return this._bubbles;
    }
    set bubbles(val) {
        this.attr(bubbles, val, '');
    }
    _composed!: boolean;
    get composed() {
        return this._composed;
    }
    set composed(val) {
        this.attr(composed, val, '')
    }
    _dispatch!: boolean;
    get dispatch() {
        return this._dispatch;
    }
    set dispatch(val) {
        this.attr(dispatch, val, '');
    }
}
define(PUnt);