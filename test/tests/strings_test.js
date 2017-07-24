import virtualizeString from '../../src/strings';
import h from 'snabbdom/h';

describe("#virtualizeString", () => {

    it("should convert a single node with no children", () => {
        expect(virtualizeString("<div />")).to.deep.equal(
            h('div')
        );
    });

    it("should convert nodes with children", () => {
        expect(
            virtualizeString("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul>")
        ).to.deep.equal(
            h('ul', [
                h('li', ['One']),
                h('li', ['Fish']),
                h('li', ['Two']),
                h('li', ['Fish'])
            ])
        );
    });

    it("should handle attributes on nodes", () => {
        expect(virtualizeString("<div title='This is it!' data-test-attr='cool' />"))
            .to.deep.equal(
                h('div', {
                    attrs: {
                        title: 'This is it!',
                        'data-test-attr': 'cool'
                    }
                })
            );
    });

    it("should handle the special style attribute on nodes", () => {
        expect(virtualizeString("<div title='This is it!' style='display: none' />")).to.deep.equal(
            h('div', {
                attrs: {
                    title: 'This is it!'
                },
                style: {
                    display: 'none'
                }
            })
        );

        expect(virtualizeString("<div style='display: none ; z-index: 17; top: 0px;' />")).to.deep.equal(
            h('div', {
                style: {
                    display: 'none',
                    zIndex: '17',
                    top: '0px'
                }
            })
        );

        expect(virtualizeString("<div style='' />")).to.deep.equal(h('div'));
    });

    it("should remove !important value from style values", () => {
        expect(virtualizeString("<div style='display: none !important; z-index: 17' />")).to.deep.equal(
            h('div', {
                style: {
                    display: 'none',
                    zIndex: '17'
                }
            })
        );
    });

    it("should handle the special class attribute on nodes", () => {
        expect(virtualizeString("<div class='class1 class2 class3 ' />")).to.deep.equal(
            h('div', {
                class: {
                    class1: true,
                    class2: true,
                    class3: true
                }
            })
        );

        expect(virtualizeString("<div class='class1' />")).to.deep.equal(
            h('div', {
                class: {
                    class1: true
                }
            })
        );

        expect(virtualizeString("<div class='' />")).to.deep.equal(h('div'));
    });

    it("should handle comments in HTML strings", () => {
        expect(
            virtualizeString('<div> <!-- First comment --> <span>Hi</span> <!-- Another comment --> Something</div>')
        ).to.deep.equal(
            h('div', [
                h('span', ['Hi']),
                ' Something'
            ])
        );
    });

    it("should decode HTML entities, since VNodes just deal with text content", () => {
        expect(virtualizeString("<div>&amp; is an ampersand! and &frac12; is 1/2! and &#xA9; is copyright!</div>")).to.deep.equal(
            h('div', [ '& is an ampersand! and ½ is 1/2! and © is copyright!' ])
        );
        expect(virtualizeString("<a href='http://example.com?test=true&amp;something=false'>Test</a>")).to.deep.equal(
            h('a', {
                attrs: {
                    href: 'http://example.com?test=true&something=false'
                }
            },[
                'Test'
            ])
        );
    });

    it("should call the 'create' hook for each VNode that was created after the virtualization process is complete", () => {
        const createSpy = sinon.spy();
        const vnodes = virtualizeString("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul><p>Red Fish, Blue Fish</p>", {
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

    it("should keep whitespace that is between elements", () => {
        const vnodes = virtualizeString("<span>foo</span> <span>bar</span>");
        expect(vnodes.length).to.equal(3)
    })
});
