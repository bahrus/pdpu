import { P, ICssPropMap } from './p.js';
import {define} from 'xtal-latx/define.js';

const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    pass(e: Event) {
        this._cssPropMap.forEach(map => {
            const detail = {};
            this.setVal(e, detail, map);
            const customEventInit = {
                name: map.cssSelector,
                bubbles: this._bubbles,
                composed: this._composed,
                detail: detail,
            } as CustomEventInit;
            this.dispatchEvent(customEventInit);
        })
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