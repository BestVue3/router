import { computed, defineComponent, PropType, VNodeChild } from 'vue'
import { Location } from 'history'

import {
    Match,
    useHistoryContext,
    HistoryContextProvider,
    HistoryContext,
} from './context'
import matchPath from './matchPath'
import { rs } from './utils'

export default defineComponent({
    name: 'Route',
    props: {
        location: Object as PropType<Location>, // TODO: location
        path: String,
        computedMatch: Object as PropType<Match>,
        strict: Boolean, // TODO: When true, a path that has a trailing slash will only match a location.pathname with a trailing slash.
        sensitive: Boolean, // TODO: if match case sensitive

        render: Function as PropType<
            (ctx: HistoryContext) => VNodeChild | JSX.Element
        >,
        renderAlways: Function as PropType<(ctx: HistoryContext) => VNodeChild>, // TODO: 这个即便路由不匹配也会渲染
    },
    setup(props, { slots }) {
        const contextRef = useHistoryContext('Route')

        const matchRef = computed(() => {
            const context = contextRef.value
            const { location } = context
            const match = props.computedMatch
                ? props.computedMatch // <Switch> already computed the match for us
                : props.path
                ? matchPath(location.pathname, props)
                : context.match

            return match
        })

        const routeContextRef = computed(() => {
            return {
                ...contextRef.value,
                match: matchRef.value,
            } as HistoryContext
        })

        return () => {
            const { renderAlways: renderChildren, render } = props
            const match = matchRef.value
            const ctx = routeContextRef.value

            return (
                <HistoryContextProvider value={routeContextRef}>
                    {/* {match
                        ? renderChildren
                            ? renderChildren(ctx)
                            : render
                            ? render(ctx)
                            : rs(slots) // if children want to use `history`, they should invoke `useHistory` or `useHistoryContext` themself
                        : renderChildren
                        ? renderChildren(ctx)
                        : null} */}
                    {match
                        ? renderChildren
                            ? renderChildren(ctx)
                            : render
                            ? render(ctx)
                            : rs(slots)
                        : renderChildren
                        ? renderChildren(ctx)
                        : null}
                </HistoryContextProvider>
            )
        }
    },
})
