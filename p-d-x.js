import { PD } from './p-d.js';
//const attrib_filter = 'attrib-filter';
export class PDX extends PD {
    static get is() { return 'p-d-x'; }
    parseMapping(mapTokens, cssSelector) {
        const splitPropPointer1 = mapTokens[1].split(';');
        splitPropPointer1.forEach(token => {
            const splitPropPointer = token.split(':');
            this._cssPropMap.push({
                cssSelector: cssSelector,
                propTarget: splitPropPointer[0],
                propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
            });
        });
    }
    commit(target, map, val) {
        const targetPath = map.propTarget;
        if (targetPath.startsWith('.')) {
            const cssClass = targetPath.substr(1);
            const method = val ? 'add' : 'remove';
            target.classList[method](cssClass);
        }
        else if (targetPath.indexOf('.') > -1) {
            const pathTokens = targetPath.split('.');
            const lastToken = pathTokens.pop();
            this.getPropFromPathTokens(target, pathTokens)[lastToken] = val;
        }
        else {
            target[targetPath] = val;
        }
    }
    _handleEvent(e) {
        if (this.hasAttribute('debug'))
            debugger;
        super._handleEvent(e);
    }
    attachEventListeners() {
        if (!this._on.startsWith('@')) {
            super.attachEventListeners();
            return;
        }
        const split = this._on.split(',').map(token => token.substr(1));
        const config = {
            attributes: true,
            attributeFilter: split
        };
        const prevSibling = this.getPreviousSib();
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const fakeEvent = {
                mutationRecords: mutationRecords,
                target: prevSibling
            };
        });
        this._attributeObserver.observe(prevSibling, config);
    }
    disconnect() {
        if (this._attributeObserver)
            this._attributeObserver.disconnect();
    }
    disconnectedCallback() {
        this.disconnect();
        super.disconnectedCallback();
    }
}
if (!customElements.get(PDX.is))
    customElements.define(PDX.is, PDX);
//# sourceMappingURL=p-d-x.js.map