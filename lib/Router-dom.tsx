import {
    State,
    To,
    createBrowserHistory,
    createHashHistory,
    createPath,
    Transition,
} from 'history'
import {
    computed,
    defineComponent,
    PropType,
    shallowReactive,
    watchEffect,
    Ref,
    AnchorHTMLAttributes,
    ExtractPropTypes,
} from 'vue'
import { Router } from './Router'
import {
    useHref,
    useBlocker,
    useLocation,
    useResolvedPath,
    useNavigate,
    useInRouter,
} from './context'

import { warning, renderSlots, invariant } from './utils'

declare const __DEV__: boolean

////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
////////////////////////////////////////////////////////////////////////////////

/**
 * props define for <BrowserRouter/> & <HashRouter/>
 * people will need this
 * if they want to define custom <BrowserRouter/> & <HashRouter/>
 * TODO: doc address
 */
const RouterProps = {
    window: Object as PropType<Window>,
} as const
export const BrowserRouterProps = RouterProps
export const HashRouterProps = RouterProps

/**
 * helper function to create `Browser` & `Hash` Router
 */
function createRouter(type: 'Browser' | 'Hash') {
    return defineComponent({
        name: `${type}Router`,
        props: RouterProps,
        setup(props, { slots }) {
            const historyRef = computed(() => {
                return (type === 'Browser'
                    ? createBrowserHistory
                    : createHashHistory)({ window: props.window })
            })

            const state = shallowReactive({
                location: historyRef.value.location,
                action: historyRef.value.action,
            })

            watchEffect(() => {
                if (historyRef.value) {
                    return historyRef.value.listen(update => {
                        state.action = update.action
                        state.location = update.location
                    })
                }
            })

            return () => (
                <Router
                    v-slots={slots}
                    location={state.location}
                    action={state.action}
                    navigator={historyRef.value}
                />
            )
        },
    })
}

/**
 * A <Router> for use in web browsers. Provides the cleanest URLs.
 */
export const BrowserRouter = createRouter('Browser')

/**
 * A <Router> for use in web browsers. Stores the location in the hash
 * portion of the URL so it is not sent to the server.
 */
export const HashRouter = createRouter('Hash')

function isModifiedEvent(event: KeyboardEvent) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

/**
 * props define for <Link/>
 * people will need this
 * if they want to define custom <Link/>
 *
 * Link is a little bit different that
 * we only define props we needed in object
 * but use `AnchorHTMLAttributes` for types
 * TODO: doc address
 */
export const LinkProps = {
    onClick: {
        type: Function as PropType<(e: MouseEvent) => void>,
    },
    replace: Boolean,
    state: Object as PropType<State>,
    target: String,
    linkRef: Object as PropType<Ref<HTMLAnchorElement>>,
    to: {
        type: [String, Object] as PropType<To>,
        required: true,
    },
} as const

type LinkPropsType = ExtractPropTypes<typeof LinkProps> & AnchorHTMLAttributes

/**
 * The public API for rendering a history-aware <a>.
 * TODO: forwardRef
 */
export const Link = defineComponent<LinkPropsType, {}, {}, {}, {}, {}>({
    name: 'Link',
    props: LinkProps as any,
    setup(props, { slots }) {
        invariant(
            useInRouter(),
            `<Link /> may be used only in the context of a <Router> component.`,
        )

        const hrefRef = useHref(() => props.to)
        const navigate = useNavigate()
        const pathRef = useResolvedPath(() => props.to)
        const locationRef = useLocation()

        function handleClick(event: MouseEvent) {
            const { onClick, target, replace: replaceProp, to, state } = props
            const location = locationRef.value
            if (onClick) onClick(event)
            if (
                !event.defaultPrevented && // onClick prevented default
                event.button === 0 && // Ignore everything but left clicks
                (!target || target === '_self') && // Let browser handle "target=_blank" etc.
                !isModifiedEvent(event as any) // Ignore clicks with modifier keys
            ) {
                event.preventDefault()

                // If the URL hasn't changed, a regular <a> will do a replace instead of
                // a push, so do the same here.
                const replace =
                    !!replaceProp ||
                    createPath(location) === createPath(pathRef.value)

                navigate(to, { replace, state: state as any })
            }
        }
        return () => {
            const { target, linkRef } = props

            const refProps = linkRef ? { ref: linkRef } : {}

            return (
                <a
                    {...refProps}
                    href={hrefRef.value}
                    onClick={handleClick}
                    target={target}
                >
                    {renderSlots(slots)}
                </a>
            )
        }
    },
})

