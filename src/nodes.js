import h from 'snabbdom/h';
import { createTextVNode, transformName } from './utils';
import listeners from './event-listeners';

export default function virtualizeNodes(element, options = {}) {

    const context = options.context || document;

    if (!element) {
        return null;
    }

    const createdVNodes = [];
    const vnode = convertNode(element, createdVNodes, context);
    options.hooks && options.hooks.create && createdVNodes.forEach((node) => { options.hooks.create(node); });
    return vnode;
}


function convertNode(element, createdVNodes, context) {
    // If our node is a text node, then we only want to set the `text` part of
    // the VNode.
    if (element.nodeType === context.defaultView.Node.TEXT_NODE) {
        const newNode = createTextVNode(element.textContent, context);
        newNode.elm = element;
        createdVNodes.push(newNode);
        return newNode
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

    // Check for event listeners.
    const on = {};
    listeners.forEach((key) => {
        if (element[key]) {
            on[key.substring(2)] = element[key];
        }
    });
    if (Object.keys(on).length > 0) {
        data.on = on;
    }

    // Build up set of children.
    let childNodes = null;
    const children = element.childNodes;
    if (children.length > 0) {
        childNodes = [];
        for (var i = 0; i < children.length; i++) {
            childNodes.push(convertNode(children.item(i), createdVNodes, context));
        }
    }
    const newNode = h(element.tagName.toLowerCase(), data, childNodes);
    newNode.elm = element;
    createdVNodes.push(newNode);
    return newNode
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
