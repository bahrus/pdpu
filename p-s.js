import { PDX } from './p-d-x.js';
import { define } from 'xtal-latx/define.js';
export class PS extends PDX {
    static get is() { return 'p-s'; }
    pass(e) {
        this.passDown(e.target, e, 0);
    }
}
define(PS);
//# sourceMappingURL=p-s.js.map