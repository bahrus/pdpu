import {XtallatX} from 'xtal-latx/xtal-latx.js';
const on = 'on';
export abstract class PrevElementListener extends XtallatX(HTMLElement){
    _on: string;
    get on(){
        return this._on;
    }
    set on(val){
        this.setAttribute(on, val)
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([on]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            case on:
                this._on = newVal;
                //this.attachEventListeners();
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    connectedCallback(){
        this._upgradeProperties([on]);
    }
    _boundHandleEvent;
    abstract _handleEvent(e: Event);

    attachEventListeners(){
        const attrFilters = [];
        const prevSibling = this.getPreviousSib();
        if(this._on === 'eval' && prevSibling.tagName === 'SCRIPT'){
            const evalObj = eval(prevSibling.innerText);
            this._handleEvent(evalObj);
        }else{
            if(this._boundHandleEvent){
                return;
            }else{
                this._boundHandleEvent = this._handleEvent.bind(this);
            }
            const fakeEvent = <any>{
                target: prevSibling
            } as Event;
            this._handleEvent(fakeEvent);
            prevSibling.addEventListener(this._on, this._boundHandleEvent);
            prevSibling.removeAttribute('disabled');
        }

    }
}