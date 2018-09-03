import { P } from './p.js';
import { define } from 'xtal-latx/define.js';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    pass(e) {
        this._cssPropMap.forEach(map => {
            const detail = {};
            this.setVal(e, detail, map);
            const customEventInit = new CustomEvent(map.cssSelector, {
                bubbles: this._bubbles,
                composed: this._composed,
                detail: detail,
            });
            this.dispatchEvent(customEventInit);
        });
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
//# sourceMappingURL=p-unt.js.map