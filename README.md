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
var virtualize = require('snabbdom-virtualize');
```

Pass it a set of DOM nodes or a string representing DOM nodes with one root node.

```javascript
// Actual DOM nodes
var topNode = document.createElement('div');
var textNode = document.createTextNode('Click ');
var linkNode = document.createElement('a');
linkNode.setAttribute('href', 'http://example.com');
linkNode.textContent = 'here';
topNode.appendChild(textNode);
topNode.appendChild(linkNode);
var vnode = virtualize(topNode);

// String
var vnode = virtualize('<div>Click <a href="http://example.com">here</a>');
```

### Project setup

Written in ES6, compiled using Babel. To get started:

```
npm install
npm run build
```

This will output a compiled `index.js` file in the root directory.

### Tests

Tests can be run with `npm test`.
