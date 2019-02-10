[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/p-d.p-u)

<a href="https://nodei.co/npm/p-d.p-u/"><img src="https://nodei.co/npm/p-d.p-u.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/p-d.p-u">

<!--
```
<custom-element-demo>
<template>
    <div>
        <wc-info package-name="npm install p-d.p-u" href="https://unpkg.com/p-d.p-u@0.0.101/html.json"></wc-info>
        <script type="module" src="https://unpkg.com/wc-info@0.0.29/wc-info.js?module"></script>
    </div>
</template>
</custom-element-demo>
```
-->

# \<p-d\>, \<p-u\>


This package contains two primary custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together, regardless of how the elements got there.

Use cases:

1.  If you just need to connect some elements of a mostly static or server-rendered web site, these components provide a light weight way of doing that.
2.  These components allow you to keep code-centric **builds** at bay as much as possible.  Why is this important?  Because browsers can process HTML signicantly faster than JS.  That doesn't mean you have to edit HTML files.  Theoretically, you could edit in JavaScript and benefit from the tooling (type checks, etc), but compile to HTML for optimum performance. 

These components emphasize simplicity and small size -- to be used for 30,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.  Having said that, these components seem to perform adequately in [at least one scenario of a virtual list.](https://www.webcomponents.org/element/xtal-tree).  See the section "p-s" for more discussion about this. 

Both p-d and p-u have an attribute/property, "on" that specifies an event to monitor for.  They both attach an event listener for the specified event to the previous (non p-*) element.

When this event monitoring is enabled, if the previous element is disabled, the disabled attribute is removed (more on that later).

##  Downward flow amongst siblings with p-d. 

p-d  passes information from that previous sibling's event down the p-d instance's sibling list.  It stops event propagation (by default).  Sample markup is shown below: 

```html
<!--- verbose syntax -->
<div style="display:grid">
    <input/>                                                                    
    <p-d on="input" to="url-builder" prop="input" val="target.value" m="1"></p-d>
    <url-builder prepend="api/allEmployees?startsWith="></url-builder>    
    <p-d on="value-changed" to="fetch-data" prop="url" val="detail.value" m="1"></p-d>
    <fetch-data></fetch-data>                                                   
    <p-d on="fetch-complete" to="my-filter" prop="input" val="detail.value" m="2"></p-d>
    <my-filter select="isActive"></my-filter>                                   
    <p-d on="value-changed"  to="#activeList" prop="items" val="detail.value" m="1"></p-d>
    <my-filter select="!isActive"></my-filter>                                  
    <p-d on="value-changed"  to="#inactiveList" prop="items" val="target.value" m="1"></p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```

##  The anatomy of the p-d attributes / properties.

"m" is an optional attribute/property that indicates the maximum number of matching elements that are expected to be found.  If not specified, all the downstream siblings are checked, which can be wasteful.

"on" specifies the name of the event to listen for.

"to" is a css selector, similar to css selectors in a css file.  Only the way that selector is used is as a test on each of the next siblings after the p-d element.  The code uses the "matches" method to test each element for a match.

"prop" refers to the name of a property on the matching elements which need setting.  

"val" is a JavaScript path / expression for where to get the value used for setting.  The path is evaluated from the JavaScript event that gets fired.  For example "a.b.c" type expressions are allowed.  No ! or other JavaScript expressions is currently supported.  If the path is a single ., then it will pass the entire event object.  Limited expressions are allowed using notation:  a.b.c.fn(param1,param2).d.  fn is a name of a function, and the values inside the paranthesis are converted to strings.  E.g.

```html
<p-d on="value-changed" to="textContent" val="target.value.querySelector(FahrenheitToCelsiusResult).textContent"></p-d>
```

is equivalent to:

```JavaScript
nextElement.textContent = event.target.value.querySelector('FahrenheitToCelsiusResult').textContent
```

If any of the sub-expressions evaluate to null, then the target element(s) aren't modified.

All the components described in this document support an attribute (not a property), "debug".  If the attribute is present, the code will break everytime the event it is monitoring for fires.

##  But what if the way my elements should display isn't related to how data should flow?

Note that we are suggesting, in the markup above, the use of the CSS grid (display: grid).  The CSS grid allows you to specify where each element inside the CSS Grid container should be displayed.

It appears that the css flex/grid doesn't count elements with display:none as columns or rows.  So all the non visual components, which haven't seen the light on the benefit of setting display:none, could be marked with an attribute, nv (non visual) and apply a style for them, i.e.: 

```html
<style>
[nv]{
    display: none;
}
</style>
```

Since p-* are all non visual components, they are given display:none style by default.

Another benefit of making this explicit:  There is likely less overhead from components with display:none, as they may not get added to the [rendering tree](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#Render_tree_construction).



## Compact notation
One can't help noticing quite a bit of redundancy in the markup above.  We can reduce this redundancy if we apply some default settings.

1)  If no css specifier is defined, it will pass the properties to the next element.
2)  If no value is specified, it will see if detail.value exists.  If not it will try target.value.  

