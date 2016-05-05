import virtualizeNodes from '../../src/nodes';
import h from 'snabbdom/h';

describe("#virtualizeNodes", () => {

    it("should call the 'create' hook for each VNode that was created after the virtualization process is complete", () => {
        const createSpy = sinon.spy();
        const ul = document.createElement('ul');
        ul.innerHTML = "<li>One</li><li>Fish</li><li>Two</li><li>Fish</li>";
        const vnode = virtualizeNodes(ul, {
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
        expect(createSpy).to.have.callCount(9);
        checkVNode(vnode);
    });
});
