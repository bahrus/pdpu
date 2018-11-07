import { NavDown } from 'xtal-latx/NavDown.js';
const p_d_if = 'p-d-if';
export class PDNavDown extends NavDown {
    children: PDNavDown[] = [];
    root!: Element;
    sibCheck(sib: HTMLElement, c: number) {
        if ((<any>sib).__addMutObs) return;
        const attr = sib.getAttribute(p_d_if);
        if (attr === null) {
            (<any>sib).__addMutObs = true;
            return;
        }
        const fec = sib.firstElementChild;
        // if(this.seed.matches(attr) && (fec===null)){
        //     console.log(fec);
        // }
        if (fec === null) return;
        if (this.root.matches(attr)) {
            // console.log({
            //     attr: attr,
            //     fec: fec,
            // })
            const pdnd = new PDNavDown(fec, this.match, this.notify, this.max, this.mutDebounce);
            pdnd.root = this.root;
            this.children.push(pdnd);
            pdnd.init();
            (<any>sib).__addMutObs = true;
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