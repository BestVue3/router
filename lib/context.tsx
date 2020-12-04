import {
    defineComponent,
    inject,
    isRef,
    Ref,
    PropType,
    provide,
    VNode,
    VNodeChild,
    ref,
    computed,
    watchEffect,
    onMounted,
} from 'vue'
import {
    History,
    Location,
    Action,
    To,
    Path,
    Blocker,
    State,
    Transition,
} from 'history'
import { invariant, rs, resolvePath, warning } from './utils'

import {
    LocationContextObject,
    RouteContextObject,
    RouteObject,
    readOnly,
    Params,
    Navigator,
} from './types'

// export interface Match {
//     path: string
//     url: string
//     params: {
//         [key: string]: any
//     }
//     isExact: boolean
// }

// export interface HistoryContext {
//     history: History
//     location: Location
//     match: Match
//     staticContext: object
// }

export const LocationContextKey = Symbol('LocationContext')
export const RouteContextKey = Symbol('RouteContext')
// export const HistoryContextKey = Symbol()

export function useHistoryContext(name?: string) {
    const contextRef = inject<Ref<LocationContextObject> | undefined>(
        LocationContextKey,
        undefined,
    )

    invariant(
        !!contextRef && isRef(contextRef),
        name
            ? `<${name}> must be used with <Router />`
            : 'you should use `useHistoryContext` under <Router />',
    )

    return contextRef as Ref<LocationContextObject>
}

export function useInRouter() {
    const contextRef = inject<Ref<LocationContextObject> | undefined>(
        LocationContextKey,
        undefined,
    )

    return computed(() => !!(contextRef && contextRef.value))
}

export function useInRouterInvariant(msg: string) {
    const isInRouterRef = useInRouter()

    watchEffect(() => {
        invariant(
            isInRouterRef.value,

            msg,
        )
    })
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/api/useLocation
 */
export function useLocation(): Ref<Location> {
    // invariant(
    //   useInRouterContext(),
    //   // TODO: This error is probably because they somehow have 2 versions of the
    //   // router loaded. We can help them understand how to avoid that.
    //   `useLocation() may be used only in the context of a <Router> component.`
    // );

    // return useHistoryContext().value.location!;
    const historyRef = useHistoryContext()
    const locationRef = computed(() => historyRef.value.location!)

    return locationRef
}

export function useRouteContext() {
    const contextRef = inject<Ref<RouteContextObject>>(
        RouteContextKey,
        ref({
            outlet: null,
            params: readOnly<Params>({}),
            pathname: '',
            route: null,
        }),
    )

    // invariant(
    //     !!contextRef && isRef(contextRef),
    //     'you should use `useRouteContext` under <Router />',
    // )

    return contextRef
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by <Outlet> to render child routes.
 *
 * @see https://reactrouter.com/api/useOutlet
 */
export function useOutlet(): Ref<VNode | null> {
    // return React.useContext(RouteContext).outlet
    const routeContextRef = useRouteContext()
    const outletRef = computed(() => routeContextRef.value.outlet)
    return outletRef
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/api/useParams
 */
export function useParams(): Ref<Readonly<Params>> {
    // return React.useContext(RouteContext).params;
    const routeContextRef = useRouteContext()
    const outletRef = computed(() => routeContextRef.value.params)
    return outletRef
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/api/useResolvedPath
 */
export function useResolvedPath(to: () => To): Ref<Path> {
    // let { pathname } = React.useContext(RouteContext);
    // return React.useMemo(() => resolvePath(to, pathname), [to, pathname]);
    const routeContextRef = useRouteContext()
    return computed(() => resolvePath(to(), routeContextRef.value.pathname))
}

// export function useHistory(name?: string) {
//     const historyRef = inject<Ref<History>>(HistoryContextKey)

//     invariant(
//         !!historyRef && isRef(historyRef),
//         name
//             ? `<${name}> must be used with <Router />`
//             : 'you should use `useHistory` under <Router />',
//     )

//     return historyRef
// }

export const LocationContextProvider = defineComponent({
    name: 'LocationContextProvider',
    props: {
        value: {
            type: Object as PropType<Ref<LocationContextObject>>,
            required: true,
        },
    },
    setup(props, { slots }) {
        provide(LocationContextKey, props.value)
        return () => rs(slots)
    },
})

export const RouteContextProvider = defineComponent({
    name: 'RouteContextProvider',
    props: {
        value: {
            type: Object as PropType<RouteContextObject>,
            required: true,
        },
        node: {
            type: Object as PropType<VNode>,
            required: true,
        },
    },
    setup(props, { slots }) {
        const content = computed(() => props.value)
        provide(RouteContextKey, content)
        // return () => rs(slots)
        return () => props.node
    },
})

/**
 * Blocks all navigation attempts. This is useful for preventing the page from
 * changing until some condition is met, like saving form data.
 *
 * @see https://reactrouter.com/api/useBlocker
 */
export function useBlocker(blocker: Blocker, getWhen: () => boolean): void {
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    useInRouterInvariant(
        `useBlocker() may be used only in the context of a <Router> component.`,
    )

    const historyRef = useHistoryContext()

    watchEffect(() => {
        const { navigator } = historyRef.value
        if (!getWhen) return

        const unblock = navigator!.block((tx: Transition) => {
            const autoUnblockingTx = {
                ...tx,
                retry() {
                    // Automatically unblock the transition so it can play all the way
                    // through before retrying it. TODO: Figure out how to re-enable
                    // this block if the transition is cancelled for some reason.
                    unblock()
                    tx.retry()
                },
            }

            blocker(autoUnblockingTx)
        })

        return unblock
    })
}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/api/useHref
 */
export function useHref(to: () => To): Ref<string> {
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    useInRouterInvariant(
        `useHref() may be used only in the context of a <Router> component.`,
    )

    const navigatorRef = useHistoryContext()
    const pathRef = useResolvedPath(to)

    return computed(() => {
        return navigatorRef.value.navigator!.createHref(pathRef.value)
    })
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
    (to: To, options?: { replace?: boolean; state?: State }): void
    (delta: number): void
}

/**
 * Returns an imperative method for changing the location. Used by <Link>s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/api/useNavigate
 */
export function useNavigate(): NavigateFunction {
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    useInRouterInvariant(
        `useNavigate() may be used only in the context of a <Router> component.`,
    )

    const historyRef = useHistoryContext()
    const routeRef = useRouteContext()

    const mountedRef = ref(false)
    onMounted(() => (mountedRef.value = true))

    return (
        to: To | number,
        options: { replace?: boolean; state?: State } = {},
    ) => {
        const navigator = historyRef.value.navigator
        const { pathname } = routeRef.value

        if (mountedRef.value) {
            if (typeof to === 'number') {
                navigator.go(to)
            } else {
                const path = resolvePath(to, pathname)
                ;(options.replace ? navigator.replace : navigator.push)(
                    path,
                    options.state,
                )
            }
        } else {
            warning(
                false,
                `You should call navigate() in a useEffect, not when ` +
                    `your component is first rendered.`,
            )
        }
    }
}
