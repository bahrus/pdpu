import { P } from './p.js';
const bubbles = 'bubbles';
const composed = 'composed';
const dispatch = 'dispatch';
export class PUnt extends P {
    static get is() { return 'p-unt'; }
    pass(e) {
        this._cssPropMap.forEach(map => {
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
        if (val) {
            this.setAttribute(dispatch, '');
        }
        else {
            this.removeAttribute(dispatch);
        }
    }
}
//# sourceMappingURL=p-unt.js.map