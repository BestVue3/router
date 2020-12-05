import {
    computed,
    defineComponent,
    PropType,
    provide,
    shallowRef,
    watchEffect,
} from 'vue'
import { History } from 'history'

import {
    HistoryContextKey,
    HistoryContextProvider,
    HistoryContext,
} from './context'
import { rs } from './utils'

function computeRootMatch(pathname: string) {
    return { path: '/', url: '/', params: {}, isExact: pathname === '/' }
}

export default defineComponent({
    name: 'BaseRouter',
    props: {
        history: {
            type: Object as PropType<History>,
            required: true,
        },
        staticContext: {
            type: Object as PropType<object>,
        },
    },
    setup(props, { slots }) {
        const locRef = shallowRef(props.history.location)

        const contextRef = computed<HistoryContext>(() => {
            const { history, staticContext } = props
            const location = locRef.value

            return {
                history,
                location: location,
                match: computeRootMatch(location.pathname), // TODO: match
                staticContext, // TODO: staticContext
            } as HistoryContext
        })

        const historyRef = computed(() => {
            return props.history
        })

        // provide(HistoryObjectContextKey, contextRef)
        provide(HistoryContextKey, historyRef)

        watchEffect(() => {
            const unlisten = props.history.listen(update => {
                locRef.value = update.location
            })

            return unlisten
        })

        return () => {
            return (
                <HistoryContextProvider value={contextRef}>
                    {rs(slots)}
                </HistoryContextProvider>
            )
        }
    },
})