What we end up with is shown below:

```html
<!-- abreviated syntax -->
<style>
[nv]{
    display:none;
}
</style>
<div style="display:grid">
    <input/>                                                                    
    <p-d on="input" prop="input"></p-d>
    <url-builder prepend="api/allEmployees?startsWith=" nv></url-builder>   
    <p-d on="value-changed"  prop="url"></p-d>
    <fetch-data></fetch-data>                                                   
    <p-d on="fetch-complete" to="my-filter" prop="input" m="2"></p-d>
    <my-filter select="isActive" nv></my-filter>                                   
    <p-d on="value-changed"  to="#activeList" prop="items" m="1"></p-d>
    <my-filter select="!isActive" nv></my-filter>                                  
    <p-d on="value-changed"  to="#inactiveList" prop="items" m="1"></p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```

## Recursive sibling drilldown with p-d-r -- Invitation Only

To keep performance optimal and scalable, the p-d element only tests downstream siblings -- not children of siblings.  However, the use case for being able to drilldown inside a DOM node is quite high.  Unlike Polymer, permission to do this must be granted explicitly, using the p-d-if attribute on elements where drilldown is needed.  The value of the attribute is used to test against the p-d element (hence you will want to specify some marker, like an ID, on the p-d element, which can be used to validate the invitation.)

```html   
    <text-box></text-box>                                                               
    <p-d-r on="input" to="url-builder" prop="input"></p-d-r>
    <h3>Search Employees</h3>
    <div p-d-if="p-d-r">
        <url-builder></url-builder>
        <my-filter></my-filter>
    </div>
```

## Example 1:  Tree with Virtual Scroller

