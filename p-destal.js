import { PDX } from './p-d-x.js';
import { define } from 'xtal-latx/define.js';
export class PDestal extends PDX {
    constructor() {
        super(...arguments);
        this._previousValues = {};
    }
    static get is() { return 'p-destal'; }
    getPreviousSib() {
        let parent = this;
        while (parent = parent.parentNode) {
            if (parent.nodeType === 11) {
                return parent['host'];
            }
            else if (parent.tagName.indexOf('-') > -1) {
                return parent;
            }
            else if (parent.tagName === 'HTML') {
                this.watchLocation();
                return null;
            }
        }
    }
    doFakeEvent() {
        const split = this._on.split(',');
        const searchParams = new URLSearchParams(location.search);
        let changedVal = false;
        split.forEach(param => {
            const trimmedParam = param.substr(1, param.length - 2);
            const searchParm = searchParams.get(trimmedParam);
            if (!changedVal && (searchParm !== this._previousValues[trimmedParam])) {
                changedVal = true;
            }
            this._previousValues[trimmedParam] = searchParm;
        });
        if (changedVal) {
            const fakeEvent = {
                target: this._previousValues,
            };
            this._hndEv(fakeEvent);
        }
    }
    watchLocation() {
        window.addEventListener('popstate', e => {
            this.doFakeEvent();
        });
        this.doFakeEvent();
    }
}
define(PDestal);
