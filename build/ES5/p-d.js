import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var on="on",to="to",m="m";export var PD=function(_XtallatX){babelHelpers.inherits(PD,_XtallatX);function PD(){babelHelpers.classCallCheck(this,PD);return babelHelpers.possibleConstructorReturn(this,(PD.__proto__||Object.getPrototypeOf(PD)).apply(this,arguments))}babelHelpers.createClass(PD,[{key:"detatchEventListeners",value:function detatchEventListeners(){var _this=this;if(this._siblingObserver)this._siblingObserver.disconnect();var prevSibling=this.previousElementSibling;this._on.split("|").forEach(function(token){if(!token.startsWith("@")){prevSibling.removeEventListener(token,_this._handleEvent)}})}},{key:"getPreviousSib",value:function getPreviousSib(){var prevSibling=this;while(prevSibling&&"P-D"===prevSibling.tagName){prevSibling=prevSibling.previousElementSibling}return prevSibling}},{key:"attachEventListeners",value:function attachEventListeners(){var prevSibling=this.getPreviousSib();this._boundHandleEvent=this._handleEvent.bind(this);prevSibling.addEventListener(this._on,this._boundHandleEvent);prevSibling.removeAttribute("disabled")}},{key:"_handleEvent",value:function _handleEvent(e){var _this2=this;e.stopPropagation();if(!this._cssPropMap){this._lastEvent=e;return}else{delete this._lastEvent}var nextSibling=this.nextElementSibling,count=0;while(nextSibling){this._cssPropMap.forEach(function(map){if("*"===map.cssSelector||nextSibling.matches(map.cssSelector)){count++;nextSibling[map.propTarget]=_this2.getPropFromPath(e,map.propSource)}});if(this._hasMax&&count>=this._m)break;nextSibling=nextSibling.nextElementSibling}}},{key:"passDownProp",value:function passDownProp(val){var _this3=this,nextSibling=this.nextElementSibling,count=0;while(nextSibling){this._cssPropMap.forEach(function(map){if("*"===map.cssSelector||nextSibling.matches(map.cssSelector)){count++;nextSibling[map.propTarget]=_this3.getPropFromPath(val,map.propSource)}});if(this._hasMax&&count>=this._maxMatches)break;nextSibling=nextSibling.nextElementSibling}}},{key:"getPropFromPath",value:function getPropFromPath(val,path){if(!path)return val;var context=val;path.split(".").forEach(function(token){if(context)context=context[token]});return context}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case on:this._on=newVal;break;case to:if(newVal.endsWith("}"))newVal+=";";this._to=newVal;this.parseTo();if(this._lastEvent)this._handleEvent(this._lastEvent);break;}babelHelpers.get(PD.prototype.__proto__||Object.getPrototypeOf(PD.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){this._connected=!0;this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){if(!this._connected||!this._on||!this._to)return;this.parseTo();this.attachEventListeners()}},{key:"addMutationObserver",value:function addMutationObserver(){var _this4=this;if(!this.parentElement)return;this._siblingObserver=new MutationObserver(function(){_this4.passDownProp(_this4._lastResult)});this._siblingObserver.observe(this.parentElement,{childList:!0})}},{key:"disconnectSiblingObserver",value:function disconnectSiblingObserver(){if(this._siblingObserver)this._siblingObserver.disconnect()}},{key:"parseTo",value:function parseTo(){var _this5=this;if(this._cssPropMap&&this._to===this._lastTo)return;this._lastTo=this._to;this._cssPropMap=[];var splitPassDown=this._to.split("};");splitPassDown.forEach(function(passDownSelectorAndProp){if(!passDownSelectorAndProp)return;var mapTokens=passDownSelectorAndProp.split("{"),splitPropPointer=mapTokens[1].split(":"),cssSelector=mapTokens[0];if(!cssSelector){cssSelector="*";_this5.maxMatches=1}_this5._cssPropMap.push({cssSelector:cssSelector,propTarget:splitPropPointer[0],propSource:0<splitPropPointer.length?splitPropPointer[1]:null})});if(!this._addedSiblingMutationObserver){this.addMutationObserver()}}},{key:"on",get:function get(){return this._on},set:function set(val){this.setAttribute(on,val)}},{key:"to",get:function get(){return this._to},set:function set(val){this.setAttribute(to,val)}},{key:"m",get:function get(){return this._m},set:function set(val){this.setAttribute(val.toString())}}],[{key:"is",get:function get(){return"p-d"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(PD.__proto__||Object.getPrototypeOf(PD),"observedAttributes",this).concat([on,to,m])}}]);return PD}(XtallatX(HTMLElement));if(!customElements.get(PD.is)){customElements.define(PD.is,PD)}