<!--
```
<custom-element-demo>
  <template>
    <div>
  
    <xtal-state-watch watch level="global"></xtal-state-watch>
    <p-d on="history-changed" to="xtal-tree" prop="firstVisibleIndex" val="target.history.firstVisibleIndex"></p-d>
    <h3>Basic xtal-tree demo</h3>
   
    <!--   Expand All / Collapse All / Sort  / Search Buttons -->
    
    <button disabled data-expand-cmd="allExpandedNodes">Expand All</button>
    <p-d on="click" to="xtal-tree" prop="expandCmd" val="target.dataset.expandCmd" m="1" skip-init></p-d>
    <button disabled data-expand-cmd="allCollapsedNodes">Collapse All</button>
    <p-d on="click" to="xtal-tree" prop="expandCmd" val="target.dataset.expandCmd" m="1" skip-init></p-d>
    <button disabled data-dir="asc">Sort Asc</button>
    <p-d on="click" to="xtal-tree" prop="sorted" val="target.dataset.dir" m="1" skip-init></p-d>
    <button disabled data-dir="desc">Sort Desc</button>
    <p-d on="click" to="xtal-tree" prop="sorted" val="target.dataset.dir" m="1" skip-init></p-d>
    <input disabled type="text" placeholder="Search">
    <p-d-r on="input" to="xtal-split" prop="search" val="target.value"></p-d-r>
    <p-d on="input" to="xtal-tree" prop="searchString" val="target.value"></p-d>

    <!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
    <xtal-fetch fetch href="https://unpkg.com/xtal-tree@0.0.34/demo/directory.json" as="json"></xtal-fetch>
    <!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
    <p-d on="fetch-complete" to="xtal-tree" prop="nodes" val="target.value" m="1"></p-d>

    <!-- ================= Train xtal-tree how to expand / collapse nodes ========================= -->
    <xtal-deco>
      <script nomodule>
        ({
          childrenFn: node => node.children,
          isOpenFn: node => node.expanded,
          levelSetterFn: function (nodes, level) {
            nodes.forEach(node => {
              node.style = 'margin-left:' + (level * 12) + 'px';
              if (node.children) this.levelSetterFn(node.children, level + 1)
            })
          },
          toggleNodeFn: node => {
            node.expanded = !node.expanded;
          },
          testNodeFn: (node, search) => {
            if (!search) return true;
            if (!node.nameLC) node.nameLC = node.name.toLowerCase();
            return node.nameLC.indexOf(search.toLowerCase()) > -1;
          },
          compareFn: (lhs, rhs) => {
            if (lhs.name < rhs.name) return -1;
            if (lhs.name > rhs.name) return 1;
            return 0;
          },
          props:{
              expandCmd: '',
              fistVisibleIndex: -1
            },
            onPropsChange(name, newVal){
              switch(name){
                case 'expandCmd':
                  this[this.expandCmd] = this.viewableNodes;
                  break;
                  
              }
            }
        })
      </script>
    </xtal-deco>
    <xtal-tree id="myTree"></xtal-tree>
    <p-d on="viewable-nodes-changed" to="iron-list" prop="items" val="target.viewableNodes" m="1"></p-d>
    <p-d on="viewable-nodes-changed" to="iron-list" prop="newFirstVisibleIndex" val="target.firstVisibleIndex" m="1"></p-d>
    <!-- ==============  Styling of iron-list ================== -->
    <style>
      div.node {
        cursor: pointer;
      }

      span.match {
        font-weight: bold;
        background-color: yellowgreen;
      }

      span[data-has-children="1"][data-is-expanded="1"]::after{
        content: "📖";
      }

      span[data-has-children="1"][data-is-expanded="-1"]::after{
        content: "📕";
      }

      span[data-has-children="-1"]::after{
        content: "📝";
      }
    </style>
    
    <xtal-deco><script nomodule>
      ({
        props: {
          newFirstVisibleIndex: -1,
        },
        onPropsChange: function (name, newVal) {
          switch (name) {
            case 'newFirstVisibleIndex':
              if(!this.items || this.newFirstVisibleIndex < 0) return;
              this.scrollToIndex(this.newFirstVisibleIndex);
          }
        }
      })
    </script></xtal-deco>
    <iron-list style="height:400px;overflow-x:hidden" id="nodeList" mutable-data p-d-if="p-d-r">
      <template>
        <div class="node" style$="[[item.style]]" p-d-if="p-d-r">
          <span node="[[item]]" p-d-if="p-d-r">
            <if-diff if="[[item.children]]" tag="hasChildren" m="1"></if-diff>
            <if-diff if="[[item.expanded]]" tag="isExpanded" m="1"></if-diff>
            <span data-has-children="-1" data-is-expanded="-1" node="[[item]]"></span>
          </span>
          <p-u on="click" to="myTree" prop="toggledNode" val="target.node" skip-init></p-u>
          <xtal-split node="[[item]]" search="[[search]]" text-content="[[item.name]]"></xtal-split>
          <p-u on="click" to="myTree" prop="toggledNode" val="target.node" skip-init></p-u>
          
        </div>
      </template>
    </iron-list>
    <p-d on="scroll" to="xtal-state-commit" prop="history" val="target.firstVisibleIndex"></p-d>
    <xtal-state-commit level="global" rewrite href="/scroll" with-path="firstVisibleIndex"></xtal-state-commit>
    <!-- Polyfill for retro browsers -->
    <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
    <!-- End Polyfill for retro browsers -->

    <!-- Polymer Elements -->
    <script type="module" src="https://unpkg.com/@polymer/iron-list@3.0.1/iron-list.js?module"></script>
    <!-- End Polymer Elements -->

    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-splitting@0.0.8/xtal-splitting.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.52/xtal-fetch.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.27/xtal-decorator.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-tree@0.0.38/xtal-tree.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-state@0.0.42/xtal-state.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/purr-sist@0.0.13/purr-sist.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/if-diff@0.0.11/if-diff.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.79/dist/p-all.iife.js"></script>
  </div>
  </template>
</custom-element-demo>
```
-->

## Example 2:  Calculator

I didn't know what to expect when I started on this example, based off this [code-pen](https://codepen.io/giana/pen/GJMBEv).  What I found was that using these components tended to cause the "controller" logic to become separate from the "view" logic.

