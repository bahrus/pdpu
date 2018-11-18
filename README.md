[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/p-d.p-u)

<a href="https://nodei.co/npm/p-d.p-u/"><img src="https://nodei.co/npm/p-d.p-u.png"></a>

<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.76/dist/p-d.iife.min.js?compression=gzip">

# \<p-d\>, \<p-u\>

NB I:  The lack of HTML Import support has landed a big, temporary(?) blow to HTML/CSS centric component definitions.  If you are a (P)React developer who sees no reason to mourn that fact, but do want to build high performing components that can be used by the [entire web developer community](https://w3techs.com/technologies/overview/javascript_library/all), and yet do so with a tiny footprint, read no further.  There are excellent alternatives for you - LitElement, Stencil, HyperHTMLElement just to name a few.  p-d, p-u have nothing to offer you.  Away with you! 😥. 

NB II:  If all you want (on top of great performance and great other features) is clean, declarative HTML syntax for building components or web compositions, take a look at these [slightly](https://vuejs.org/) [better known](https://svelte.technology/) technologies.  The components described here are part of a thought experiment to see if a subset of what those frameworks do could be done with no compilation steps, no limitations on the server, no installation steps even (at least during development).  

In fact, the components described here would make more sense to be used in the opposite way -- as part of a compile target from JavaScript to HTML.  If that idea strikes you as being as ridiculous as the Sun orbiting the Earth, congratulations!  You are a normal developer with great career prospects!  I'm afraid p-d and p-u will also have to part ways with you as well 😥.  

This package contains two primary custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

Actually, Polymer proved that the dream isn't that far fetched.  These components are inspired by Polymer's helper elements.  It should be noted that Polymer's binding support places great emphasis on performance -- so they can be used inside a rapidly scrolling virtual list, for example.  

These components, instead, emphasize simplicity and small size -- to be used for 30,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.  Having said that, these components seem to perform adequately in [at least one scenario of a virtual list.](https://www.webcomponents.org/element/xtal-tree).  

Here I am defining a "framework" as a "common, centrally managed language used to glue components together."  What distinguishes polymer's helper elements from a framework is that they are themselves components.  The "language" can thus easily evolve, like natural languages.  Who still uses the word lasslorn? 

It's kind of like metaprogramming [in nemerle](https://github.com/rsdn/nemerle/wiki/Macros-tutorial) or [sweet.js](https://www.sweetjs.org/), only a hell of a lot easier.

NB III:  Lit-html (also by the Polymer team) appears to meet the requirements for avoiding the "centrally managed language" label.  Like sweet.js above, one can define one's preferred syntax fairly easily (scroll to the bottom of this [link](https://github.com/Polymer/lit-html/issues/399) to see how, as has been done [here](https://github.com/bgotink/lit-html-brackets) ).  In addition, the ability to define [directives](https://polymer.github.io/lit-html/guide/writing-templates.html#directives) also weakens the claim that the syntax is centrally managed, perhaps.  hyperHTML has [something that may be equivalent](https://viperhtml.js.org/hyperhtml/documentation/#api-3). 


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

The most interesting attribute/property is the "to" attribute.  The stuff that comes before the opening brace is the css selector, similar to css selectors in a css file.  Only the way that selector is used is as a test on each of the next siblings after the p-d element.  The code uses the "matches" method to test each element for a match.

The stuff inside the braces is a name value pair:  To the left of the colon is the name of the property that should be set on matching elements.  To the right is a JavaScript path / expression for where to get the value used for setting.  The path is evaluated from the JavaScript event that gets fired.  Only very simple "a.b.c" type expressions are allowed.  No ! or other JavaScript expressions is currently supported.  If the path is a single ., then it will pass the entire event object.

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

If you prefer attributes over separate elements to pass data from one element to another, take a look at the [pass-down](https://www.webcomponents.org/element/pass-down) component.  I'm a bit on the fence which I prefer.  I think the strongest case for using separate elements, like p-d, is that you can cleanly document what each passing event does with  a line of html commentary.


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

##  Is this really one-way data flow?

NB IV.  These components don't make claim to be guaranteeing a pure functional flow of data, only a conceptual outline of one, which could serve that purpose if required.  The goal of these components is to make the markup logical, to help organize how things *should* flow.  

A functional programming absolutist could fairly raise the following objection:  Sure, you are passing objects in one direction, but what is to prevent a downstream component from updating a sub property, making the data flow direction more ambiguous?  I kind of think the risks of this situation being problematic are low, as long as upstream components don't add internal watchers on sub properties via ES6 proxies, and downstream elements update those properties using the same proxy. 

Anyway, these "connector" components are, I think, compatible with a pure functional model, *if the web components themselves adhere to the necessary discipline to make it so*.  For example, if when components raise events, they only put into the event detail a deep clone of some internal (sub)object, and if downstream components only bind to the event detail, and/or if components receiving said events treat the event as an immutable thing requiring careful cloning before updating, this would, I think, satisfy the functional purist.

Is this a goal worth pursuing? Each person is, to some degree, a product of their experience, and, based on my experience, this isn't a pressing concern, partly based on my speculation two paragraphs above. but if it is for you, I **think** these connector components are compatible with that.

## Recursive sibling drilldown -- Invitation Only

To keep performance optimal and scalable, the p-d element only tests downstream siblings -- not children of siblings.  However, the use case for being able to drilldown inside a DOM node is quite high.  Unlike Polymer, permission to do this must be granted explicitly, using the p-d-if attribute on elements where drilldown is needed.  The value of the attribute is used to test against the p-d element (hence you will want to specify some marker, like an ID, on the p-d element, which can be used to validate the invitation.)

```html   
    <text-box></text-box>                                                               
    <p-d id="myPassDownTag" on="input" to="url-builder" prop="input"></p-d>
    <h3>Search Employees</h3>
    <div p-d-if="#myPassDownTag">
        <url-builder></url-builder>
        <my-filter></my-filter>
    </div>
```

###  Defining a piping custom element

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

[TODO] Support multiple parameters like [aggregator-fn](https://www.webcomponents.org/element/aggregator-fn).

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

Another subtle feature you might find useful:  It was mentioned before that p-d removes the disabled attribute after latching on the event handler.  But what if you want to utilize multiple p-d's on the same element.  We don't want to remove the disabled attribute until all of the elements have latched on.  

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
    <xtal-deco>
        <script nomodule>
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
        </script>
    </xtal-deco>
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
 <p-u on="click" to="/myTree{toggledNode:target.node}"></p-u>
```

Unlike p-d, p-u doesn't worry about DOM nodes getting created after any passing of data takes place.  If you are using p-u to pass data to previous siblings, or parents of the p-u element,or previous siblings of the parent, etc, then it is quite likely that the DOM element will already have been created, as a natural result of how the browser, and frameworks, typically render DOM.  If, however, you choose to target DOM elements out of this range, it's more of a crapshoot, and do so at your own risk.

Another objection to this approach is that there needs to be coordination between  these potentially disparate areas of the DOM, as far as what the agreed ID should be.  This is obviously not a good approach if you are designing a generic component.  Do you really want to tell the person using your component that they need to plop a DOM element with a specific ID, in order to receive the data?  I didn't think you would.  So p-u should probably not be used for this use case (a way of passing information from a generic, reusable component).

For that we have:

## Punting [Untested]

```html
<p-unt on="click" dispatch to="myEventName{toggledNode:target.node}" composed bubbles></p-unt>
```


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
    <p-d on="history-changed" to="#handleViewableNodesChanged{firstVisibleIndex:target.history}" m="1"></p-d>
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

\<grain-of-salt level="Infinity"\>
## Theoretcal musings to help soothe you into a coma

An interesting, untested question is which frameworks or renderers would these components be compatible with?  Previously, I optimistically and sloppily stated nothing to see here, it would work, and could help reduce boilerplate code.  But on further reflection, it is not nearly so obvious.  What follows is mostly arm-chair speculation, subject to change with more research.

In what scenarios would there be too many cooks in the kitchen? Let's put aside the question of "should" and consider only "could" first.

The easiest scenario is complementing a mostly static website  or server-side framework.  That's been the primary "vantage point" motivating these components.

Next in ease (and focus) would be complementing other "helper" elements, like virtualized lists or lit-html or HyperHTML rendered regions.  Do these renderers need to really care what siblings are telling each other?  I think usually not.  In fact this scenario has been the focus of trying out this component (especially in combination with iron-list.)

The least likely candidates are those frameworks that like to blow everything away on re-rendering.  In that case, I could only see it working if the framework passes some properties to the eldest sibling, and leaves it at that.  Perhaps the use cases could be a little wider than that, but that's probably wishful thinking.

Now to the "should" question...

Among the premises behind this component is that the Chrome team is onto something when they preach "less JavaScript."  My gut reaction to that is "Problem solved:  Do as much as possible on the server, and then let's encapsulate what boilerplate JavaScript is doing repeatedly into easily digestible HTML data -- tags + attributes."  Yes, use web components to do common JS tasks.

Tied to this sentiment is my observation that with all the emphasis placed on the size of the framework, if once the framework is there,  your application is **built** primarily in HTML / CSS, isn't that "doing less JavaScript"?  The argument weakens significantly when this easy to digest HTML is actually encoded in JavaScript, which ultimately is what pretty much every framework does these days.  But according to the Chrome team, HTML inside JavaScript strings is quite a bit cheaper than free-form JavaScript (3 times as I recall), which seems quite plausible. 

The question becomes how much information can be stored as attribute / tag data?
 
A different approach that makes sense to me, based on this line of reasoning -- generating UI's based on JSON data.  

An intriguing third option -- so long as HTML can't be imported, so everything must be in JavaScript, why not use directives instead of web components to encapsulate boilder-plate logic that could be more data-driven.  This has the most merit if you aren't constantly context switching between literal tags and difficult to digest JavaScript expressions.  But that isn't always the case.  A nickle here, a dime there, soon you are talking 65 cents!

### Imagine

Imagine a world where HTML Imports existed.  [It's not that hard to do.](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/html-module-spec-changes.md)

Imagine that the performance gap that we see today between HTML and JS also exists with HTML Imports vs JS Imports.  

Or imagine you are building a server-centric application (not necessarily node-based) or enhancing a static website with a little pixie-dust JavaScript.  Do such things exist?  I think they do.

The science is as strong for the benefits of vaccinations as it is for the performance benefits of data-centric formats like HTML over JS.  The Google Chrome team states this repeatedly, and I've yet to see anyone dispute this fundamental fact.  Will that always be the case?  I have no idea.  

If our goal is to improve peformance, which seems highly correlated to doing less Javascript, what if one "framework" is 3kb in size, and then you build (not necessarily develop!) your UI in a data-centric format, like HTML, on top of that?  Vs another framework of equal size, and you build (not necessarily develop) your UI in JavaScript syntax?  

Note that in the case of Vue, and Svelte, you are actually developing in HTML, but building to JavaScript, if I understand correctly.

p-d,p-u take the philosophical stance that if we can just find some common things we do with JavaScript boilerplate, and turn it into a (primarily) data-centric format, that can be unobtrusively mixed with other data-centric HTML tags, the amount of JavaScript will go down, and the oceans will stop rising.

Now, just as you can to do "cross format development" like Vue and Svelte allow, you could that with these components too, but in the opposite direction:

Develop using (for example) tagged template literals, with all the nice compile-time checks that TypeScript affords, and then compile to the fastest performing format, which, science may tell us, is largely HTML-based. Compiling would be necessary with every code change, similar to webpack-based application development today. 

Or, if the tools match your scenario workflow better, develop using an HTML-based editing tool, and run a similar (but far less transformative) compilation during optimization time (but no need to do any build during development).

In either situation, I could see these components (or someting similar) helping.

Let me hasten to mention that the size of p-d,p-u, as it stands, is still a bit bigger than some great alternative libraries.  I'm sure that in more practied hands it could be brought down further, and also use all the state-of-the optimizations, which these aren't doing.   I have some ideas I'm looking at still to reduce the size.   

I also hasten to add that once you get into generating lists on the client territory, things become murky again.  

But if performance, not simplicity, is our parimary goal, this scenario could be rarer than one would think. Most lists don't need to change after they are rendered once.  So that could be generated on the server, and then allow components within that list to talk to eachother using elements like p-d,p-u.   

But what happens if the list changes?  There are four scenarios:

1.  You are getting a basically entirely different list.
2.  There are only a few changes, like after a save.
3.  Sometimes scenario 1, sometimes scenario 2.
4.  You are working with a virtual list, that changes as you scroll.

I know things like Vitual DOM and tagged templates help considerably in scenario 2 (and thus partially in scenario 3).  But based on the PWA Hacker news results, at least, probably not with scenario 1.

Still, I do think the use case for tagged template literal definitions being used for client-side list generation is quite strong, particularly around virtual lists.  But even there, I think that data-driven expressions inside those lists could be beneficial to performance.  i.e. keep as much as possible within the tick marks, as little context switching between JavaScript and Strings. 

Let me also hasten to mention that there is currently no build process in existence that takes tagged template syntax, and, during optimization time, compiles it the scientifically fastest format, that may include custom elements like p-d,p-u.

Focusing on the virtual list scenario, let's stipulate that a highly optimized version of these components, done by someone who knows what they're doing, could rougly match the same performance one would get with a lit directive.  Are there any advantages of using this component in that case?

The advantages I see are:

1.  These components are compatible with both workflows (HTML, JS)  Directives are not.
2.  These components don't lock you in to Lit.


\</grain-of-salt\>

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






