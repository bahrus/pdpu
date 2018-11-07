import { NavDown } from 'xtal-latx/NavDown.js';
const p_d_if = 'p-d-if';
export class PDNavDown extends NavDown {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    sibCheck(sib, c) {
        if (sib.__aMO)
            return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            sib.__aMO = true;
            return;
        }
        const fec = sib.firstElementChild;
        if (fec === null)
            return;
        if (this.root.matches(attr)) {
            const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
            pdnd.root = this.root;
            this.children.push(pdnd);
            pdnd.init();
            sib.__aMO = true;
        }
    }
    getMatches() {
        let ret = this.matches;
        this.children.forEach(child => {
            ret = ret.concat(child.getMatches());
        });
        return ret;
    }
}
//# sourceMappingURL=PDNavDown.js.map