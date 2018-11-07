import { NavDown } from 'xtal-latx/NavDown.js';
const p_d_if = 'p-d-if';
export class PDNavDown extends NavDown {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    sibCheck(sib, c) {
        if (sib.__addMutObs)
            return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            sib.__addMutObs = true;
            return;
        }
        const fec = sib.firstElementChild;
        if (fec === null)
            return;
        if (attr !== null) {
            if (this.seed.matches(attr)) {
                const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
                this.children.push(pdnd);
                sib.__addMutObs = true;
            }
        }
    }
    getMatches() {
        const ret = this.matches;
        this.children.forEach(child => ret.concat(child.getMatches()));
        return ret;
    }
}
//# sourceMappingURL=PDNavDown.js.map