<!--
```
<custom-element-demo style="height:750px">
  <template>
    <div>
        <xtal-deco><script nomodule>
        ({
            on: {
                click: function(e){
                    const ds = e.target.dataset;
                    if(ds.num){
                        if(this.expectNewNumber){
                            this.currentNum = ds.num;
                            this.expectNewNumber = false;
                        }else{
                            this.currentNum += ds.num;
                        }
                        

                    }else if(ds.ops){
                        this.lastOp = ds.ops;
                        this.lhsOperand = parseFloat(this.currentNum);
                        this.expectNewNumber = true;
                    }else{
                        switch(e.target.id){
                            case 'equals':
                                const oldNum = this.currentNum;
                                const rhsOperand = parseFloat(oldNum);
                                this.currentNum = '';
                                switch(this.lastOp){
                                    case 'plus':
                                        this.answerNum = this.lhsOperand + rhsOperand;
                                        break;
                                    case 'times':
                                        this.answerNum = this.lhsOperand * rhsOperand;
                                        break;
                                    case 'minus':
                                        this.answerNum = this.lhsOperand - rhsOperand;
                                        break;
                                    case 'divided by':
                                        this.answerNum = this.lhsOperand / rhsOperand;
                                }
                                this.lhsOperand = 0;
                                break;
                            case 'clear':
                                console.log('clear');
                                this.lhsOperand = 0;
                                this.answerNum = 0;
                                this.currentNum = '';
                                break;
                                
                        }
                    } 
                }
            },
            props:{
                lhsOperand: 0,
                expectNewNumber: false,
                currentNum: '',
                answerNum: 0,
                lastOp:'',
            }
        })
        </script></xtal-deco>
        <div class="html">
            <p-u on="currentNum-changed" to="viewer" prop="innerHTML" skip-init m="1"></p-u>
            <p-u on="answerNum-changed"  to="viewer" prop="innerHTML" skip-init m="1"></p-u>
            <div class="body">
                <h1>JavaScript Calculator</h1>
                <p class="warning">Don't divide by zero</p>
    
                <div id="calculator" class="calculator">
    
                    <button id="clear" class="clear">C</button>
                    <div id="viewer" class="viewer">0</div>
    
                    <button class="num" data-num="7">7</button>
                    <button class="num" data-num="8">8</button>
                    <button class="num" data-num="9">9</button>
                    <button data-ops="plus" class="ops">+</button>
    
                    <button class="num" data-num="4">4</button>
                    <button class="num" data-num="5">5</button>
                    <button class="num" data-num="6">6</button>
                    <button data-ops="minus" class="ops">-</button>
    
                    <button class="num" data-num="1">1</button>
                    <button class="num" data-num="2">2</button>
                    <button class="num" data-num="3">3</button>
                    <button data-ops="times" class="ops">*</button>
    
                    <button class="num" data-num="0">0</button>
                    <button class="num" data-num=".">.</button>
                    
                    <button id="equals" class="equals" data-result="">=</button>
                    <button data-ops="divided by" class="ops">/</button>
                </div>
    
                <button id="reset" class="reset">Reset Universe?</button>
            </div>
        </div>
        <style>
            :host {
                display: block;
            }
    
            div.html {
                background: #100a1c;
                background-image: radial-gradient(50% 30% ellipse at center top, #201e40 0%, rgba(0, 0, 0, 0) 100%), radial-gradient(60% 50% ellipse at center bottom, #261226 0%, #100a1c 100%);
                background-attachment: fixed;
                color: #6cacc5;
            }
    
            div.body {
                color: #6cacc5;
                font: 300 18px/1.6 "Source Sans Pro", sans-serif;
                margin: 0;
                padding: 5em 0 2em;
                text-align: center;
            }
    
            h1 {
                font-weight: 300;
                margin: 0;
            }
    
            /* Gradient text only on Webkit */
            .warning {
                background: -webkit-linear-gradient(45deg, #c97874 10%, #463042 90%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                color: #8c5059;
                font-weight: 400;
                margin: 0 auto 6em;
                max-width: 9em;
            }
    
            .calculator {
                font-size: 28px;
                margin: 0 auto;
                width: 10em;
            }
    
            .calculator::before,
            .calculator::after {
                content: " ";
                display: table;
            }
    
            .calculator::after {
                clear: both;
            }
    
            /* Calculator after dividing by zero */
            .broken {
                -webkit-animation: broken 2s;
                animation: broken 2s;
                -webkit-transform: translate3d(0, -2000px, 0);
                transform: translate3d(0, -2000px, 0);
                opacity: 0;
            }
    
            .viewer {
                color: #c97874;
                float: left;
                line-height: 3em;
                text-align: right;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 7.5em;
                height: 3em;
            }
    
            button {
                border: 0;
                background: rgba(42, 50, 113, 0.28);
                color: #6cacc5;
                cursor: pointer;
                float: left;
                font: inherit;
                margin: 0.25em;
                width: 2em;
                height: 2em;
                transition: all 0.5s;
            }
    
            button:hover {
                background: #201e40;
            }
    
            button:focus {
                outline: 0;
                /* The value fade-ins that appear */
            }
    
            button:focus::after {
                -webkit-animation: zoom 1s;
                animation: zoom 1s;
                -webkit-animation-iteration-count: 1;
                animation-iteration-count: 1;
                -webkit-animation-fill-mode: both;
                animation-fill-mode: both;
                content: attr(data-num);
                cursor: default;
                font-size: 100px;
                position: absolute;
                top: 1.5em;
                left: 50%;
                text-align: center;
                margin-left: -24px;
                opacity: 0;
                width: 48px;
            }
    
            /* Same as above, modified for operators */
            .ops:focus::after {
                content: attr(data-ops);
                margin-left: -210px;
                width: 420px;
            }
    
            /* Same as above, modified for result */
            .equals:focus::after {
                content: attr(data-result);
                margin-left: -300px;
                width: 600px;
            }
    
            /* Reset button */
            .reset {
                background: rgba(201, 120, 116, 0.28);
                color: #c97874;
                font-weight: 400;
                margin-left: -77px;
                padding: 0.5em 1em;
                position: absolute;
                top: -20em;
                left: 50%;
                width: auto;
                height: auto;
                /* When button is revealed */
            }
    
            .reset:hover {
                background: #c97874;
                color: #100a1c;
            }
    
            .reset.show {
                top: 20em;
                -webkit-animation: fadein 4s;
                animation: fadein 4s;
            }
    
            /* Animations */
            /* Values that appear onclick */
            @-webkit-keyframes zoom {
                0% {
                    -webkit-transform: scale(0.2);
                    transform: scale(0.2);
                    opacity: 1;
                }
    
                70% {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
    
                100% {
                    opacity: 0;
                }
            }
    
            @keyframes zoom {
                0% {
                    -webkit-transform: scale(0.2);
                    transform: scale(0.2);
                    opacity: 1;
                }
    
                70% {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }
    
                100% {
                    opacity: 0;
                }
            }
    
            /* Division by zero animation */
            @-webkit-keyframes broken {
                0% {
                    -webkit-transform: translate3d(0, 0, 0);
                    transform: translate3d(0, 0, 0);
                    opacity: 1;
                }
    
                5% {
                    -webkit-transform: rotate(5deg);
                    transform: rotate(5deg);
                }
    
                15% {
                    -webkit-transform: rotate(-5deg);
                    transform: rotate(-5deg);
                }
    
                20% {
                    -webkit-transform: rotate(5deg);
                    transform: rotate(5deg);
                }
    
                25% {
                    -webkit-transform: rotate(-5deg);
                    transform: rotate(-5deg);
                }
    
                50% {
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
    
                70% {
                    -webkit-transform: translate3d(0, 2000px, 0);
                    transform: translate3d(0, 2000px, 0);
                    opacity: 1;
                }
    
                75% {
                    opacity: 0;
                }
    
                100% {
                    -webkit-transform: translate3d(0, -2000px, 0);
                    transform: translate3d(0, -2000px, 0);
                }
            }
    
            @keyframes broken {
                0% {
                    -webkit-transform: translate3d(0, 0, 0);
                    transform: translate3d(0, 0, 0);
                    opacity: 1;
                }
    
                5% {
                    -webkit-transform: rotate(5deg);
                    transform: rotate(5deg);
                }
    
                15% {
                    -webkit-transform: rotate(-5deg);
                    transform: rotate(-5deg);
                }
    
                20% {
                    -webkit-transform: rotate(5deg);
                    transform: rotate(5deg);
                }
    
                25% {
                    -webkit-transform: rotate(-5deg);
                    transform: rotate(-5deg);
                }
    
                50% {
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
    
                70% {
                    -webkit-transform: translate3d(0, 2000px, 0);
                    transform: translate3d(0, 2000px, 0);
                    opacity: 1;
                }
    
                75% {
                    opacity: 0;
                }
    
                100% {
                    -webkit-transform: translate3d(0, -2000px, 0);
                    transform: translate3d(0, -2000px, 0);
                }
            }
    
            /* Reset button fadein */
            @-webkit-keyframes fadein {
                0% {
                    top: 20em;
                    opacity: 0;
                }
    
                50% {
                    opacity: 0;
                }
    
                100% {
                    opacity: 1;
                }
            }
    
            @keyframes fadein {
                0% {
                    top: 20em;
                    opacity: 0;
                }
    
                50% {
                    opacity: 0;
                }
    
                100% {
                    opacity: 1;
                }
            }
    
            @media (min-width: 420px) {
                .calculator {
                    width: 12em;
                }
    
                .viewer {
                    width: 8.5em;
                }
    
                button {
                    margin: 0.5em;
                }
            }
        </style>
        <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.31/dist/xtal-decorator.iife.js"></script>
        <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.88/dist/p-all.iife.js"></script>
    </div>
  </template>
</custom-element-demo>
```
-->


