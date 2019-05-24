import { PD } from './p-d.js';
//import { ICssPropMap } from './p.js';
import { define } from 'trans-render/define.js';
import { createNestedProp } from 'xtal-element/createNestedProp.js';
//const attrib_filter = 'attrib-filter';
export class PDX extends PD {
    static get is() { return 'p-d-x'; }
    commit(target, val) {
        if (val === undefined)
            return;
        if (this.val === '.' && this.prop === '.') {
            Object.assign(target, val);
            return;
        }
        const targetPath = this.prop;
        switch (typeof targetPath) {
            case 'symbol':
                target[targetPath] = val;
                break;
            default:
                if (targetPath.startsWith('.')) {
                    const cssClass = targetPath.substr(1);
                    const method = val ? 'add' : 'remove';
                    target.classList[method](cssClass);
                }
                else if (targetPath.indexOf('.') > -1) {
                    const pathTokens = targetPath.split('.');
                    // const lastToken = pathTokens.pop();
                    createNestedProp(target, pathTokens, val, true);
                }
                else {
                    target[targetPath] = val;
                }
        }
    }
    getSplit(newVal) {
        if (newVal === '.') {
            return [];
        }
        else {
            const split = newVal.split('.');
            split.forEach((s, idx) => {
                const fnCheck = s.split('(');
                if (fnCheck.length === 2) {
                    const args = fnCheck[1].split(',');
                    const lenMinus1 = args.length - 1;
                    const lastEl = args[lenMinus1];
                    args[lenMinus1] = args[lenMinus1].substr(0, lastEl.length - 1);
                    split[idx] = [fnCheck[0], args];
                }
            });
            return split;
        }
    }
    attchEvListnrs() {
        if (this._on[0] !== '[') {
            super.attchEvListnrs();
            return;
        }
        const prevSibling = this.getPreviousSib();
        if (!prevSibling)
            return;
        const split = this._on.split(',').map(s => s.substr(1, s.length - 2));
        const config = {
            attributes: true,
            attributeFilter: split
        };
        this._attributeObserver = new MutationObserver(mutationRecords => {
            const values = {};
            split.forEach(attrib => {
                values[attrib] = prevSibling.getAttribute(attrib);
            });
            const fakeEvent = {
                mutationRecords: mutationRecords,
                values: values,
                target: prevSibling
            };
            this._hndEv(fakeEvent);
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
define(PDX);
export function extend(name, params) {
    class Extension extends PDX {
        propFromEvent(e) {
            params.propFromEvent(e);
        }
    }
    customElements.define('p-d-x-' + name, Extension);
}
