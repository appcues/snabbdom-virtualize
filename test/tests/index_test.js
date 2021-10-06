import virtualize from '../../src/index';
import { h, vnode as VNode } from 'snabbdom';
import { extendVnode } from '../lib/helpers';

describe("virtualize", () => {

    it("should handle a single node with no children", () => {
        const el1 = createElement('div');
        expect(virtualize(el1)).to.deep.equal(extendVnode(h('div'), el1));
        const el2 = createElement('h1', 'class1 class2');
        expect(virtualize(el2)).to.deep.equal(extendVnode(h('h1', {
            class: { class1: true, class2: true }
        }), el2));
        const el3 = createElement('span', 'class1 class2', {
            style: 'z-index: 17; position: absolute; top: 0px; left: 50px;',
            title: 'test'
        });
        expect(virtualize(el3)).to.deep.equal(extendVnode(h('span', {
            class: { class1: true, class2: true },
            style: {
                zIndex: '17',
                position: 'absolute',
                top: '0px',
                left: '50px'
            },
            attrs: {
                title: 'test'
            }
        }), el3));
    });

    it("should handle data-* attributes correctly", () => {
        const el = document.createElement('div');
        el.setAttribute('data-test-val', 'something');
        expect(virtualize(el)).to.deep.equal(
            extendVnode(h('div', {
                attrs: { 'data-test-val': 'something' }
            }), el)
        );
    });

    it("should handle nodes with children", () => {
        const top = createElement('div', 'container', {
            style: 'position: absolute'
        });
        const child1 = createElement('ul');
        top.appendChild(child1);
        const child2a = createElement('li', 'first');
        child2a.textContent = 'First';
        const child2b = createElement('li', 'second', {
            style: 'font-weight: 300'
        });
        child2b.textContent = 'Second';
        child1.appendChild(child2a);
        child1.appendChild(child2b);
        expect(virtualize(top)).to.deep.equal(extendVnode(h('div', { class: { container: true }, style: { position: 'absolute' } }, [
            extendVnode(h('ul', [
                extendVnode(h('li', { class: { first: true } }, [
                    extendVnode(VNode(undefined, undefined, undefined, 'First'), child2a.firstChild)
                ]), child2a),
                extendVnode(h('li', { class: { second: true }, style: { fontWeight: '300' } }, [
                    extendVnode(VNode(undefined, undefined, undefined, 'Second'), child2b.firstChild)
                ]), child2b)
            ]), child1)
        ]), top));
    });


    it("should handle nodes with mixed text node and element children", () => {
        const top = createElement('p', 'container');
        const text1 = document.createTextNode('Hey there, ');
        top.appendChild(text1);
        const link = createElement('a', null, { href: 'http://example.com'});
        link.textContent = 'check out this link';
        top.appendChild(link);
        const text2 = document.createTextNode('. And this ');
        top.appendChild(text2);
        const code = createElement('code', 'javascript');
        code.textContent = 'niceLookingCode();';
        top.appendChild(code);
        const text3 = document.createTextNode('.');
        top.appendChild(text3);
        expect(virtualize(top)).to.deep.equal(
            extendVnode(h('p', { class: { container: true } }, [
                extendVnode(VNode(undefined, undefined, undefined, 'Hey there, '), text1),
                extendVnode(h('a', { attrs: { href: 'http://example.com' }}, [
                    extendVnode(VNode(undefined, undefined, undefined, 'check out this link'), link.firstChild)
                ]), link),
                extendVnode(VNode(undefined, undefined, undefined, '. And this '), text2),
                extendVnode(h('code', { class: { javascript: true } }, [
                    extendVnode(VNode(undefined, undefined, undefined, 'niceLookingCode();'), code.firstChild)
                ]), code),
                extendVnode(VNode(undefined, undefined, undefined, '.'), text3),
            ]), top)
        );
    });

    it("should handle a single node string with no children", () => {
        expect(virtualize('<span class="foo" style="background-color: blue; padding-left: 5px;" dir="rtl" data-test-attr="test" />'))
            .to.deep.equal(
                h('span', {
                    class: { foo: true },
                    style: {
                        backgroundColor: 'blue',
                        paddingLeft: '5px'
                    },
                    attrs: {
                        dir: 'rtl',
                        'data-test-attr': 'test'
                    }
                })
            );

        expect(virtualize('<span>This is something.</span>'))
            .to.deep.equal(
                h('span', [
                    VNode(undefined, undefined, undefined, 'This is something.')
                ])
            );
    });

    it("should handle a single text node", () => {
        expect(virtualize('Text content!')).to.deep.equal(
            VNode(undefined, undefined, undefined, 'Text content!')
        );
    });

    it("should return null when given nothing", () => {
        expect(virtualize()).to.be.null;
        expect(virtualize('')).to.be.null;
    });

    it("should handle multiple top-level nodes, returning them as an array", () => {
        const actual = virtualize('<div><h1>Something</h1></div><span>Something more</span>');
        expect(actual).to.deep.equal([
            h('div', [
                h('h1', ['Something'])
            ]),
            h('span', ['Something more'])
        ]);
    });

    it("should handle on* event listeners", () => {
        const spy = sinon.spy();
        const spy2 = sinon.spy();
        const el = createElement('div');
        el.onclick = spy;
        el.onblur = spy2;
        expect(virtualize(el)).to.deep.equal(
            extendVnode(h('div', {
                on: {
                    click: spy,
                    blur: spy2
                }
            }), el)
        );
    });

    it("should call the 'create' hook for each VNode that was created after the virtualization process is complete", () => {
        const createSpy = sinon.spy();
        const vnodes = virtualize("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul><p>Red Fish, Blue Fish</p>", {
            hooks: {
                create: createSpy
            }
        });

        // Helper to check that the create hook was called once for each created
        // vnode.
        function checkVNode(vnode) {
            expect(createSpy).to.have.been.calledWithExactly(vnode);
            if (vnode.children) {
                vnode.children.forEach((cvnode) => {
                    checkVNode(cvnode);
                });
            }
        }
        expect(createSpy).to.have.callCount(11);
        vnodes.forEach(checkVNode);
    });

});

function createElement(tag, classes, attrs) {
    const el = document.createElement(tag);
    if (classes) {
        el.setAttribute('class', classes);
    }

    for (let attr in attrs) {
        el.setAttribute(attr, attrs[attr]);
    }

    return el;
}