##  Defining a piping custom element

A convenience function is provided, that allows you to generate a "pipe" or "action" custom element with as few keystrokes as possible.

Here's what the syntax looks like in a JavaScript file:

```JavaScript
import {PDQ} from 'p-d.p-u/PDQ.js';
PDQ.define('my-pipeline-action', input => {
    // do stuff
    return myProcessedResult;
});
```

This will create a custom element with name "my-pipeline-action".  It applies the second argument, a function, to the "input" property of the custom element, every time the input changes.  It then stores the result in property "value", and emits an event with name "value-changed":

```html
<my-pipeline-action></my-pipeline-action>
<p-d on="value-changed" prop="input">
```

As with all custom element definitions, some care should be taken to ensure that the custom element names are unique.  This could be challenging if generating lots of small custom elements, like shown above, to be used in a large application, especially if that large application combines somewhat loosely coupled content from different teams, who also generate many custom elements.  Hopefully, the "Scoped Custom Element Registries" will help make this issue disappear in the future.

PDQ also supports multiple parameters:

```html
    <script type="module">
        import {PDQ} from '../PDQ.js';
        PDQ.define('a-b', ({alpha, beta, gamma}) =>{
            return alpha + beta + gamma;
        })
    </script>
    <a-b></a-b>
```

## Location, Location, Location

