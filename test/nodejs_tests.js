"use strict";
const expect = require('chai').expect;
const virtualizeString = require('../strings')
const virtualizeNodes = require('../nodes')
const { h } = require('snabbdom/h');
const jsdom = require('jsdom').jsdom;
const extendVnode = require('./lib/helpers').extendVnode;
const { vnode } = require('snabbdom/vnode');


const opts = { context: (typeof document != 'undefined') ? document : jsdom('<html></html>') };

describe("In a nodejs environment", () => {
    describe("virtualizeString", () => {
        it("should convert nodes with children", () => {
            expect(
                virtualizeString("<ul><li>One</li><li>Fish</li><li>Two</li><li>Fish</li></ul>", opts)
            ).to.deep.equal(
                h('ul', [
                    h('li', ['One']),
                    h('li', ['Fish']),
                    h('li', ['Two']),
                    h('li', ['Fish'])
                ])
            );
        });

        it("should decode HTML entities, since VNodes just deal with text content", () => {
            expect(virtualizeString("<div>&amp; is an ampersand! and &frac12; is 1/2!</div>", opts)).to.deep.equal(
                h('div', [ '& is an ampersand! and ½ is 1/2!' ])
            );
        });
    });

    describe("virtualizeNodes", () => {
        let doc;
        beforeEach(() => {
            doc = jsdom('<html></html>');
        });

        it("should convert nodes with children", () => {
            const ul = doc.createElement('ul');
            ul.innerHTML = "<li>One</li><li>Fish</li><li>Two</li><li>Fish</li>";
            expect(virtualizeNodes(ul, opts)).to.deep.equal(
                extendVnode(h('ul', [
                    extendVnode(h('li', [ extendVnode(vnode(undefined, undefined, undefined, 'One'), ul.childNodes[0].firstChild) ]), ul.childNodes[0]),
                    extendVnode(h('li', [ extendVnode(vnode(undefined, undefined, undefined, 'Fish'), ul.childNodes[1].firstChild) ]), ul.childNodes[1]),
                    extendVnode(h('li', [ extendVnode(vnode(undefined, undefined, undefined, 'Two'), ul.childNodes[2].firstChild) ]), ul.childNodes[2]),
                    extendVnode(h('li', [ extendVnode(vnode(undefined, undefined, undefined, 'Fish'), ul.childNodes[3].firstChild) ]), ul.childNodes[3])
                ]), ul)
            );
        });

        it("should decode HTML entities, since VNodes just deal with text content", () => {
            const div = doc.createElement('div');
            div.innerHTML = "&amp; is an ampersand! and &frac12; is 1/2!";
            expect(virtualizeNodes(div, opts)).to.deep.equal(
                extendVnode(h('div', [ extendVnode(vnode(undefined, undefined, undefined,'& is an ampersand! and ½ is 1/2!'), div.firstChild) ]), div)
            );
        });
    });
});

