[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/p-d.p-u)

<a href="https://nodei.co/npm/p-d.p-u/"><img src="https://nodei.co/npm/p-d.p-u.png"></a>


# \<p-d\>, \<p-u\>

This package contains two primary custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

Actually, Polymer proved that the dream isn't that far fetched.  These components are inspired by Polymer's helper elements.  It should be noted that Polymer's binding support places great emphasis on performance -- so they can be used inside a rapidly scrolling virtual list, for example.  

These components, instead, emphasize simplicity and small size -- to be used for 30,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.  Having said that, these components seem to perform adequately in [at least one scenario of a virtual list.](https://www.webcomponents.org/element/xtal-tree) 

Here I am defining a "framework" as a "common, centrally managed language used to glue components together."  What distinguishes polymer's helper elements from a framework is that they are themselves components.  The "language" can thus easily evolve, like natural languages.  Who still uses the word lasslorn? 

It's kind of like metaprogramming [in nemerle](https://github.com/rsdn/nemerle/wiki/Macros-tutorial) or [sweet.js](https://www.sweetjs.org/), only a hell of a lot easier.

NB:  Lit-html (also by the Polymer team) appears to meet the requirements for avoiding the "centrally managed language" label.  Like sweet.js above, one can define one's preferred syntax fairly easily (scroll to the bottom of this [link](https://github.com/Polymer/lit-html/issues/399) to see how, as has been done [here](https://github.com/bgotink/lit-html-brackets) ).  In addition, the ability to define [directives](https://polymer.github.io/lit-html/guide/writing-templates.html#directives) also weakens the claim that the syntax is centrally managed, perhaps.  hyperHTML has [something that may be equivalent](https://viperhtml.js.org/hyperhtml/documentation/#api-3). 

Both p-d and p-u have an attribute/property, "on" that specifies an event to monitor for.  They both attach an event listener for the specified event to the previous (non p-*) element.

When this event monitoring is enabled, if the previous element is disabled, the disabled attribute is removed.

##  Downward flow amongst siblings with p-d. 

p-d  passes information from that previous sibling's event down the p-d instance's sibling list.  It stops event propagation (by default).  Sample markup is shown below: 

```html
<!--- verbose syntax -->
<div style="display:grid">
    <input/>                                                                    
    <p-d on="input" to="url-builder{input:target.value}" m="1"></p-d>
    <url-builder prepend="api/allEmployees?startsWith="></url-builder>    
    <p-d on="value-changed"  to="fetch-data{url:detail.value}" m="1"></p-d>
    <fetch-data></fetch-data>                                                   
    <p-d on="fetch-complete" to="my-filter{input:detail.value}" m="2"></p-d>
    <my-filter select="isActive"></my-filter>                                   
    <p-d on="value-changed"  to="#activeList{items:detail.value}" m="1"></p-d>
    <my-filter select="!isActive"></my-filter>                                  
    <p-d on="value-changed"  to="#inactiveList{items:target.value}" m="1"></p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```

##  The anatomy of the p-d attributes / properties.

"m" is an optional attribute/property that indicates the maximum number of matching elements that are expected to be found.  If not specified, all the downstream siblings are checked, which can be wasteful.

"on" specifies the name of the event to listen for.

The most interesting attribute/property is the "to" attribute.  The stuff that comes before the opening brace is the css selector, similar to css selectors in a css file.  Only the way that selector is used is as a test on each of the next siblings after the p-d element.  The code uses the "matches" method to test each element for a match.

The stuff inside the braces is a name value pair:  To the left of the colon is the name of the property that should be set on matching elements.  To the right is a JavaScript path / expression for where to get the value used for setting.  The path is evaluated from the JavaScript event that gets fired.  Only very simple "a.b.c" type expressions are allowed.  No ! or other JavaScript expressions is currently supported.  If the path is a single ., then it will pass the entire event object.

All the components described in this document support an attribute (not a property), "debug".  If the attribute is present, the code will break everytime the event it is monitoring for fires.

##  But what if the way my elements should display isn't related to how data should flow?

Note that we are suggesting, in the markup above, the use of the CSS grid (display: grid).  The CSS grid allows you to specify where each element inside the CSS Grid container should be displayed.

It appears that the css flex/grid doesn't count elements with display:none as columns or rows.  So all the non visual components could use an attribute, nv (non visual) and apply a style for them, i.e.: 

```html
<style>
[nv]{
    display: none;
}
</style>
```

## Compact notation
One can't help noticing quite a bit of redundancy in the markup above.  We can reduce this redundancy if we apply some default settings.

1)  If no css specifier is defined, it will pass the properties to the next element.
2)  If no value is specified, it will see if detail.value exists.  If not it will try target.value.  

