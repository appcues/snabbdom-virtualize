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

});
