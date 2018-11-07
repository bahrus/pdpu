(function(){function define(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)}const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){const v=val?"set":"remove";this[v+"Attribute"](name,trueVal||val)}to$(n){const mod=n%2;return(n-mod)/2+"-"+mod}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail,asIs){const eventName=name+(asIs?"":"-changed"),newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}function createNestedProp(target,pathTokens,val,clone){const firstToken=pathTokens.shift(),tft=target[firstToken],returnObj={[firstToken]:tft?tft:{}};let tc=returnObj[firstToken];const lastToken=pathTokens.pop();pathTokens.forEach(token=>{let newContext=tc[token];if(!newContext){newContext=tc[token]={}}tc=newContext});if(tc[lastToken]&&"object"===typeof val){Object.assign(tc[lastToken],val)}else{if(lastToken===void 0){returnObj[firstToken]=val}else{tc[lastToken]=val}}if(clone)try{Object.assign(target,returnObj)}catch(e){}}const on="on",noblock="noblock",iff="if",to="to";class P extends XtallatX(HTMLElement){constructor(){super();this._connected=!1}get on(){return this._on}set on(val){this.attr(on,val)}get to(){return this._to}set to(val){this.attr(to,val)}get noblock(){return this._noblock}set noblock(val){this.attr(noblock,val,"")}get if(){return this._if}set if(val){this.attr(iff,val)}static get observedAttributes(){return super.observedAttributes.concat([on,to,noblock,iff])}attributeChangedCallback(name,oldVal,newVal){const f="_"+name;switch(name){case iff:case on:this[f]=newVal;break;case to:this._destIsNA="{NA}"===newVal;if(newVal.endsWith("}"))newVal+=";";this._to=newVal;this.parseTo();if(this._lastEvent)this._hndEv(this._lastEvent);break;case noblock:this[f]=null!==newVal;break;}super.attributeChangedCallback(name,oldVal,newVal)}getPSib(){let pS=this;while(pS&&pS.tagName.startsWith("P-")){pS=pS.previousElementSibling}return pS}connectedCallback(){this.style.display="none";this._upgradeProperties([on,to,noblock,iff]);setTimeout(()=>this.doFake(),50)}doFake(){if(!this._if&&!this.hasAttribute("skip-init")){let lastEvent=this._lastEvent;if(!lastEvent){lastEvent={target:this.getPSib(),isFake:!0}}if(this._hndEv)this._hndEv(lastEvent)}}detach(pS){pS.removeEventListener(this._on,this._bndHndlEv)}disconnectedCallback(){const pS=this.getPSib();if(pS&&this._bndHndlEv)this.detach(pS)}_hndEv(e){if(this.hasAttribute("debug"))debugger;if(!e)return;if(e.stopPropagation&&!this._noblock)e.stopPropagation();if(this._if&&!e.target.matches(this._if))return;this._lastEvent=e;if(!this._cssPropMap){return}this.pass(e)}attchEvListnrs(){const pS=this.getPSib();if(!pS)return;if(this._bndHndlEv){return}else{this._bndHndlEv=this._hndEv.bind(this)}pS.addEventListener(this._on,this._bndHndlEv);const da=pS.getAttribute("disabled");if(null!==da){if(0===da.length||"1"===da){pS.removeAttribute("disabled")}else{pS.setAttribute("disabled",(parseInt(da)-1).toString())}}}onPropsChange(){if(!this._connected||!this._on||!this._to)return;this.attchEvListnrs()}parseMapping(mapTokens,cssSelector){const splitPropPointer=mapTokens[1].split(":");this._cssPropMap.push({cssSelector:cssSelector,propTarget:splitPropPointer[0],propSource:0<splitPropPointer.length?splitPropPointer[1]:void 0})}parseTo(){if(this._cssPropMap&&this._to===this._lastTo)return;this._lastTo=this._to;this._cssPropMap=[];const splitPassDown=this._to.split("};"),onlyOne=2>=splitPassDown.length;splitPassDown.forEach(pdItem=>{if(!pdItem)return;const mT=pdItem.split("{");let cssSel=mT[0];if(!cssSel&&onlyOne){cssSel="*";this._m=1;this._hasMax=!0}this.parseMapping(mT,cssSel)})}setVal(e,target,map){const gpfp=this.getPropFromPath.bind(this),propFromEvent=map.propSource?gpfp(e,map.propSource):gpfp(e,"detail.value")||gpfp(e,"target.value");this.commit(target,map,propFromEvent)}commit(target,map,val){if(val===void 0)return;target[map.propTarget]=val}getPropFromPath(val,path){if(!path||"."===path)return val;return this.getProp(val,path.split("."))}getProp(val,pathTokens){let context=val,firstToken=!0;const cp="composedPath";pathTokens.forEach(token=>{if(context){if(firstToken&&context[cp]){firstToken=!1;const cpath=token.split(cp+"_");if(1===cpath.length){context=context[cpath[0]]}else{context=context[cp]()[parseInt(cpath[1])]}}else{context=context[token]}}});return context}}const m="m";class PD extends P{constructor(){super(...arguments);this._pdNavDown=[];this._m=1/0}static get is(){return"p-d"}get m(){return this._m}set m(val){this.attr(m,val.toString())}static get observedAttributes(){return super.observedAttributes.concat([m])}pass(e){this._lastEvent=e;this.attr("pds","\uD83C\uDF29\uFE0F");this._pdNavDown.forEach(pdnd=>{this.applyProps(pdnd)});this.attr("pds","\uD83D\uDC42")}applyProps(pd){pd.getMatches().forEach(el=>{this._cssPropMap.filter(map=>map.cssSelector===pd.match).forEach(map=>{this.setVal(this._lastEvent,el,map)})})}attributeChangedCallback(name,oldVal,newVal){switch(name){case m:if(null!==newVal){this._m=parseInt(newVal)}}super.attributeChangedCallback(name,oldVal,newVal);this.onPropsChange()}connectedCallback(){super.connectedCallback();this._upgradeProperties([m]);this._connected=!0;this.attr("pds","\uD83D\uDCDE");const bndApply=this.applyProps.bind(this);this._cssPropMap.forEach(pm=>{const pdnd=new PDNavDown(this,pm.cssSelector,nd=>bndApply(nd),this.m);pdnd.root=this;pdnd.init();this._pdNavDown.push(pdnd)});this.onPropsChange()}}define(PD);class PDX extends PD{static get is(){return"p-d-x"}parseMapping(mapTokens,cssSelector){const splitPropPointer1=mapTokens[1].split(";");splitPropPointer1.forEach(token=>{const splitPropPointer=token.split(":");this._cssPropMap.push({cssSelector:cssSelector,propTarget:splitPropPointer[0],propSource:0<splitPropPointer.length?splitPropPointer[1]:void 0})})}commit(target,map,val){if(val===void 0)return;if("."===map.propSource&&"."===map.propTarget){Object.assign(target,val);return}const targetPath=map.propTarget;if(targetPath.startsWith(".")){const cssClass=targetPath.substr(1),method=val?"add":"remove";target.classList[method](cssClass)}else if(-1<targetPath.indexOf(".")){const pathTokens=targetPath.split(".");createNestedProp(target,pathTokens,val,!0)}else{target[targetPath]=val}}attchEvListnrs(){if("["!==this._on[0]){super.attchEvListnrs();return}const prevSibling=this.getPSib();if(!prevSibling)return;const split=this._on.split(",").map(s=>s.substr(1,s.length-2));this._attributeObserver=new MutationObserver(mutationRecords=>{const values={};split.forEach(attrib=>{values[attrib]=prevSibling.getAttribute(attrib)});this._hndEv({mutationRecords:mutationRecords,values:values,target:prevSibling})});this._attributeObserver.observe(prevSibling,{attributes:!0,attributeFilter:split})}disconnect(){if(this._attributeObserver)this._attributeObserver.disconnect()}disconnectedCallback(){this.disconnect();super.disconnectedCallback()}}define(PDX);class PU extends P{static get is(){return"p-u"}pass(e){this._cssPropMap.forEach(map=>{const cssSel=map.cssSelector;let targetElement;const split=cssSel.split("/"),id=split[split.length-1];if(cssSel.startsWith("/")){targetElement=self[id]}else{const len=cssSel.startsWith("./")?0:split.length,host=this.getHost(this,0,split.length);if(host){if(host.shadowRoot){targetElement=host.shadowRoot.getElementById(id);if(!targetElement)targetElement=host.querySelector("#"+id)}else{targetElement=host.querySelector("#"+id)}}else{throw"Target Element Not found"}}this.setVal(e,targetElement,map)})}getHost(el,level,maxLevel){let parent=el;while(parent=parent.parentElement){if(11===parent.nodeType){const newLevel=level+1;if(newLevel>=maxLevel)return parent.host;return this.getHost(parent.host,newLevel,maxLevel)}else if("HTML"===parent.tagName){return parent}}}connectedCallback(){super.connectedCallback();this._connected=!0;this.onPropsChange()}}define(PU)})();