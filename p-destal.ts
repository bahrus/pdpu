import { PDX } from './p-d-x.js';


export class PDestal extends PDX {
    static get is() { return 'p-destal'; }

    _host: HTMLElement;
    _useLocation: boolean;
    getPreviousSib() {
        let parent = this;
        while (parent = parent.parentNode) {
            if (parent.nodeType === 11) {
                return parent['host'];
            } else if (parent.tagName.indexOf('-') > -1) {
                return parent;
            } else if (parent.tagName === 'HTML') {
                this.watchLocation();
                return null;
            }
        }
        this._useLocation
    }
    _previousValues: { [key: string]: string } = {};
    doFakeEvent() {
        const split = this._on.split('@');
        const searchParams = new URLSearchParams(location.search);
        let changedVal = false;
        split.forEach(param => {
            const searchParm = searchParams.get(param);
            if (!changedVal && (searchParm !== this._previousValues[param])) {
                changedVal = true;
            }
            this._previousValues[param] = searchParm;
        })
        if (changedVal) {
            const fakeEvent = <any>{
                target: this._previousValues,
            } as Event;
            this._handleEvent(fakeEvent)
        }

    }
    watchLocation() {
        window.addEventListener('popstate', e => {
            this.doFakeEvent();
        })
        this.doFakeEvent();
    }

}
if (!customElements.get(PDestal.is)) customElements.define(PDestal.is, PDestal);