What we end up with is shown below:

```html
<!-- abreviated syntax -->
<style>
[nv], p-d{
    display:none;
}
</style>
<div style="display:grid">
    <input/>                                                                    
    <p-d on="input" to="{input}"></p-d>
    <url-builder prepend="api/allEmployees?startsWith=" nv></url-builder>   
    <p-d on="value-changed"  to="{url}"></p-d>
    <fetch-data></fetch-data>                                                   
    <p-d on="fetch-complete" to="my-filter{input}" m="2"></p-d>
    <my-filter select="isActive" nv></my-filter>                                   
    <p-d on="value-changed"  to="#activeList{items}" m="1"></p-d>
    <my-filter select="!isActive" nv></my-filter>                                  
    <p-d on="value-changed"  to="#inactiveList{items}" m="1"></p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```


## Recursive sibling drilldown -- Invitation Only

To keep performance optimal and scalable, the p-d element only tests downstream siblings -- not children of siblings.  However, the use case for being able to drilldown inside a DOM node is quite high.  Unlike Polymer, permission to do this must be granted explicitly, using the p-d-if attribute on elements where drilldown is needed.  The value of the attribute is used to test against the p-d element (hence you will want to specify some marker, like an ID, on the p-d element, which can be used to validate the invitation.)

```html   
    <text-box></text-box>                                                               
    <p-d id="myPassDownTag" on="input" to="prepend-string{input}"></p-d>
    <h3>Search Employees</h3>
    <div p-d-if="#myPassDownTag">
        <url-builder></url-builder>
        <my-filter></my-filter>
    </div>
```

## Inline Script Props

It is common to want to set function and object properties on a custom element.  This can be done as shown below:

```html
<script nomodule>
({
    fn: (obj, idx) => `<div>Row with index ${idx}</div>`
})
</script>
<p-d on="eval" to="{rowGenerator:fn}">
<my-virtual-list></my-virtual-list>
```

Note the "nomodule" attribute.  This code won't execute in modern browsers without p-d element making it execute via eval.

It will execute in older browsers, but likely with no harm done / side effects (other than a small performance loss).

Also note that if you are targeting older browsers, you will need to use syntax more like this:

```html
<script nomodule>
({
    function(obj, idx){
        return '<div>Row with index ' + idx + '</div>';
    } 
})
</script>
```

unless you add a build step that does the conversion for you.

## Inline Script Pipeline Processing

In the previous section, we described how you can define an object within script tags, and that object can be passed down to lower siblings.

If instead of defining an object, one defines a function:

```html
<script nomodule>
    pd => {
        return pd.input;
    }
</script>
<p-d on="eval" to="{input}">
```

then that function will be invoked every time anything passes property "input" to the p-d element below the script tag.  If the function returns an object, pieces of that object can be passed down just as before.

If the expression inside the script tag evaluates to a function, it is evaluated against the p-d instance before assigning the properties to the target element.

### A cautionary note on use of inline script pipeline processing

The intention of these web components is that one can understand the UI like reading a novel - from beginning to end.  This should be possible while reading / writing the code, but also while debugging in the dev tools of your favorite browser.

It would be amazing if one could debug the code found in these inline script pipelines, right in the context of the other UI elements.  The productivity benefit would be significant.  The only way I know how this could be done would be to define a function, by name, inside the script tag, and for these elements to call the function by name.  Then browsers generally would jump to the code inside the script tag, so you could at least see the surrounding elements (and even better, be able to examine the property values, attributes, etc.) 

The problem is this would pollute the global namespace with functions, and one developer's function overwriting another could trigger major team dysfunction. 

In the lack of this support, one finds oneself staring at some code fragment floating in space when one adds a debug statement.  And there's no way to add a break point without editing the script.  And what if you want to unit test the code?  And as the JavaScript grows, the ability to get a good grasp of the UI would diminish. 

For simple, trivial code, or preliminary prototyping, this might not be an issue.  But as the code grows in complexity and maturity, we basically need to start adding "hyperlinks" in the markup, if you follow my drift.  

###  Defining a piping custom element

A convenience function is provided, that allows you to generate a "pipe" custom element with as few keystrokes as possible.

