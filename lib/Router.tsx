import { computed, defineComponent, PropType, shallowRef } from 'vue'
import {
    Action,
    InitialEntry,
    Location,
    Update,
    createMemoryHistory,
} from 'history'

import { invariant, warning } from './utils'
import { LocationContextProvider, useInRouter } from './context'
import { Navigator } from './types'

/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://reactrouter.com/api/MemoryRouter
 */
export const MemoryRouter = defineComponent({
    name: 'MemoryRouter',
    props: {
        initialEntries: {
            type: Array as PropType<InitialEntry[]>,
        },
        initialIndex: Number,
    },
    setup(props, { slots }) {
        const { initialEntries, initialIndex } = props // eslint-disable-line
        const history = createMemoryHistory({
            initialEntries,
            initialIndex,
        })

        const updateRef = shallowRef<Update>({
            action: history.action,
            location: history.location,
        })

        history.listen(update => {
            updateRef.value = update
        })

        return () => {
            const update = updateRef.value
            return (
                <Router
                    v-slots={slots}
                    action={update.action}
                    location={update.location}
                    navigator={history}
                ></Router>
            )
        }
    },
})

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://reactrouter.com/api/Router
 */
export const Router = defineComponent({
    name: 'Router',
    props: {
        action: {
            type: String as PropType<Action>,
            default: Action.Pop,
        },
        location: {
            type: Object as PropType<Location>,
        },
        navigator: {
            type: Object as PropType<Navigator>,
            required: true,
        },
        static: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { slots }) {
        const locationContextRef = computed(() => {
            const { action, location, navigator, static: staticProp } = props
            return { action, location, navigator, static: staticProp }
        })

        const isInRouterRef = useInRouter()

        return () => {
            invariant(
                !isInRouterRef.value,
                `You cannot render a <Router> inside another <Router>.` +
                    ` You never need more than one.`,
            )

            return (
                <LocationContextProvider
                    v-slots={slots}
                    value={locationContextRef}
                />
            )
        }
    },
})
