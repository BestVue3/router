import { isVNode, Fragment, VNodeNormalizedChildren, VNodeChild } from 'vue'

export default function forEachChild(
    children: VNodeNormalizedChildren | typeof Fragment,
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
            forEachChild(children.children, fn, traverseFragment)
        } else {
            fn(children)
        }
    } else if (Array.isArray(children)) {
        children.forEach(child =>
            forEachChild(
                child as VNodeNormalizedChildren,
                fn,
                traverseFragment,
            ),
        )
    }
}
