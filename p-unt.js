import { P } from './p.js';
import { define } from 'xtal-element/define.js';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    getHost() {
        let parent = this;
        while (parent = parent.parentNode) {
            if (parent.nodeType === 11) {
                return parent['host'];
            }
            else if (parent.tagName.indexOf('-') > -1) {
                return parent;
            }
            else if (parent.tagName === 'HTML') {
                return null;
            }
        }
    }
    pass(e) {
        const detail = {};
        this.setVal(e, detail);
        const customEventInit = new CustomEvent(this.to, {
            bubbles: this._bubbles,
            composed: this._composed,
            detail: detail,
        });
        const host = this.getHost();
        if (host !== null) {
            host.dispatchEvent(customEventInit);
            host.incAttr(this.to);
        }
        else {
            this.dispatchEvent(customEventInit);
            this.incAttr(this.to);
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
