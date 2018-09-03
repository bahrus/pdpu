import { PDX } from './p-d-x.js';
import {define} from 'xtal-latx/define.js';

export class PDestal extends PDX {
    static get is() { return 'p-destal'; }

    _host!: HTMLElement;
    _useLocation!: boolean;
    getPreviousSib() {
        let parent = this as Node | null;
        while (parent = parent!.parentNode) {
            if ((<HTMLElement>parent).nodeType === 11) {
                return (<any>parent)['host'];
            } else if ((<HTMLElement>parent).tagName.indexOf('-') > -1) {
                return parent;
            } else if ((<HTMLElement>parent).tagName === 'HTML') {
                this.watchLocation();
                return null;
            }
        }
    }
    _previousValues: { [key: string]: string | null } = {};
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
define(PDestal);