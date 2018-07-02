import {XtallatX} from 'xtal-latx/xtal-latx.js';

export interface ICssPropMap {
    cssSelector: string;
    propTarget: string;
    propSource?: string;
}
const on = 'on';
const noblock = 'noblock';
//const noinit = 'noinit';
const iff = 'if';
const to = 'to';
export abstract class P extends XtallatX(HTMLElement){
    _on: string;
    get on(){
        return this._on;
    }
    set on(val){
        this.attr(on, val)
    }
    _to: string;
    get to(){
        return this._to;
    }
    set to(val){
        this.attr(to, val);
    }
    _noblock: boolean;
    get noblock(){
        return this._noblock;
    }
    set noblock(val){
        this.attr(noblock, val, '')
    }
    // _noinit: boolean;
    // get noinit(){
    //     return this._noinit;
    // }
    // set noinit(val){
    //     this.attr(noinit, val, '');
    // }
    _if: string;
    get if(){return this._if;}
    set if(val){
        this.attr(iff, val);
    }
    _input: any;
    get input(){
        return this._input;
    }
    set input(val){
        this._input = val;
        if(this._evalFn && (!this._destIsNA || !val.isFake)) {
            const returnObj = this._evalFn(this);
            if(returnObj){
                this._handleEvent(returnObj);
            }
        }
        //this._handleEvent(this._lastEvent);
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([on, to, noblock, iff]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        const f = '_' + name;
        switch(name){
            case iff:
            case on:
                this[f] = newVal;
                break;
            case to:
                this._destIsNA = newVal === '{NA}';
                if(newVal.endsWith('}')) newVal += ';';
                this._to = newVal;
                this.parseTo();
                if(this._lastEvent) this._handleEvent(this._lastEvent);
                break;
            case noblock:
                this[f] = newVal !== null;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }

    getPreviousSib() : HTMLElement{
        let prevSibling = this;
        while(prevSibling && prevSibling.tagName.startsWith('P-')){
            prevSibling = prevSibling.previousElementSibling;
        }
        return <any>prevSibling as HTMLElement;
    }
    connectedCallback(){
        this._upgradeProperties([on, to, noblock, 'input', iff]);
        setTimeout(() => this.doFake(), 50);
    }
    doFake(){
        if(!this._if){
            let lastEvent = this._lastEvent;
            if(!lastEvent){
                lastEvent = <any>{
                    target: this.getPreviousSib(),
                    isFake: true
                } as Event;
            }
            if(this._handleEvent) this._handleEvent(lastEvent);
        }        
        if(!this._addedSMO && this.addMutationObserver){
            this.addMutationObserver(<any>this as HTMLElement, false);
            this._addedSMO = true;
        }
    }
    detach(prevSibling: HTMLElement){
        prevSibling.removeEventListener(this._on, this._boundHandleEvent);
    }
    disconnectedCallback(){
        const prevSibling = this.getPreviousSib();
        if(prevSibling && this._boundHandleEvent) this.detach(prevSibling);
        this.disconnectSiblingObserver();
    }
    _boundHandleEvent;
    abstract pass(e: Event);
    _lastEvent: Event;
    _handleEvent(e: Event){
        if(this.hasAttribute('debug')) debugger;
        if(!e) return;
        if(e.stopPropagation && !this._noblock) e.stopPropagation();
        if(this._if && !(e.target as HTMLElement).matches(this._if)) return;
        this._lastEvent = e;
        if(!this._cssPropMap){
            return;
        }
        this.pass(e);
    }
    _evalFn;
    _destIsNA: boolean;
    attachEventListeners(){
        const attrFilters = [];
        const prevSibling = this.getPreviousSib();
        if(this._on === 'eval' && prevSibling.tagName === 'SCRIPT'){
            let evalObj = eval(prevSibling.innerText);
            if(typeof(evalObj) === 'function'){
                this._evalFn = evalObj;
                if(!this._destIsNA){
                    evalObj(this);
                }
               
            }else{
                this._handleEvent(evalObj);
            }
            
        }else{
            if(this._boundHandleEvent){
                return;
            }else{
                this._boundHandleEvent = this._handleEvent.bind(this);
            }

            prevSibling.addEventListener(this._on, this._boundHandleEvent);
            prevSibling.removeAttribute('disabled');
        }

    }
    onPropsChange(){
        if(!this._connected || !this._on || !this._to) return;
        this.attachEventListeners();
    }
    _cssPropMap: ICssPropMap[];
    _lastTo: string;
    parseMapping(mapTokens: string[], cssSelector: string){
        const splitPropPointer = mapTokens[1].split(':');
        this._cssPropMap.push({
            cssSelector: cssSelector,
            propTarget:splitPropPointer[0],
            propSource: splitPropPointer.length > 0 ? splitPropPointer[1] : null
        });
    }
    parseTo() {
        if(this._cssPropMap && this._to === this._lastTo) return;
        this._lastTo = this._to;
        this._cssPropMap = [];
        const splitPassDown = this._to.split('};');
        const onlyOne = splitPassDown.length <= 2;
        splitPassDown.forEach(passDownSelectorAndProp => {
            if (!passDownSelectorAndProp) return;
            const mapTokens = passDownSelectorAndProp.split('{');
            let cssSelector = mapTokens[0];
            if(!cssSelector && onlyOne){
                cssSelector = '*';
                this._m = 1;
                this._hasMax = true;
            }
           this.parseMapping(mapTokens, cssSelector);
        })

    }
    setVal(e: Event, target: HTMLElement, map: ICssPropMap){
        const gpfp = this.getPropFromPath.bind(this);
        const propFromEvent = map.propSource ? gpfp(e, map.propSource) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, map, propFromEvent);
       
    }
    commit(target: HTMLElement, map: ICssPropMap, val: any){
        target[map.propTarget] = val;
    }
    getPropFromPath(val: any, path: string){
        if(!path || path==='.') return val;
        return this.getPropFromPathTokens(val, path.split('.'));
    }
    getPropFromPathTokens(val: any, pathTokens: string[]){
        let context = val;
        pathTokens.forEach(token =>{
            if(context) context = context[token];
        });
        return context;
    }

    disconnectSiblingObserver(){
        if(this._siblingObserver)  this._siblingObserver.disconnect();
    }

    _siblingObserver: MutationObserver;
}