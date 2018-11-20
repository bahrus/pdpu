import {XtallatX} from 'xtal-latx/xtal-latx.js';


const on = 'on';
const noblock = 'noblock';
const iff = 'if';
const to = 'to';
const prop ='prop';
const val = 'val';

export abstract class P extends XtallatX(HTMLElement){
    constructor(){
        super();
        
    }
    //* region props
    _on!: string;
    get on(){
        return this._on;
    }
    set on(val){
        this.attr(on, val)
    }
    _to!: string;
    get to(){
        return this._to;
    }
    set to(val){
        this.attr(to, val);
    }
    _noblock!: boolean;
    get noblock(){
        return this._noblock;
    }
    set noblock(val){
        this.attr(noblock, val, '')
    }
    
    _if!: string;
    get if(){return this._if;}
    set if(val){
        this.attr(iff, val);
    }

    _prop!: string;
    get prop(){return this._prop;}
    set prop(val){
        this.attr(prop, val);
    }

    _val!: string;
    get val(){return this._val;}
    set val(val){
        this.attr(prop, val);
    }
    
    static get observedAttributes(){
        return super.observedAttributes.concat([on, to, noblock, iff, prop, val]);
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        const f = '_' + name;
        switch(name){
            case iff:
            case on:
            case prop:
            case val:
            case to:
                (<any>this)[f] = newVal;
                break;
            case noblock:
                (<any>this)[f] = newVal !== null;
                break;
            
        }
        super.attributeChangedCallback(name, oldVal, newVal);
    }
    /**
     * get previous sibling
     */
    getPreviousSib() : Element | null{
        let pS = this as Element | null;
        while(pS && pS.tagName.startsWith('P-')){
            pS = pS.previousElementSibling!;
        }
        return pS;
    }
    connectedCallback(){
        this.style.display = 'none';
        this._upgradeProperties([on, to, noblock, iff, prop, val]);
        this.init();
    }
    init(){
        this.attchEvListnrs();
        this.doFake();
    };
    attchEvListnrs(){
        const attrFilters = [];
        const pS = this.getPreviousSib();
        if(!pS) return;
        
        if(this._bndHndlEv){
            return;
        }else{
            this._bndHndlEv = this._hndEv.bind(this);
        }

        pS.addEventListener(this._on, this._bndHndlEv);
        const da = pS.getAttribute('disabled');
        if(da !== null){
            if(da.length === 0 ||da==="1"){
                pS.removeAttribute('disabled');
            }else{
                pS.setAttribute('disabled', (parseInt(da) - 1).toString());
            }
        }
        

    }
    skI(){
        return this.hasAttribute('skip-init')
    }
    doFake(){
        if(!this._if && !this.skI()){
            let lastEvent = this._lastEvent;
            if(!lastEvent){
                lastEvent = <any>{
                    target: this.getPreviousSib(),
                    isFake: true
                } as Event;
            }
            if(this._hndEv) this._hndEv(lastEvent);
        }        

    }

    _bndHndlEv!: any;
    abstract pass(e: Event) : void;
    _lastEvent: Event | null = null;
    _hndEv(e: Event){
        if(this.hasAttribute('debug')) debugger;
        if(!e) return;
        if(e.stopPropagation && !this._noblock) e.stopPropagation();
        if(this._if && !(e.target as HTMLElement).matches(this._if)) return;
        this._lastEvent = e;
        this.pass(e);
    }
    _destIsNA!: boolean;

    setVal(e: Event, target: any){
        const gpfp = this.getPropFromPath.bind(this);
        const propFromEvent = this.val ? gpfp(e, this.val) : gpfp(e, 'detail.value') || gpfp(e, 'target.value');
        this.commit(target, propFromEvent);
       
    }
    commit(target: HTMLElement, val: any){
        if(val===undefined) return;
        (<any>target)[this.prop] = val;
    }
    getPropFromPath(val: any, path: string){
        if(!path || path==='.') return val;
        return this.getProp(val, path.split('.'));
    }
    getProp(val: any, pathTokens: string[]){
        let context = val;
        let firstToken = true;
        const cp = 'composedPath';
        const cp_ = cp + '_';
        pathTokens.forEach(token => {
            if(context)  {
                if(firstToken && context[cp]){
                    firstToken = false;
                    const cpath = token.split(cp_);
                    if(cpath.length === 1){
                        context = context[cpath[0]];
                    }else{
                        context = context[cp]()[parseInt(cpath[1])];
                    }
                }else{
                    context = context[token];
                }
                
            }
        });
        return context;
    }
    detach(pS: Element){
        pS.removeEventListener(this._on, this._bndHndlEv);
    }
    disconnectedCallback(){
        const pS = this.getPreviousSib();
        if(pS && this._bndHndlEv) this.detach(pS);
    }
}