import { NavDown } from 'xtal-element/NavDown.js';
const p_d_if = 'p-d-if';
export class PDNavDown extends NavDown {
    children: PDNavDown[] = [];
    root!: Element;
    sibCheck(sib: HTMLElement, c: number) {
        //if ((<any>sib).__aMO) return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            (<any>sib).__aMO = true;
            return;
        }
        const fec = sib.firstElementChild;

        if (fec === null) return;
        if (this.root.matches(attr)) {
            
            const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, null, this.mutDebounce);
            pdnd.root = this.root;
            this.children.push(pdnd);
            pdnd._sis = true;
            pdnd.init();
            //(<any>sib).__aMO = true;
        }
    }
    getMatches() {
        let ret = this.matches;
        this.children.forEach(child => {
            ret = ret.concat(child.getMatches());
        })
        return ret;
    }
}