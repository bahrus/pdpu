(function(){var disabled="disabled";function XtallatX(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail){var newEvent=new CustomEvent(name+"-changed",{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this=this;props.forEach(function(prop){if(_this.hasOwnProperty(prop)){var value=_this[prop];delete _this[prop];_this[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){if(val){this.setAttribute(disabled,"")}else{this.removeAttribute(disabled)}}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}var on="on",noblock="noblock",to="to",P=function(_XtallatX){babelHelpers.inherits(P,_XtallatX);function P(){babelHelpers.classCallCheck(this,P);return babelHelpers.possibleConstructorReturn(this,(P.__proto__||Object.getPrototypeOf(P)).apply(this,arguments))}babelHelpers.createClass(P,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case on:this._on=newVal;break;case to:if(newVal.endsWith("}"))newVal+=";";this._to=newVal;this.parseTo();if(this._lastEvent)this._handleEvent(this._lastEvent);break;case noblock:this._noblock=null!==newVal;}babelHelpers.get(P.prototype.__proto__||Object.getPrototypeOf(P.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal)}},{key:"getPreviousSib",value:function getPreviousSib(){var prevSibling=this;while(prevSibling&&prevSibling.tagName.startsWith("P-")){prevSibling=prevSibling.previousElementSibling}return prevSibling}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([on,to,noblock])}},{key:"disconnectedCallback",value:function disconnectedCallback(){var prevSibling=this.getPreviousSib();if(prevSibling&&this._boundHandleEvent)this.detach(prevSibling);this.disconnectSiblingObserver()}},{key:"_handleEvent",value:function _handleEvent(e){if(e.stopPropagation&&!this._noblock)e.stopPropagation();this._lastEvent=e;if(!this._cssPropMap){return}this.pass(e)}},{key:"attachEventListeners",value:function attachEventListeners(){var attrFilters=[],prevSibling=this.getPreviousSib();if("eval"===this._on&&"SCRIPT"===prevSibling.tagName){var evalObj=eval(prevSibling.innerText);this._handleEvent(evalObj)}else{if(this._boundHandleEvent){return}else{this._boundHandleEvent=this._handleEvent.bind(this)}this._handleEvent({target:prevSibling});prevSibling.addEventListener(this._on,this._boundHandleEvent);prevSibling.removeAttribute("disabled")}}},{key:"parseMapping",value:function parseMapping(mapTokens,cssSelector){var splitPropPointer=mapTokens[1].split(":");this._cssPropMap.push({cssSelector:cssSelector,propTarget:splitPropPointer[0],propSource:0<splitPropPointer.length?splitPropPointer[1]:null})}},{key:"parseTo",value:function parseTo(){var _this2=this;if(this._cssPropMap&&this._to===this._lastTo)return;this._lastTo=this._to;this._cssPropMap=[];var splitPassDown=this._to.split("};");splitPassDown.forEach(function(passDownSelectorAndProp){if(!passDownSelectorAndProp)return;var mapTokens=passDownSelectorAndProp.split("{"),cssSelector=mapTokens[0];if(!cssSelector){cssSelector="*";_this2._m=1;_this2._hasMax=!0}_this2.parseMapping(mapTokens,cssSelector)});if(!this._addedSMO){this.addMutationObserver(this);this._addedSMO=!0}}},{key:"setVal",value:function setVal(e,target,map){if(!map.propSource){var defaultProp=this.getPropFromPath(e,"detail.value");if(!defaultProp)defaultProp=this.getPropFromPath(e,"target.value");this.commit(target,map,defaultProp)}else{this.commit(target,map,this.getPropFromPath(e,map.propSource))}}},{key:"commit",value:function commit(target,map,val){target[map.propTarget]=val}},{key:"getPropFromPath",value:function getPropFromPath(val,path){if(!path)return val;return this.getPropFromPathTokens(val,path.split("."))}},{key:"getPropFromPathTokens",value:function getPropFromPathTokens(val,pathTokens){var context=val;pathTokens.forEach(function(token){if(context)context=context[token]});return context}},{key:"disconnectSiblingObserver",value:function disconnectSiblingObserver(){if(this._siblingObserver)this._siblingObserver.disconnect()}},{key:"on",get:function get(){return this._on},set:function set(val){this.setAttribute(on,val)}},{key:"to",get:function get(){return this._to},set:function set(val){this.setAttribute(to,val)}},{key:"noblock",get:function get(){return this._noblock},set:function set(val){if(val){this.setAttribute(noblock,"")}else{this.removeAttribute(noblock)}}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(P.__proto__||Object.getPrototypeOf(P),"observedAttributes",this).concat([on,to,noblock])}}]);return P}(XtallatX(HTMLElement)),m="m",p_d_if="p-d-if",PDIf="PDIf",_addedSMO="_addedSMO",PD=function(_P){babelHelpers.inherits(PD,_P);function PD(){babelHelpers.classCallCheck(this,PD);return babelHelpers.possibleConstructorReturn(this,(PD.__proto__||Object.getPrototypeOf(PD)).apply(this,arguments))}babelHelpers.createClass(PD,[{key:"detach",value:function detach(prevSibling){prevSibling.removeEventListener(this._on,this._boundHandleEvent)}},{key:"pass",value:function pass(e){this.passDown(this.nextElementSibling,e,0)}},{key:"passDown",value:function passDown(start,e,count){var _this3=this,nextSibling=start;while(nextSibling){this._cssPropMap.forEach(function(map){if("*"===map.cssSelector||nextSibling.matches(map.cssSelector)){count++;_this3.setVal(e,nextSibling,map)}var fec=nextSibling.firstElementChild;if(_this3.id&&fec&&nextSibling.hasAttribute(p_d_if)){if(_this3.matches(nextSibling.getAttribute(p_d_if))){_this3.passDown(fec,e,count);var addedSMOTracker=nextSibling[_addedSMO];if(!addedSMOTracker)addedSMOTracker=nextSibling[_addedSMO]={};if(!addedSMOTracker[_this3.id]){_this3.addMutationObserver(fec);nextSibling[_addedSMO][_this3.id]=!0}}}});if(this._hasMax&&count>=this._m)break;nextSibling=nextSibling.nextElementSibling}}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case m:if(null!==newVal){this._m=parseInt(newVal);this._hasMax=!0}else{this._hasMax=!1}}babelHelpers.get(PD.prototype.__proto__||Object.getPrototypeOf(PD.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(PD.prototype.__proto__||Object.getPrototypeOf(PD.prototype),"connectedCallback",this).call(this);this._upgradeProperties([m]);this._connected=!0;this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){if(!this._connected||!this._on||!this._to)return;this.attachEventListeners()}},{key:"addMutationObserver",value:function addMutationObserver(baseElement){var _this4=this;if(!baseElement.parentElement)return;this._siblingObserver=new MutationObserver(function(){if(!_this4._lastEvent)return;_this4._handleEvent(_this4._lastEvent)});this._siblingObserver.observe(this.parentElement,{childList:!0})}},{key:"m",get:function get(){return this._m},set:function set(val){this.setAttribute(val.toString())}}],[{key:"is",get:function get(){return"p-d"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(PD.__proto__||Object.getPrototypeOf(PD),"observedAttributes",this).concat([m])}}]);return PD}(P);if(!customElements.get(PD.is)){customElements.define(PD.is,PD)}var PU=function(_P2){babelHelpers.inherits(PU,_P2);function PU(){babelHelpers.classCallCheck(this,PU);return babelHelpers.possibleConstructorReturn(this,(PU.__proto__||Object.getPrototypeOf(PU)).apply(this,arguments))}babelHelpers.createClass(PU,[{key:"pass",value:function pass(e){var _this5=this;this._cssPropMap.forEach(function(map){var cssSel=map.cssSelector,targetElement;if(cssSel.startsWith("/")){targetElement=self[cssSel.substr(1)]}else{var split=cssSel.split("/"),id=split[split.length-1],host=_this5.getHost(_this5,0,split.length);if(host.shadowRoot){targetElement=host.shadowRoot.getElementById(id);if(!targetElement)targetElement=host.getElementById(id)}else if(host){targetElement=host.getElementById(id)}}if(targetElement){_this5.setVal(e,targetElement,map)}})}},{key:"getHost",value:function getHost(el,level,maxLevel){var parent;do{parent=el.parentNode;if(11===parent.nodeType){var newLevel=level+1;if(newLevel===maxLevel)return parent.host;return this.getHost(parent.host,newLevel,maxLevel)}else if("BODY"===parent.tagName){return parent}}while(parent)}}],[{key:"is",get:function get(){return"p-u"}}]);return PU}(P);if(!customElements.get(PU.is)){customElements.define(PU.is,PU)}})();