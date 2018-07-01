[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/p-d.p-u)

<a href="https://nodei.co/npm/p-d.p-u/"><img src="https://nodei.co/npm/p-d.p-u.png"></a>


# \<p-d\>, \<p-u\>

This package contains two primary custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

Actually, Polymer proved that the dream isn't that far fetched.  These components are inspired by Polymer's helper elements.  It should be noted that Polymer's binding support places great emphasis on performance -- so they can be used inside a rapidly scrolling virtual list, for example.  

These components, instead, emphasize simplicity and small size -- to be used for 30,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.  Having said that, these components seem to perform adequately in [at least one scenario of a virtual list.](https://www.webcomponents.org/element/xtal-tree)  

Here I am defining a "framework" as a "common, centrally managed language used to glue components together."  What distinguishes polymer's helper elements from a framework is that they are themselves components.  The "language" can thus easily evolve, like natural languages.  Who still uses the word lasslorn? 

It's kind of like metaprogramming [in nemerle](https://github.com/rsdn/nemerle/wiki/Macros-tutorial) or [sweet.js](https://www.sweetjs.org/), only a hell of a lot easier.

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

The stuff inside the braces is a name value pair:  To the left of the colon is the name of the property that should be set on matching elements.  To the right is a JavaScript path / expression for where to get the value used for setting.  The path is evaluated from the JavaScript event that gets fired.  Only very simple "a.b.c" type expressions are allowed.  No ! or other JavaScript expressions is currently supported.

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


## Recursive sibling drilldown

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
<script type="module ish">
({
    fn: (obj, idx) => `<div>Row with index ${idx}</div>`
})
</script>
<p-d on="eval" to="{rowGenerator:fn}">
<my-virtual-list></my-virtual-list>
```


## Inline Script Pipeline Processing

In the previous section, we described how you can define an object within script tags, and that object can be passed down to lower siblings.

If instead of defining an object, one defines a function:

```html
<script type="module ish">
    pd => {
        return pd._input;
    }
</script>
<p-d on="eval" to="{input}">
```

then that function will be invoked every time anything passes property "input" to the p-d element below the script tag.  If the function returns an object, pieces of that object can be passed down just as before.

If the expression inside the script tag evaluates to a function, it is evaluated against the p-d instance before assigning the properties to the target element.

Suppose we want to attach a simple JavaScript event handler to a DOM Element.   Using p-d, it is possible to do this (if a bit strange looking):

```html
<button>Click Me</button>
<p-d on="click" to="{input:target}"></p-d>
<script type="module ish">
    pd =>{
        console.log('the button that was clicked was:');
        console.log(pd._input);
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


p-d is ~2.2KB minified and gzipped.



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

## Punting [TODO]

```html
<p-unt on="click" dispatch to="myEventName{toggledNode:target.node}" composed bubbles></p-unt>
```

The two components, p-d and p-u, are combined into one IIFE.js file, p-d.p-u.js which totals ~2.3KB minified and gzipped.

## Deluxe version [partially untested]

Another custom element, p-d-x, extends p-d and adds these additional features;

1)  You can specify adding / removing a css class (untested).
2)  You can specify a nested path that needs setting (untested).
3)  You can  specify multiple properties that need setting on the same element, more compactly (tested).
4)  You can observe attribute changes, in lieu of listening for an event (untested). 
5)  You can debug the event handler by adding attribute "debug" (tested) 

p-d, p-u and p-d-x, when combined into a single file, totals ~2.7KB minified and gzipped.



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
