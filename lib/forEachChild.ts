import { isVNode, Fragment, VNodeChild } from 'vue'

export default function forEachChild(
    children: VNodeChild,
    fn: (node: VNodeChild) => void,
    traverseFragment = false,
) {
    // TODO: RawSlots?

    /**
     * for string/number/void/boolean just do fn
     */
    if (typeof children !== 'object') return fn(children as VNodeChild)

    if (isVNode(children)) {
        if (children.type === Fragment && traverseFragment) {
            forEachChild(children.children as VNodeChild, fn, traverseFragment)
        } else {
            fn(children)
        }
    } else if (Array.isArray(children)) {
        children.forEach(child => forEachChild(child, fn, traverseFragment))
    }
}
