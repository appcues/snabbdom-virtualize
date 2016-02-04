import h from 'snabbdom/h';
import VNode from 'snabbdom/vnode';

export default function snabbdomVirtualize(element) {
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
        styles[name] = style.getPropertyValue(name);
    }
    return styles;
}

