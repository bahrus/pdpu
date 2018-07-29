import {XtallatX} from 'xtal-latx/xtal-latx.js';

export class PDQ{
    static define(name: string, fn: (input: any) => any, adjustClass?: (newClass: any) => boolean){
        class newClass extends XtallatX(HTMLElement) {
            _connected = false;
            connectedCallback() {
                this._upgradeProperties(['input', 'disabled']);
                this._connected = true;
            }
            _input: any;
            get input(){
                return this._input;
            }
            set input(val){
                this._input = val;
                this.value = fn(val);
                this.onPropsChange();
            }
            attributeChangedCallback(name: string, oldVal: string, newVal: string) {
                super.attributeChangedCallback(name, oldVal, newVal);
                switch(name){
                    case 'input':
                        this.input = JSON.parse(newVal);
                        break;
                    default:
                        this.onPropsChange();
                }
            }
            onPropsChange(){
                if(!this._disabled) return;
                this.de('value', {
                    value: this.value
                });
            }
        }
        if(adjustClass){
            if(!adjustClass(newClass)) return;
        }
        customElements.define(name, newClass);

    }
}