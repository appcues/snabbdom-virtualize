import { vnode as VNode } from 'snabbdom';

export function createTextVNode(text, context) {
    return VNode(undefined, undefined, undefined, unescapeEntities(text, context));
}

export function transformName(name) {
    // Replace -a with A to help camel case style property names.
    name = name.replace( /-(\w)/g, function _replace( $1, $2 ) {
        return $2.toUpperCase();
    });
    // Handle properties that start with a -.
    const firstChar = name.charAt(0).toLowerCase();
    return `${firstChar}${name.substring(1)}`;
}

// Regex for matching HTML entities.
const entityRegex = new RegExp('&[a-z0-9#]+;', 'gi')
// Element for setting innerHTML for transforming entities.
let el = null;

export function unescapeEntities(text = '', context) {
    // Create the element using the context if it doesn't exist.
    if (!el) {
        el = context.createElement('div');
    }
    return text.replace(entityRegex, (entity) => {
        el.innerHTML = entity;
        return el.textContent;
    });
}