If the issue of mixing JavaScript script tags inside markup is *not* a serious concern for you, but you do want to reap the benefits from making the data flow unidirectionally, without having to jump away to see the code for one of these piping custom elements, you can "inline" the code quite close to where it is needed.  For now, this will only work if you essentially "hard code" the location of PDQ to a CDN with support for bare import specifiers:

```html
<p-d on="selected-root-nodes-changed" prop="input" val="target"></p-d>
<script type="module">
    import {PDQ} from 'https://unpkg.com/p-d.p-u@0.0.64/PDQ.js?module';
    PDQ.define('selected-node-change-handler', (input) =>{
        if((typeof(nodeList) === 'undefined') || !nodeList.items) return;
        const idx = nodeList.firstVisibleIndex;
        nodeList.items = nodeList.items.slice();
        nodeList.scrollToIndex(idx);
    })
</script>
<selected-node-change-handler></selected-node-change-handler>
```

With [package name map](https://github.com/domenic/package-name-maps) support, the import statement could look more like the previous example:

```JavaScript
import {PDQ} from 'p-d.p-u/PDQ.js';
```

Now if you add a breakpoint, it will take you to the code, where you can see the surrounding markup.  But you will only see the *markup*, not the actual live elements, unfortunately.  Just saying.

## Debugging Tips

Although the markup / code above is a little more verbose than standard ways of adding event handlers, it does have some benefits.  If you do view the live elements, you can sort of "walk through" the DOM elements and custom elements, and see how data is transformed from step to step.  This would be particularly easy if there were a nice browser extension that can quickly view web component properties, regardless of their flavor.  Unfortunately, [existing](https://chrome.google.com/webstore/detail/polyspector/naoehbibkfilaolkmfiehggkfjndlhpd?hl=en) [extensions](https://chrome.google.com/webstore/detail/stencil-inspector/komnnoelcbjpjfnbhmdpgmlbklmicmdi/related) don't seem to support that yet. 

But I am quite excited to see Firefox nightly making some [giant leaps forward](https://blog.nightly.mozilla.org/2018/09/06/developer-tools-support-for-web-components-in-firefox-63/) in supporting universal web component debugging.

In addition, you might find the following helpful.  What follows is Chrome-centric discussion, and requires support for dynamic import:

In the console, type:

import('https://unpkg.com/xtal-shell@0.0.7/$hell.js');

Then make you sure you select the Elements tab in the dev tools, in such a way that you can see both the elements and the console at the same time.

Then, as you inspect custom elements, you can type this in the console:

$hell.getProperties($0)

You should see an object, which you will want to expand.  This will list the values of Polymer properties, as well as observedAttributes, as well as Object.getOwnProperties.  It also displays the constructor, which you can right-click on, and go to definition to see the code for the web component.

Now as you select other elements in the elements tab, in the console, hit the up arrow and enter (so you don't have to keep typing "$hell.getProperties($0)" each time).  You will have to keep expanding the result.


## Conditional Processing

p-d can be configured to test the event target to make sure it matches a css test.  This is done with the "if" attribute / property:

```html
<div>
    <a href="link1">Link 1</a>
    <a href="link2">Link 2</a>
</div>
<p-d on="click" if="a"></p-d>
```

## Disabling the default behavior of initialization (Warning:  Wonky discussion)

One of the goals of these components is they can load asynchronously, and the output should, as much as possible, not depend on when these components load.

So what happens if an element fires an event, before p-d has loaded and started listening?  What if you want to monitor a property that starts out with some initial value?

To accommodate these difficulties, by defaut, a "fake" event is "emitted" just before the event connection is made.  I believe this default choice greatly improves the usefulness of these components.  However, there are situations where we definitely don't want to take action without actual user interaction (for example, with button clicks). To prevent that from happening, add attribute **skip-init**.

Another subtle feature you might find useful:  It was mentioned before that p-d removes the disabled attribute after latching on the event handler.  But what if you want to utilize multiple p-d's on the same element?  We don't want to remove the disabled attribute until all of the elements have latched on.  

You can specify the "depth" of disabling thusly:

```html
    <!-- Parse the address bar -->
    <xtal-state-parse disabled="2" parse="location.href" level="global" 
        with-url-pattern="id=(?<storeId>[a-z0-9-]*)">
    </xtal-state-parse>
    <!-- If no id found in address bar, create a new record ("session") -->
    <p-d on="no-match-found" to="purr-sist[write]" prop="new" val="target.noMatch"  m="1" skip-init></p-d>
    <!-- If id found in address bar, pass it to the persistence reader and writer -->
    <p-d on="match-found" to="purr-sist" prop="storeId" val="target.value.storeId" m="2" skip-init></p-d>
    <!-- Read stored history.state from remote database if saved -->
    <purr-sist read></purr-sist>
```

What if you want your element to remain disabled after all the p-d's have latched?  Just set the number one higher than the number of next sibling p-d's.


## Counter test

p-d, by itself, is not exactly turing-complete.  Even a simple "counter" is beyond its abilities.  A previous attempt to pile in enough hooks to do this proved clumsy.

A nice companion custom element that works well together with p-d is [xtal-decorator](https://www.webcomponents.org/element/xtal-decorator).

With these two combined the counter would look like:

```html
    <xtal-deco><script nomodule>
        ({
            on: {
                click:{
                    this.counter++;
                }
            },
            props:{
                counter: 0
            }
        })
    </script></xtal-deco>
    <button>Increment</button>
    <p-d on="counter-changed" prop="innerText"></p-d>
    <div></div>
```

##  Another impossible dream

p-destal (pronunced "pedestal") is another web component in shining armor.  Its quest is to allow some types of web components to serve dual roles -- they could work as stand alone web pages, but also as web components, embedded within other pages / apps.  Much like iFrames.  The type of scenario where this would be useful is *not* highly reusable generic web components, like those found on webcomponents.org, but rather business domain, markup-centric, dynamic (server-generated?) HTML content.  The definition of such a component would be in the form of an html file:  *.html, or *.cshtml, or *.jsp or *.pug, etc.

A key piece of the puzzle p-destal unlocks is how to pass information to these pages / web components that wear two hats?

Whereas p-d works at ground level -- monitoring for events from its elder sibling, and passing along information to its fellow downstream siblings -- p-destal climbs up the tree before starting its lookout.  The markup may look like this:

```html
<p-destal on="[period],[emp_id]" to="fetch-data{period:target.period,empID:target.emp_id}"></p-destal>
```

What p-destal does is:

1)  Traverses up the DOM tree, searching for a custom element container.  It identifies an element as a custom element if it either is a host of Shadow DOM, or has a dash in the element name. If it locates such a container, it monitors that element for attribute mutations (period and emp_id in this case), and passes the values to down stream siblings of the p-destal element.
2)  If no such custom element container is found, it monitors location.search (the query string in the address bar) for parameters with the same names (period, emp_id), and passes those values to downstream siblings as they change.

## Targeted, tightly-coupled passing with p-u ("partly-untested")   

I would suggest that for most applications, most of the time, data will naturally flow in one direction.  Those of us who read and write in a [downward direction](https://www.quora.com/Are-there-any-languages-that-read-from-bottom-to-top) will probably want to stick with that direction when arranging our elements.  But there will inevitably be points where the data flow must go up -- typically in response to a user action.  

That's what p-u provides.  As the name suggests, it should be used sparingly.  

p-u can pass data in any direction, but the primary intent is to pass it up the DOM tree to a precise single target.  What *was* the CSS selector, before the opening brace, now becomes a simple ID.  No # before the ID is required (in fact it will assume the ID starts with # if you do this).  If the selector starts with  a slash, it searches for an element with that ID from (root) document, outside any shadow DOM.  If it starts with ./, it searches within the shadow DOM it belongs to  ../ goes up one level. ../../ goes up two levels, etc.  Basically we are emulating the path syntax for imports.

Sample markup:

```html
 <p-u on="click" to="/myTree" prop="toggledNode" val="target.node"></p-u>
```

Unlike p-d, p-u doesn't worry about DOM nodes getting created after any passing of data takes place.  If you are using p-u to pass data to previous siblings, or parents of the p-u element,or previous siblings of the parent, etc, then it is quite likely that the DOM element will already have been created, as a natural result of how the browser, and frameworks, typically render DOM.  If, however, you choose to target DOM elements out of this range, it's more of a crapshoot, and do so at your own risk.

Despite its bad code smell, if you look at Example 2 carefully, you will see I couldn't resist using p-u:  It is in fact passing down to some static HTML tag with an id which will surely be present as the HTML is static.  And p-u is on the small side, as you would expect for such simple functionality. 

Another objection to this approach is that there needs to be coordination between  these potentially disparate areas of the DOM, as far as what the agreed ID should be.  This is obviously not a good approach if you are designing a generic component.  Do you really want to tell the person using your component that they need to plop a DOM element with a specific ID, in order to receive the data?  I didn't think you would.  So p-u should probably not be used for this use case (a way of passing information from a generic, reusable component).

For that we have:

## Punting [Untested]

```html
<p-unt on="click" dispatch to="myEventName" prop="toggledNode" val="target.node" composed bubbles></p-unt>
```

Another way you can make data "cycle" is by placing a p-* element at the beginning -- if no previous non p-* elements are found, the event handler is attached to the parent.

## Deluxe version [partially untested]

Another custom element, p-d-x, extends p-d and adds these additional features;

1)  You can specify adding / removing a css class (untested).
2)  You can specify a nested path that needs setting (tested).
3)  You can  specify multiple properties that need setting on the same element, more compactly (tested).
4)  You can observe attribute changes, in lieu of listening for an event (tested).
5)  You can copy all properties of the source to the target if you specify to="{.:.}" (partly tested).