You can use traditional JavaScript import:

```JavaScript
import {PDQ} from 'p-d.p-u/PDQ.js';
PDQ.define('my-pipeline-fn', pd => {
    // do stuff
    return pd.input;
});
```

This will create a custom element with name my-pipeline-fn.  It applies the second argument, a function to the input property of the custom element, every tie the input changes.  It then stores the result in property value, and emits and event with name value-changed.

Then you can replace the pipeline processing script tag above with:

```html
<my-pipeline-fn></my-pipeline-fn>
<p-d on="value-changed" to="{input}">
```

Of course, teams would need to give a naming convention to these pipeline custom elements so as to avoid conflicts, just as we would have to do with the global function issue mentioned above.  Hopefully, the "Scoped Custom Element Registries" will help make this issue disappear in the future.

If the issue of mixing JavaScript script tags inside markup is not a serious concern for you, but you do want to reap the benefits from making the data flow unidirectionally, like a novel, you can still inline the code.  It would look like this:

```html
<p-d on="selected-root-nodes-changed" to="{input:target}" m="1"></p-d>
<script type="module">
    import {PDQ} from 'https://unpkg.com/p-d.p-u@0.0.50/PDQ.js?module';
    PDX.define('selected-node-change-handler', (input) =>{
        if((typeof(nodeList) === 'undefined') || !nodeList.items) return;
        const idx = nodeList.firstVisibleIndex;
        nodeList.items = nodeList.items.slice();
        nodeList.scrollToIndex(idx);
    })
</script>
<selected-node-change-handler></selected-node-change-handler>
```

Now if you add a breakpoint, it will take you to the code, where you can see the surrounding markup.  But you will only see the *markup*, not the actual live elements, unfortunately.  Just saying.

## Debugging Tips

Although the markup / code above is a little more verbose than standard ways of adding event handlers, it does have some beneifits.  If you do view the live elements, you can sort of "walk through" the DOM elements and custom elements, and see how data is transformed from step to step.  This would be particularly easy if there were a nice browser extension that can quickly view web component properties, regardless of their flavor.  Unfortunately, [existing](https://chrome.google.com/webstore/detail/polyspector/naoehbibkfilaolkmfiehggkfjndlhpd?hl=en) [extensions](https://chrome.google.com/webstore/detail/stencil-inspector/komnnoelcbjpjfnbhmdpgmlbklmicmdi/related) don't seem to support that yet. 

However, you might find the following helpful.  What follows is Chrome-centric discussion, but other browsers should work as well:

In the console, type:

import('https://unpkg.com/xtal-shell@0.0.6/$hell.js');

Then make you sure you select the Elements tab in the dev tools, in such a way that you can see both the elements and the console at the same time.

Then, as you inspect custom elements, you can type this in the console:

$hell.getProperties($0)

You should see an object, which you will want to expand.  This will list the values of Polymer properties, as well as observedAttributes, as well as Object.getOwnProperties.  It also displays the constructor, which you can right-click on, and go to definition to see the code for the web component.

Now as you select other elements in the elements tab, in the console, hit the up arrow and enter.

## Adding a simple JavaScript event handler

Suppose we want to attach a simple JavaScript event handler to a DOM Element.   Using p-d, it is possible to do this (if a bit strange looking):

```html
<button>Click Me</button>
<p-d on="click" to="{input:target}"></p-d>
<script nomodule>
    pd =>{
        console.log('the button that was clicked was:');
        console.log(pd.input);
    }
</script>
<p-d on="eval" to="{NA}"></p-d>
```

## Conditional Processing

p-d can be configured to test the event target to make sure it matches a css test.  This is done with the "if" attribute / property:

```html
<div>
    <a href="link1">Link 1</a>
    <a href="link2">Link 2</a>
</div>
<p-d on="click" if="a"></pd>
```

## Disabling the default behavior of initialization (Warning:  Wonky discussion)

One of the goals of these components is they can load asynchronously, and the output should, as much as possible, not depend on when these components load.

So what happens if an element fires an event, before p-d has loaded and started listening?  What if you want to monitor a property that starts out with some initial value?

To accommodate these difficulties, by defaut, a "fake" event is "emitted" just before the event connection is made.  I believe this default choice greatly improves the usefulness of these components.  However, there are situations where we definitely don't want to take action without actual user interaction (for example, with button clicks). To prevent that from happening, add a condition as described above.


p-d is ~2.4KB minified and gzipped.

## Counter test

Apparently, counter tests are a thing people use to compare "frameworks."  Here's what p-d's looks like:

```html
    <button>Increment</button>
    <p-d on="click" if="button" to="{input:NA}"></p-d>
    <script nomodule>
        counterState => {
            counterState.value = (counterState.value || 0);
            counterState.value++;
            return counterState;
        } 
    </script>
    <p-d on="eval" skip-init to="{innerText:value}"></p-d>
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
 <p-u on="click" to="/myTree{toggledNode:target.node}"></p-u>
```

Unlike p-d, p-u doesn't worry about DOM nodes getting created after any passing of data takes place.  If you are using p-u to pass data to previous siblings, or parents of the p-u element,or previous siblings of the parent, etc, then it is quite likely that the DOM element will already have been created, as a natural result of how the browser, and frameworks, typically render DOM.  If, however, you choose to target DOM elements out of this range, it's more of a crapshoot, and do so at your own risk.

Another objection to this approach is that there needs to be coordination between  these potentially disparate areas of the DOM, as far as what the agreed ID should be.  This is obviously not a good approach if you are designing a generic component.  Do you really want to tell the person using your component that they need to plop a DOM element with a specific ID, in order to receive the data?  I didn't think you would.  So p-u should probably not be used for this use case (a way of passing information from a generic, reusable component).

For that we have:

## Punting [Untested]

```html
<p-unt on="click" dispatch to="myEventName{toggledNode:target.node}" composed bubbles></p-unt>
```

The two components, p-d and p-u, are combined into one IIFE.js file, p-d.p-u.js which totals ~2.6KB minified and gzipped.

## Deluxe version [partially untested]

Another custom element, p-d-x, extends p-d and adds these additional features;

1)  You can specify adding / removing a css class (untested).
2)  You can specify a nested path that needs setting (tested).
3)  You can  specify multiple properties that need setting on the same element, more compactly (tested).
4)  You can observe attribute changes, in lieu of listening for an event (tested).
5)  You can copy all properties of the source to the target if you specify to="{.:.}" (tested).
6)  Autogenerate custom element that can do pipeline processing.

