import { defineComponent, isVNode, Fragment, VNode, cloneVNode } from 'vue'

import { useHistoryContext } from './context'
import { rs } from './utils'
import matchPath, { Match } from './matchPath'
import forEachChild from './forEachChild'

/**
 * This component switch routes
 * The reason why we need this is that
 * Routes default act independent
 * different routes may show at same path
 * Switch chose the first matched route
 */

export default defineComponent({
    name: 'Switch',
    props: {
        // TODO: location
    },
    setup(props, { slots }) {
        const contextRef = useHistoryContext('Switch')

        return () => {
            const context = contextRef.value

            const location = context.location // TODO: passed down by props

            const children = rs(slots)

            let vnode: VNode | undefined
            let match: Match | null = null

            forEachChild(children, child => {
                if (match === undefined && isVNode(child) && child !== null) {
                    vnode = child

                    const path = child.props && (child.props.path || child.props.from)

                    match = path
                        ? matchPath(location.pathname, { ...child.props, path })
                        : context.match
                }
            })

            return match
                ? cloneVNode(vnode!, { location, computedMatch: match })
                : null
        }
    },
})
