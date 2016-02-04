import h from 'snabbdom/h';
import VNode from 'snabbdom/vnode';

export default function snabbdomVirtualize(element) {
    if (!element) {
        return null;
    }

    // First thing to check is if a string is passed in.
    if (typeof element === 'string') {
        // General strategy here:
        // Throw the string inside an element as innerHTML to get it parsed into
        // DOM nodes. Then go and pull out the parsed nodes.
        const el = document.createElement('div');
        el.innerHTML = element;

        // There should only be one top-level node in the string. Throw an error
        // otherwise.
        if (el.childNodes.length > 1) {
            throw new Error('Cannot virtualize multiple top-level nodes.');
        }
        else if (el.childNodes.length === 1) {
            // Pull out the top-level node and run it through the virtualize fn.
            return snabbdomVirtualize(el.childNodes.item(0));
        }
    }

    // If our node is a text node, then we only want to set the `text` part of
    // the VNode.
    if (element.nodeType === Node.TEXT_NODE) {
        return VNode(undefined, undefined, undefined, element.textContent);
    }

    // If not a text node, then build up a VNode based on the element's tag
    // name, class and style attributes, and remaining attributes.

    // Special values: style, class. We don't include these in the attrs hash
    // of the VNode.
    const data = {};
    const classes = getClasses(element);
    if (Object.keys(classes).length !== 0) {
        data.class = classes;
    }
    const style = getStyle(element);
    if (Object.keys(style).length !== 0) {
        data.style = style;
    }

    // Build up set of attributes on the element.
    const attributes = element.attributes;
    for (let i = 0; i < attributes.length; i++) {
        const attr = attributes.item(i);
        const name = attr.name;
        if (name !== 'style' && name !== 'class') {
            if (!data.attrs) {
                data.attrs = {};
            }
            data.attrs[name] = attr.value;
        }
    }

    // Build up set of children.
    let childNodes = null;
    const children = element.childNodes;
    if (children.length > 0) {
        childNodes = [];
        for (var i = 0; i < children.length; i++) {
            childNodes.push(snabbdomVirtualize(children.item(i)));
        }
    }
    return h(element.tagName.toLowerCase(), data, childNodes);
}

// Builds the class object for the VNode.
function getClasses(element) {
    const className = element.className;
    const classes = {};
    if (className !== null && className.length > 0) {
        className.split(' ').forEach((className) => {
            classes[className] = true;
        });
    }
    return classes;
}

// Builds the style object for the VNode.
function getStyle(element) {
    const style = element.style;
    const styles = {};
    for (let i = 0; i < style.length; i++) {
        const name = style.item(i);
        const transformedName = transformName(name);
        styles[transformedName] = style.getPropertyValue(name);
    }
    return styles;
}

function transformName(name) {
    // Replace -a with A to help camel case style property names.
    name = name.replace( /-(\w)/g, function _replace( $1, $2 ) {
        return $2.toUpperCase();
    });
    // Handle properties that start with a -.
    const firstChar = name.charAt(0).toLowerCase();
    return `${firstChar}${name.substring(1)}`;
}