/**
 * A <Link> wrapper that knows if it's "active" or not.
 * TODO: forwardRef
 * TODO: do we really need `NavLink` in vue3?
 */

/**
 * props define for <Prompt/>
 * people will need this
 * if they want to define custom <Prompt/>
 */
export const PromptProps = {
    message: {
        type: String,
        required: true,
    },
    when: Boolean,
} as const

/**
 * A declarative interface for showing a window.confirm dialog with the given
 * message when the user tries to navigate away from the current page.
 *
 * This also serves as a reference implementation for anyone who wants to
 * create their own custom prompt component.
 */
export const Prompt = defineComponent({
    name: 'Prompt',
    props: PromptProps,
    setup(props) {
        usePrompt(
            () => props.message,
            () => props.when,
        )
        return () => null
    },
})

////////////////////////////////////////////////////////////////////////////////
// HOOKS
////////////////////////////////////////////////////////////////////////////////

/**
 * Prevents navigation away from the current page using a window.confirm prompt
 * with the given message.
 */
export function usePrompt(
    messageEffect: () => string,
    whenEffect: () => boolean,
) {
    const blocker = (tx: Transition) => {
        if (window.confirm(messageEffect())) tx.retry()
    }

    useBlocker(blocker, whenEffect)
}

/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams(defaultInitEffect?: () => URLSearchParamsInit) {
    warning(
        typeof URLSearchParams !== 'undefined',
        'You cannot use the `useSearchParams` hook in a browser that does not' +
            ' support the URLSearchParams API. If you need to support Internet Explorer 11,' +
            ' we recommend you load a polyfill such as https://github.com/ungap/url-search-params' +
            '\n\n' +
            "If you're unsure how to load polyfills, we recommend you check out https://polyfill.io/v3/" +
            ' which provides some recommendations about how to load polyfills only for users that' +
            ' need them, instead of for every user.',
    )

    const navigate = useNavigate()
    const locationRef = useLocation()

    const setSearchParams = (
        nextInit: URLSearchParamsInit,
        navigateOptions?: { replace?: boolean; state?: State },
    ) => {
        navigate('?' + createSearchParams(nextInit), navigateOptions)
    }

    const searchParamsRef = computed(() => {
        const location = locationRef.value

        const defaultSearchParams = createSearchParams(
            defaultInitEffect && defaultInitEffect(),
        )

        const searchParams = createSearchParams(location.search)

        for (const key of defaultSearchParams.keys()) {
            if (!searchParams.has(key)) {
                searchParams.getAll(key).forEach(value => {
                    searchParams.append(key, value)
                })
            }
        }

        return searchParams
    })

    return [searchParamsRef, setSearchParams] as const
}

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
export function createSearchParams(
    init: URLSearchParamsInit = '',
): URLSearchParams {
    return new URLSearchParams(
        typeof init === 'string' ||
        Array.isArray(init) ||
        init instanceof URLSearchParams
            ? init
            : Object.keys(init).reduce((memo, key) => {
                  const value = init[key]
                  return memo.concat(
                      Array.isArray(value)
                          ? value.map(v => [key, v])
                          : [[key, value]],
                  )
              }, [] as ParamKeyValuePair[]),
    )
}

export type ParamKeyValuePair = [string, string]
export type URLSearchParamsInit =
    | string
    | ParamKeyValuePair[]
    | Record<string, string | string[]>
    | URLSearchParams
