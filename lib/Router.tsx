import { computed, defineComponent, PropType, shallowRef } from 'vue'
import {
    Action,
    InitialEntry,
    Location,
    Update,
    createMemoryHistory,
} from 'history'

import { invariant } from './utils'
import { LocationContextProvider, useHistory } from './context'
import { Navigator } from './types'

/**
 * props define for <MemoryRouter/>
 * people will need this
 * if they want to define custom <MemoryRouter/>
 * TODO: doc address
 */
export const MemoryRouterProps = {
    initialEntries: {
        type: Array as PropType<InitialEntry[]>,
    },
    initialIndex: Number,
} as const

/**
 * A <Router> that stores all entries in memory.
 *
 * @see https://router.bestvue3.com/api/MemoryRouter
 */
export const MemoryRouter = defineComponent({
    name: 'MemoryRouter',
    props: MemoryRouterProps,
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
 * props define for <Router/>
 * people will need this
 * if they want to define custom <Router/>
 * TODO: doc address
 */
export const RouterProps = {
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
} as const

/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a <Router> directly. Instead, you'll render a
 * router that is more specific to your environment such as a <BrowserRouter>
 * in web browsers or a <StaticRouter> for server rendering.
 *
 * @see https://router.bestvue3.com/api/Router
 */
export const Router = defineComponent({
    name: 'Router',
    props: RouterProps,
    setup(props, { slots }) {
        const locationContextRef = computed(() => {
            const { action, location, navigator, static: staticProp } = props
            return { action, location, navigator, static: staticProp }
        })

        const historyRef = useHistory()

        return () => {
            invariant(
                !historyRef,
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
