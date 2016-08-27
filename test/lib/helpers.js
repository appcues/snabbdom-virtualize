module.exports.extendVnode = function(vnode, el) {
    vnode.elm = el;
    return vnode;
};