p-d, p-u and p-d-x, when combined into a single file, totals ~3.2KB minified and gzipped.

When p-destal is added, the total is ~3.5 kb minified and gzipped.

##  Differences to other "frameworks"

While these components provide a kind of "framework built with web components", similar to Polymer, there's a fundamental difference.  Unlike Polymer (and other competing frameworks), these components don't depend on the existence of a controlling component which manages state.  Instead, it is a little more JQuery like.  This may be more appealing for some people / use cases, less appealing to others.   But these components should be compatible with such frameworks, and may be useful for filling in some cracks with less boilerplate code.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## p-s

I mentioned at the beginning that there could be performance issues if using these components inside a virtual list, for example.  Although performance issues have not yet been observed, the concern is based on observations made by the [ag-grid](https://www.ag-grid.com/ag-grid-performance-hacks/) team:

>The grid needs to have mouse and keyboard listeners on all the cells so that the grid can fire events such as 'cellClicked' and so that the grid can perform grid operations such as selection, range selection, keyboard navigation etc. In all there are 8 events that the grid requires at the cell level which are click, dblclick, mousedown, contextmenu, mouseover, mouseout, mouseenter and mouseleave.

>Adding event listeners to the DOM results in a small performance hit. A grid would naturally add thousands of such listeners as even 20 visible columns and 50 visible rows means 20 (columns) x 50 (rows) x 8 (events) = 8,000 event listeners. As the user scrolls our row and column virtualisation kicks in and these listeners are getting constantly added and removed which adds a lag to scrolling.

...

>So instead of adding listeners to each cell, we add each listener once to the container that contains the cells. That way the listeners are added once when the grid initialises and not to each individual cell.

We can already do that somewhat with p-d -- wrap multiple elements inside a div tag, and then add p-d after the div tag.  The problem is that will only pass data to DOM elements under the p-d tag.  We can't pass data down to elements below the element that actually triggered the event.

For that we have p-s, which stands for "pass sideways".  It differs from p-d only in that the search for matches begins from the triggering element.  Also, it can actually pass things to itself.

For similar reasons, there is a special string used to refer to an element of [composedPath()](https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath):

```html
<p-u on="click" if="span" to="/myTree{toggledNode:composedPath_0.node}"></p-u>
```

This pulls the node from event.composedPath()[0].node.

