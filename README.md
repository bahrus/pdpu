# \<p-d\>, \<p-u\>

This package contains two custom elements:  p-d and p-u, which stand for "pass down" and "pass up."

These two components dream the impossible dream -- be able to progressively, declaratively, glue native DOM / web components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

Actually, Polymer proved that the dream isn't that far fetched.  These components are inspired by Polymer's helper elements.  It should be noted that Polymer's binding support places great emphasis on performance -- so they can be used inside a rapidly scrolling virtual list, for example.  These components emphasize simplicity and small size -- to be used for 10,000 ft. above the ground component gluing.  Think connecting a TV to a Roku, rather than connecting tightly coupled micro chips together.

Here I am defining a "framework" as a "common, centrally managed language used to glue components together."  What distinguishes polymer's helper elements from a framework is that they are themselves components.  The "language" can thus easily evolve, like natural languages.  Who stll uses the word lasslorn? 

It's kind of like metaprogramming [in nemerle](https://github.com/rsdn/nemerle/wiki/Macros-tutorial) or [sweet.js](https://www.sweetjs.org/), only a hell of a lot easier.

Both p-d and p-u have an attribute/property, "on" that specifies an event to monitor for.  They both attach an event listener for the specified event to the previous (non p-d) element.

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

m is an optional attribute that indicates the maximum number of matching elements that are expected to be found.  If not specified, all the downstream siblings are checked, which can be wastefull.

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
    <div p-d-if='["myPassDownTag"]'>
        <prepend-string></prepend-string>
        <my-filter></my-filter>
    </div>
```


## Inline Script Props

It is common to want to set properties and objects on a custom element.  This can be done as shown below:

```html
<script type="module ish">
({
    fn: (obj, idx) => `<div>Row with index ${idx}</div>`
})
</script>
<p-d on="eval" to="{rowGenerator:fn}">
<my-virtual-list></my-virtual-list>
```

p-d is ~1.9KB minified and gzipped.

## Loops [TODO]

I'm not talking here about generating a list of items, but rather a circular flow of data, which I can't see how an application would avoid.  If one page hyperlinks to another page, which links to a third page, which links back to the first page, we have data flowing in a circular fashion.  

Every programming language I'm familiar with allows this to happen via clearly defined cycles.  I.e. the direction of the data doesn't suddenly reverse, but rather, the control goes back to a cleary marked starting point again. Recursive functions or for loops are the classic example. 

In the DOM world, one could argue that using events is more confusing than a programming language, because in a way the direction of the data flow *does* suddenly go into reverse, and it's not obvious inspecting the tree of DOM what impact the event will have. Where does it stop?  Some intermediate DOM elements could take action on the event, passing down new data, but allow the event to continue propagating up, which could do something similar.   At least I'm guessing that's what causes people to reach for global state management so eagerly.  Honestly, this whole discussion is quite foreign to me, as I've not really experienced any issues with any two-way binding system.  I'm just relying on people's vague hand waving "unidirectional dataflow plus a global state management system avoids difficult to debug scenarios, take my word for it".  Okay.

But relying on a central place to manage state seems like more jumping around between files, more opportunities for accidental conflicts, more challenging performance issues.   Or why would we have local variables? 

So what would an alternative, declarative looping mechanism look like that doesn't involve events or global state management?

I think the answer is using ID's.  ID's must be unique, outside of the shadow DOM, and within each Shadow DOM realm.  In a nod to the people who don't like data to flow any direction other than top down, the element is called p-u.

Suppose you create a little program that will calculate the third number, given a + b = c, where the user can edit a, b, or c (one at a time):

```html
<solve-algebra-problem nv id="sumSolver"></solve-algebra-problem>
<p-d on="first-operand-changed" to="#a{value}"></p-d><p-d on="second-operand-changed" to="#b{value}"></p-d>
<input id="a"/><p-d on="input" to="#c{leftOperand}"></p-d>
<input id="b"/><p-d on="input" to="#c{rightOperand}"</p-d>
<sum-input id="c"></sum-input>
<p-u on="input" to="sumSolver{leftOperand:leftOperand;rightOperand:rightOperand;sum:value}"></p-u>
```

The p-u element will search for the id following an upper flow that is that opposite of downward flow.  Ie go to previous siblings, then the parent, then previous siblings of the parent, etc, until a matching ID is found, then unload there and stop.

```html
<p-u on="input" to="#shadow-root#sumSolver{leftOperand:leftOperand;rightOperand:rightOperand;sum:value}"></p-u>
```


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
