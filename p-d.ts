import {XtallatX} from './xtal-latx.js';
const on = 'on';
const to = 'to';
const m = 'm';
export class PD extends XtallatX(HTMLElement){
    static get is(){return 'p-d';}
    _on: string;
    get on(){
        return this._on;
    }
    set on(val){
        this.setAttribute(on, val)
    }
    get to(){
        return this._passDown
    }
    set to(val){
        this.passDown = val;
    }
    get m(){
        return this._maxMatches;
    }
    set m(val){
        this.maxMatches = val;
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([on, to, m]);
    }
    _observer: MutationObserver;

    detatchEventListeners(){
        if(this._observer) this._observer.disconnect();
        const prevSibling = (<any>this as HTMLElement).previousElementSibling;
        this._on.split('|').forEach(token =>{
            if(!token.startsWith('@')){
                prevSibling.removeEventListener(token, this._handleEvent);
            }
        })
    }
    attachEventListeners(){
        const attrFilters = [];
        const prevSibling = (<any>this as HTMLElement).previousElementSibling;
        this._on.split('|').forEach(token =>{
            if(token.startsWith('@')){
                attrFilters.push(token);
            }else{
                prevSibling.addEventListener(token, this._handleEvent);
            }
        })
        if(attrFilters.length > 0){
            const config = { attributes: true, attributeFilter: attrFilters};
            this._observer =  new MutationObserver((mutationsList: MutationRecord[]) =>{
                this._handleEvent();
            });
            this._observer.observe(prevSibling, config);
        }
    }
    _handleEvent(){
        const prevSibling = (<any>this as HTMLElement).previousElementSibling;
        let nextSibling = this.nextElementSibling;
        let count = 0;
        while (nextSibling) {
            this._cssPropMap.forEach(map => {
                if (map.cssSelector === '*' || nextSibling.matches(map.cssSelector)) {
                    count++;
                    nextSibling[map.propTarget] = this.getPropFromPath(val, map.propSource);
                }
            })
            if(this._hasMax && count >= this._maxMatches) break;
            nextSibling = nextSibling.nextElementSibling;
        }
    }
    attributeChangedCallback(name, oldVal, newVal){
        switch(name){
            case on:
                this._on = newVal;
                this.attachEventListeners();
                break;
        }
    }
}
if(!customElements.get(PD.is)){
    customElements.define(PD.is, PD);
}