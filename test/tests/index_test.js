import virtualize from '../../src/index';
import h from 'snabbdom/h';
import VNode from 'snabbdom/vnode';

describe("virtualize", () => {

    it("should handle a single node with no children", () => {
        expect(virtualize(createElement('div'))).to.deep.equal(h('div'));
        expect(virtualize(createElement('h1', 'class1 class2'))).to.deep.equal(h('h1', {
            class: { class1: true, class2: true }
        }));
        expect(virtualize(createElement('span', 'class1 class2', {
            style: 'z-index: 17; position: absolute; top: 0px; left: 50px;',
            title: 'test'
        }))).to.deep.equal(h('span', {
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
        }));
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
        expect(virtualize(top)).to.deep.equal(
            h('div', { class: { container: true }, style: { position: 'absolute' } }, [
                h('ul', [
                    h('li', { class: { first: true } }, [
                        VNode(undefined, undefined, undefined, 'First')
                    ]),
                    h('li', { class: { second: true }, style: { fontWeight: '300' } }, [
                        VNode(undefined, undefined, undefined, 'Second')
                    ])
                ])
            ])
        );
    });


    it("should handle nodes with mixed text node and element children", () => {
        const top = createElement('p', 'container');
        top.appendChild(document.createTextNode('Hey there, '));
        const link = createElement('a', null, { href: 'http://example.com'});
        link.textContent = 'check out this link';
        top.appendChild(link);
        top.appendChild(document.createTextNode('. And this '));
        const code = createElement('code', 'javascript');
        code.textContent = 'niceLookingCode();';
        top.appendChild(code);
        top.appendChild(document.createTextNode('.'));
        expect(virtualize(top)).to.deep.equal(
            h('p', { class: { container: true } }, [
                VNode(undefined, undefined, undefined, 'Hey there, '),
                h('a', { attrs: { href: 'http://example.com' }}, [
                    VNode(undefined, undefined, undefined, 'check out this link')
                ]),
                VNode(undefined, undefined, undefined, '. And this '),
                h('code', { class: { javascript: true } }, [
                    VNode(undefined, undefined, undefined, 'niceLookingCode();')
                ]),
                VNode(undefined, undefined, undefined, '.')
            ])
        );
    });

    it("should handle a single node string with no children");
    it("should throw an error when there's more than one top-level node passed in the string");
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
