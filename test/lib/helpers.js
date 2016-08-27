module.exports.extendVnode = function(vnode, el) {
    return Object.assign(vnode, {
        elm: el
    });
};
