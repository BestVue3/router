import {
    VNodeChild,
    isVNode,
    Fragment,
    defineComponent,
    VNode,
    PropType,
    computed,
    onMounted,
    Ref,
    cloneVNode,
    KeepAlive,
} from 'vue'
import { PartialLocation, parsePath, To, State } from 'history'

import forEachChild from './forEachChild'
import { rs, joinPaths, warning, warningOnce, invariant } from './utils'
import {
    Params,
    RouteObject,
    RouteBranch,
    RouteMatch,
    PathMatch,
    PathPattern,
    readOnly,
    PartialRouteObject,
} from './types'
import rankRouteBranches from './rank-route-branches'
import {
    RouteContextProvider,
    useLocation,
    useRouteContext,
    useOutlet,
    useNavigate,
    useHistory,
    useInRouter,
} from './context'

declare const __DEV__: boolean

function compilePath(
    path: string,
    caseSensitive: boolean,
    end: boolean,
): [RegExp, string[]] {
    const keys: string[] = []
    let source =
        '^(' +
        path
            .replace(/^\/*/, '/') // Make sure it has a leading /
            .replace(/\/?\*?$/, '') // Ignore trailing / and /*, we'll handle it below
            .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
            .replace(/:(\w+)/g, (_: string, key: string) => {
                keys.push(key)
                return '([^\\/]+)'
            }) +
        ')'

    if (path.endsWith('*')) {
        if (path.endsWith('/*')) {
            source += '\\/?' // Don't include the / in params['*']
        }
        keys.push('*')
        source += '(.*)'
    } else if (end) {
        source += '\\/?'
    }

    if (end) source += '$'

    const flags = caseSensitive ? undefined : 'i'
    const matcher = new RegExp(source, flags)

    return [matcher, keys]
}

function safelyDecodeURIComponent(value: string, paramName: string) {
    try {
        return decodeURIComponent(value.replace(/\+/g, ' '))
    } catch (error) {
        warning(
            false,
            `The value for the URL param "${paramName}" will not be decoded because` +
                ` the string "${value}" is a malformed URL segment. This is probably` +
                ` due to a bad percent encoding (${error}).`,
        )

        return value
    }
}

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://router.bestvue3.com/api/matchPath
 */
export function matchPath(
    pattern: PathPattern,
    pathname: string,
): PathMatch | null {
    if (typeof pattern === 'string') {
        pattern = { path: pattern }
    }

    const { path, caseSensitive = false, end = true } = pattern
    const [matcher, paramNames] = compilePath(path, caseSensitive, end)
    const match = pathname.match(matcher)

    if (!match) return null

    const matchedPathname = match[1]
    const values = match.slice(2)
    const params = paramNames.reduce((memo, paramName, index) => {
        memo[paramName] = safelyDecodeURIComponent(values[index], paramName)
        return memo
    }, {} as Params)

    return { path, pathname: matchedPathname, params }
}

function matchRouteBranch(
    branch: RouteBranch,
    pathname: string,
): RouteMatch[] | null {
    const routes = branch[1]
    let matchedPathname = '/'
    let matchedParams: Params = {}

    const matches: RouteMatch[] = []
    for (let i = 0; i < routes.length; ++i) {
        const route = routes[i]
        const remainingPathname =
            matchedPathname === '/'
                ? pathname
                : pathname.slice(matchedPathname.length) || '/'
        const routeMatch = matchPath(
            {
                path: route.path,
                caseSensitive: route.caseSensitive,
                end: i === routes.length - 1,
            },
            remainingPathname,
        )

        if (!routeMatch) return null

        matchedPathname = joinPaths([matchedPathname, routeMatch.pathname])
        matchedParams = { ...matchedParams, ...routeMatch.params }

        matches.push({
            route,
            pathname: matchedPathname,
            params: readOnly<Params>(matchedParams),
        })
    }

    return matches
}

function flattenRoutes(
    routes: RouteObject[],
    branches: RouteBranch[] = [],
    parentPath = '',
    parentRoutes: RouteObject[] = [],
    parentIndexes: number[] = [],
): RouteBranch[] {
    routes.forEach((route, index) => {
        const path = joinPaths([parentPath, route.path])
        const routes = parentRoutes.concat(route)
        const indexes = parentIndexes.concat(index)

        // Add the children before adding this route to the array so we traverse the
        // route tree depth-first and child routes appear before their parents in
        // the "flattened" version.
        if (route.children) {
            flattenRoutes(route.children, branches, path, routes, indexes)
        }

        branches.push([path, routes, indexes])
    })

    return branches
}

/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://router.bestvue3.com/api/matchRoutes
 */
export function matchRoutes(
    routes: RouteObject[],
    location: string | PartialLocation,
    basename = '',
): RouteMatch[] | null {
    if (typeof location === 'string') {
        location = parsePath(location)
    }

    let pathname = location.pathname || '/'
    if (basename) {
        const base = basename.replace(/^\/*/, '/').replace(/\/+$/, '')
        if (pathname.startsWith(base)) {
            pathname = pathname === base ? '/' : pathname.slice(base.length)
        } else {
            // Pathname does not start with the basename, no match.
            return null
        }
    }

    const branches = flattenRoutes(routes)
    rankRouteBranches(branches)

    let matches = null
    for (let i = 0; matches == null && i < branches.length; ++i) {
        // TODO: Match on search, state too?
        matches = matchRouteBranch(branches[i], pathname)
    }

    return matches
}

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://router.bestvue3.com/api/createRoutesFromChildren
 */
export function createRoutesFromChildren(children: VNodeChild): RouteObject[] {
    const routes: RouteObject[] = []

    forEachChild(children, node => {
        if (!isVNode(node)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return
        }

        if (node.type === Fragment) {
            // Transparently support React.Fragment and its children.
            let subChildren: VNodeChild = node.children as VNodeChild
            if (
                node.children &&
                (node.children as any).default &&
                typeof (node.children as any).default === 'function'
            ) {
                subChildren = (node.children as any).default()
            }
            routes.push(...createRoutesFromChildren(subChildren))
            return
        }

        // if (node.type )
        const route: RouteObject = {
            path: (node.props && node.props.path) || '/',
            caseSensitive: (node.props && node.props.caseSensitive) === true,
            // Default behavior is to just render the element that was given. This
            // permits people to use any element they prefer, not just <Route> (though
            // all our official examples and docs use <Route> for clarity).
            node,
        }

        if (node.children) {
            let subChildren: VNodeChild = node.children as VNodeChild
            if (
                node.children &&
                (node.children as any).default &&
                typeof (node.children as any).default === 'function'
            ) {
                subChildren = (node.children as any).default()
            }
            const childRoutes = createRoutesFromChildren(subChildren) // TODO: children is VNodeArrayChildren
            if (childRoutes.length) {
                route.children = childRoutes
            }
        }

        routes.push(route)
    })

    return routes
}

function useRoutes_(
    routesEffect: () => RouteObject[],
    basenameEffect: () => string,
): () => VNode | null {
    const routeContextRef = useRouteContext()
    const locationRef = useLocation()

    const routesRef = computed(routesEffect)
    const basenameRef = computed(() => {
        const { pathname: parentPathname } = routeContextRef.value
        const basename = basenameEffect() || ''
        return basename ? joinPaths([parentPathname, basename]) : parentPathname
    })

    const matchesRef = computed(() => {
        // const matchesRef = computed(() => {
        const {
            route: parentRoute,
            pathname: parentPathname,
        } = routeContextRef.value

        const location = locationRef.value

        if (__DEV__) {
            // You won't get a warning about 2 different <Routes> under a <Route>
            // without a trailing *, but this is a best-effort warning anyway since we
            // cannot even give the warning unless they land at the parent route.
            const parentPath = parentRoute && parentRoute.path
            warningOnce(
                parentPathname,
                !parentRoute || parentRoute.path.endsWith('*'),
                `You rendered descendant <Routes> (or called \`useRoutes\`) at "${parentPathname}"` +
                    ` (under <Route path="${parentPath}">) but the parent route path has no trailing "*".` +
                    ` This means if you navigate deeper, the parent won't match anymore and therefore` +
                    ` the child routes will never render.` +
                    `\n\n` +
                    `Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath}/*">.`,
            )
        }

        const basename = basenameRef.value
        const matches = matchRoutes(routesRef.value, location, basename)
        return matches
    })

    return () => {
        const matches = matchesRef.value
        const { params: parentParams } = routeContextRef.value
        const basename = basenameRef.value

        if (!matches) {
            // TODO: Warn about nothing matching, suggest using a catch-all route.
            return null
        }

        const element = matches.reduceRight(
            (outlet, { params, pathname, route }, index) => {
                return (
                    <RouteContextProvider
                        key={(route.node as VNode).key || 'inter' + index}
                        node={route.node as VNode}
                        value={{
                            outlet,
                            params: readOnly<Params>({
                                ...parentParams,
                                ...params,
                            }),
                            pathname: joinPaths([basename, pathname]),
                            route,
                        }}
                    />
                ) as VNode
            },
            null as VNode | null,
        )

        return element
    }
    // }
}

/**
 * props define for <Routes/>
 * people will need this
 * if they want to define custom <Routes/>
 */
export const RoutesProps = {
    basename: {
        type: String,
        default: '',
    },
} as const

/**
 * A container for a nested tree of <Route> elements that renders the branch
 * that best matches the current location.
 *
 * @see https://router.bestvue3.com/api/Routes
 */
export const Routes = defineComponent({
    name: 'Routes',
    props: RoutesProps,
    setup(props, { slots }) {
        const renderRoutes = useRoutes_(
            () => {
                /**
                 * We have to add key otherwise `Routes` will not update in SFC
                 * see https://github.com/vuejs/vue-next/issues/2893
                 */
                const children = rs(slots)

                // .map((v, index) =>
                //     cloneVNode(v, {
                //         key: (v.props && v.props.key) || index,
                //     }),
                // )
                return createRoutesFromChildren(children)
            },
            () => props.basename,
        )

        return () => {
            return <KeepAlive>{renderRoutes()}</KeepAlive>
        }
    },
})

/**
 * Creates a route config from an array of JavaScript objects. Used internally
 * by `useRoutes` to normalize the route config.
 *
 * @see https://router.bestvue3.com/api/createRoutesFromArray
 */
export function createRoutesFromArray(
    array: PartialRouteObject[],
): RouteObject[] {
    return array.map(partialRoute => {
        const route: RouteObject = {
            path: partialRoute.path || '/',
            caseSensitive: partialRoute.caseSensitive === true,
            node: partialRoute.element || <Outlet />,
        }

        if (partialRoute.children) {
            route.children = createRoutesFromArray(partialRoute.children)
        }

        return route
    })
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an <Outlet> to render their child route's
 * element.
 *
 * @see https://router.bestvue3.com/api/useRoutes
 * TODO: support this?
 */
export function useRoutes(
    partialRoutesEffect: () => PartialRouteObject[],
    basenameEffect: () => string = () => '',
): () => VNode | null {
    invariant(
        useInRouter(),
        `useRoutes may be used only in the context of a <Router> component.`,
    )
    return useRoutes_(
        () => {
            return createRoutesFromArray(partialRoutesEffect())
        },
        () => basenameEffect() || '',
    )
}

/**
 * Returns true if the URL for the given "to" value matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * <NavLink>.
 *
 * @see https://router.bestvue3.com/api/useMatch
 */
export function useMatch(
    patternEffect: () => PathPattern,
): Ref<PathMatch | null> {
    invariant(
        useInRouter(),
        `useMatch() may be used only in the context of a <Router> component.`,
    )

    const historyRef = useHistory()

    return computed(() =>
        matchPath(patternEffect(), historyRef.value.location!.pathname),
    )
}

/**
 * Renders the child route's element, if there is one.
 *
 * @see https://router.bestvue3.com/api/Outlet
 */
export const Outlet = defineComponent({
    name: 'Outlet',
    setup() {
        const outletRef = useOutlet()
        return () => outletRef.value
    },
})

/**
 * props define for <Route/>
 * people will need this
 * if they want to define custom <Route/>
 */
export const RouteProps = {
    element: {
        type: [Object, Function] as PropType<
            VNode | JSX.Element | (() => VNodeChild | JSX.Element)
        >,
    },
    path: String,
} as const

/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * We have to consider SFC, in SFC it's not very convenient to pass VNode as props
 * so we accept named slot `element` to implemenet
 *
 * In vue3, use function to pass `element` is more performt
 *
 * @see https://router.bestvue3.com/api/Route
 */
export const Route = defineComponent({
    name: 'Route',
    props: RouteProps,
    setup(props, { slots }) {
        return () => {
            const element = props.element || slots.element
            if (!element) return <Outlet />
            if (isVNode(element)) return element
            if (typeof element === 'function') return element()
            else
                throw Error(
                    '<Route> only support `VNode` or `() => VNodeChild` as element',
                )
        }
    },
})

/**
 * props define for <Navigate/>
 * people will need this
 * if they want to define custom <Navigate/>
 * TODO: doc address
 */
export const NavigateProps = {
    to: {
        type: [Object, String] as PropType<To>,
        required: true,
    },
    replace: Boolean,
    state: {
        type: Object as PropType<State>,
    },
} as const

/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://router.bestvue3.com/api/Navigate
 */
export const Navigate = defineComponent({
    name: 'Navigate',
    props: NavigateProps,
    setup(props) {
        invariant(
            useInRouter(),
            `<Navigate /> may be used only in the context of a <Router> component.`,
        )

        const navigate = useNavigate()
        const historyRef = useHistory()

        onMounted(() => {
            navigate(props.to, { replace: props.replace, state: props.state })
        })
        return () => {
            warning(
                !historyRef.value.static,
                `<Navigate> must not be used on the initial render in a <StaticRouter>. ` +
                    `This is a no-op, but you should modify your code so the <Navigate> is ` +
                    `only ever rendered in response to some user interaction or state change.`,
            )
            return null
        }
    },
})
