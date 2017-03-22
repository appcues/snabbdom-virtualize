import { VNode } from 'snabbdom/vnode'

interface Hooks {
    create?: (vnode: VNode) => void
}

export interface Options {
    context?: HTMLDocument
    hooks?: Hooks
}

