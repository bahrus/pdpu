[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/p-d.p-u)

<a href="https://nodei.co/npm/p-d.p-u/"><img src="https://nodei.co/npm/p-d.p-u.png"></a>


# \<p-d\>, \<p-u\>

This package contains two (and a half) custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

Actually, Polymer proved that the dream isn't that far fetched.  These components are inspired by Polymer's helper elements.  It should be noted that Polymer's binding support places great emphasis on performance -- so they can be used inside a rapidly scrolling virtual list, for example.  

These components, instead, emphasize simplicity and small size -- to be used for 30,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.  Having said that, these components seem to perform adequately in [at least one scenario of a virtual list.](https://www.webcomponents.org/element/xtal-tree)  

Here I am defining a "framework" as a "common, centrally managed language used to glue components together."  What distinguishes polymer's helper elements from a framework is that they are themselves components.  The "language" can thus easily evolve, like natural languages.  Who stll uses the word lasslorn? 

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

m is an optional attribute that indicates the maximum number of matching elements that are expected to be found.  If not specified, all the downstream siblings are checked, which can be wasteful.

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
2)  If no value is specified, it will see if event.detail exists.  If not it will try target.value.  

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
    <p-d on="input" to="{input}"></p-d>
    <url-builder prepend="api/allEmployees?startsWith="></url-builder>   
    <p-d on="value-changed"  to="{url}"></p-d>
    <fetch-data></fetch-data>                                                   
    <p-d on="fetch-complete" to="my-filter{input}" m="2"></p-d>
    <my-filter select="isActive"></my-filter>                                   
    <p-d on="value-changed"  to="#activeList{items}" m="1"></p-d>
    <my-filter select="!isActive"></my-filter>                                  
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
        <prepend-string></prepend-string>
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

If the expression inside the script tag evaluates to a function, it is evaluated against the p-d instance before assigning the properties to the target element.
p-d is ~2.2KB minified and gzipped.

## Targeted Passing    

p-u can pass data in any direction, but the primary intention is to pass it up the DOM tree to a precise single target.  The CSS selector before the opening brace points to an ID.  If the selector starts with  a slash, it searches from document, outside any shadow DOM.  If it has no slashes, it searches within the shadow DOM it belongs to  ../ goes up one level. ../../ goes up two levels, etc.

The two components are combined into one IIFE.js file, p-d.p-u.js which totals ~2.3KB minified and gzipped.

## Deluxe version [partially untested]

Another custom element, p-d-x, extends p-d and adds these additional features;

1)  You can specify adding / removing a css class (untested).
2)  You can specify a nested path that needs setting (untested).
3)  You can  specify multiple properties that need setting on the same element, more compactly (tested).
4)  You can observe attribute changes, in lieu of listening for an event (untested). 
5)  You can debug the event handler by adding attribute "debug" (tested) 

p-d, p-u and p-d-x, when combined into a single file, totals ~2.6KB minified and gzipped.

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