There is a special string used to refer to an element of [composedPath()](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath):

```html
<p-u on="click" if="span" to="/myTree{toggledNode:composedPath_0.node}"></p-u>
```

This pulls the node from event.composedPath()[0].node.

##  Differences to other frameworks

While these components provide a kind of "framework built with web components", similar to Polymer, there's a fundamental difference.  Unlike Polymer (and other competing frameworks), these components don't depend on the existence of a controlling component which manages state.  Instead, it is a little more JQuery like.  It is a "peer-to-peer binding framework."  This may be more appealing for some people / use cases, less appealing to others.  

And if you want to add some state management while sticking to codeless, declarative approaches, consider using [xtal-state](https://www.webcomponents.org/element/xtal-state).  You can place a history.state watcher at the top of a DOM element, for example:

```html
<div>
    <xtal-state-watch watch level="local"></xtal-state-watch>
    <p-d on="history-changed" to="#handleViewableNodesChanged" prop="firstVisibleIndex" val="target.history" m="1"></p-d>
    ...
</div>
```

Note the use of the attribute "level='local'".  This limits the scope of the state to the local div DOM element.  Then if you need to update this local state, add another tag:

```html
<div>
    ...
    <iron-list>
        ...
    </iron-list>
    <p-d on="scroll" to="{history:target.firstVisibleIndex}"></p-d>
    <xtal-state-commit level="local" rewrite href="/scroll"></xtal-state-commit>
...
</div>
```



## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ npm tests
```

## p-s

I mentioned at the beginning that there could be performance issues if using these components inside a virtual list, for example.  Although performance issues have not yet been observed, the concern is based on observations made by the [ag-grid](https://www.ag-grid.com/ag-grid-performance-hacks/) team:

>The grid needs to have mouse and keyboard listeners on all the cells so that the grid can fire events such as 'cellClicked' and so that the grid can perform grid operations such as selection, range selection, keyboard navigation etc. In all there are 8 events that the grid requires at the cell level which are click, dblclick, mousedown, contextmenu, mouseover, mouseout, mouseenter and mouseleave.

>Adding event listeners to the DOM results in a small performance hit. A grid would naturally add thousands of such listeners as even 20 visible columns and 50 visible rows means 20 (columns) x 50 (rows) x 8 (events) = 8,000 event listeners. As the user scrolls our row and column virtualisation kicks in and these listeners are getting constantly added and removed which adds a lag to scrolling.

...

>So instead of adding listeners to each cell, we add each listener once to the container that contains the cells. That way the listeners are added once when the grid initialises and not to each individual cell.

We can already do that somewhat with p-d -- wrap multiple elements inside a div tag, and then add p-d after the div tag.  The problem is that will only pass data to DOM elements under the p-d tag.  We can't pass data down to elements below the element that actually triggered the event.

For that we have p-s, which stands for "pass sideways".  It relies a little on the honor code.  Depending on where it is placed, it could result in data flow not being downward.  In the example below, it is placed in a safe place:

```html
<div>
    <button>a</button>
    <button>b</button>
    <button>c</button>
    <p-s on="click" if="button" prop="innerText" val="target.innerText" skip-init></p-s>
    <div></div>
</div>
```










