# snabbdom-virtualize [![Build Status](https://travis-ci.org/appcues/snabbdom-virtualize.svg?branch=master)](https://travis-ci.org/appcues/snabbdom-virtualize)

Library for turning strings and DOM nodes into virtual DOM nodes compatible with [Snabbdom](https://github.com/paldepind/snabbdom).

### Usage

Add it to your application with

```
npm install --save snabbdom-virtualize
```

Require/import it.
```javascript
// ES6
import virtualize from 'snabbdom-virtualize';

// Require.
let virtualize = require('snabbdom-virtualize').default;
```

Pass it a set of DOM nodes or a string representing DOM nodes with one root node.

```javascript
// Actual DOM nodes
let topNode = document.createElement('div');
let textNode = document.createTextNode('Click ');
let linkNode = document.createElement('a');
linkNode.setAttribute('href', 'http://example.com');
linkNode.textContent = 'here';
topNode.appendChild(textNode);
topNode.appendChild(linkNode);
let vnode = virtualize(topNode);


// String
let vnode = virtualize('<div>Click <a href="http://example.com">here</a>');
```

#### Using modules à la carte

If you'd prefer to import just the function for virtualizing DOM nodes or just
the function for virtualizing HTML strings, you're in luck. Just import
`snabbdom-virtualize/nodes` or `snabbdom-virtualize/strings` and use in the
same way:

```javascript
// DOM nodes.
import virtualize from 'snabbdom-virtualize/nodes';

let topNode = document.createElement('div');
let textNode = document.createTextNode('Click ');
let linkNode = document.createElement('a');
linkNode.setAttribute('href', 'http://example.com');
linkNode.textContent = 'here';
topNode.appendChild(textNode);
topNode.appendChild(linkNode);
let vnode = virtualize(topNode);


// HTML strings.
import virtualize from 'snabbdom-virtualize/strings';

let vnode = virtualize('<div>Click <a href="http://example.com">here</a>');

```

#### Hooks

You can register a `create` hook with any of the `virtualize` functions. This will be called once for each vnode that was created. It's called after the virtualization process is completed. The function receives one argument - the `VNode` that was created.

```javascript
// The function passed as the 'create' hook is called 3 times: once for the
// <div>, once for the <span> and once for the text node inside the <span>.
virtualize("<div><span>Hi!</span></div>", {
    hooks: {
        create: function(vnode) { ... }
    }
});
```

Hooks allow you to perform some operations on your VNodes after virtualization but before patching with snabbdom.

### Project setup

Written in ES6, compiled using Babel. To get started:

```
npm install
npm run build
```

This will output compiled files in the `lib` directory.

### Tests

Tests can be run with `npm test`.
