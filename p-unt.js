import { P } from './p.js';
import { define } from 'trans-render/define.js';
import { incAttr } from 'xtal-element/xtal-latx.js';
import { getHost } from 'xtal-element/getHost.js';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    pass(e) {
        const detail = {};
        this.setVal(e, detail);
        const customEventInit = new CustomEvent(this.to, {
            bubbles: this._bubbles,
            composed: this._composed,
            detail: detail,
        });
        const host = getHost(this);
        if (host !== null) {
            host.dispatchEvent(customEventInit);
            if (host.incAttr)
                host.incAttr(this.to);
        }
        else {
            this.dispatchEvent(customEventInit);
            this[incAttr](this.to);
        }
    }
    get bubbles() {
        return this._bubbles;
    }
    set bubbles(val) {
        this.attr(bubbles, val, '');
    }
    get composed() {
        return this._composed;
    }
    set composed(val) {
        this.attr(composed, val, '');
    }
    get dispatch() {
        return this._dispatch;
    }
    set dispatch(val) {
        this.attr(dispatch, val, '');
    }
}
define(PUnt);
