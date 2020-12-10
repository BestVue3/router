import { computed, defineComponent, PropType } from 'vue'
import { Action, Location, To, createPath, parsePath } from 'history'
import { Router } from './Router'

export const StaticRouterProps = {
    location: {
        type: [String, Object] as PropType<string | Record<string, any>>,
        default: '/',
    },
} as const

/**
 * A <Router> that may not transition to any other location. This is useful
 * on the server where there is no stateful UI.
 */
export const StaticRouter = defineComponent({
    name: 'StaticRouter',
    props: StaticRouterProps,
    setup(props, { slots }) {
        const propsRef = computed(() => {
            const { location: locProp } = props
            let loc: any = locProp
            if (typeof locProp === 'string') {
                loc = parsePath(locProp)
            }

            const action = Action.Pop
            const location: Location = {
                pathname: loc.pathname || '/',
                search: loc.search || '',
                hash: loc.hash || '',
                state: loc.state || null,
                key: loc.key || 'default',
            }

            return {
                action,
                location,
            }
        })

        const staticNavigator = {
            createHref(to: To) {
                return typeof to === 'string' ? to : createPath(to)
            },
            push(to: To) {
                throw new Error(
                    `You cannot use navigator.push() on the server because it is a stateless ` +
                        `environment. This error was probably triggered when you did a ` +
                        `\`navigate(${JSON.stringify(
                            to,
                        )})\` somewhere in your app.`,
                )
            },
            replace(to: To) {
                throw new Error(
                    `You cannot use navigator.replace() on the server because it is a stateless ` +
                        `environment. This error was probably triggered when you did a ` +
                        `\`navigate(${JSON.stringify(
                            to,
                        )}, { replace: true })\` somewhere ` +
                        `in your app.`,
                )
            },
            go(delta: number) {
                throw new Error(
                    `You cannot use navigator.go() on the server because it is a stateless ` +
                        `environment. This error was probably triggered when you did a ` +
                        `\`navigate(${delta})\` somewhere in your app.`,
                )
            },
            back() {
                throw new Error(
                    `You cannot use navigator.back() on the server because it is a stateless ` +
                        `environment.`,
                )
            },
            forward() {
                throw new Error(
                    `You cannot use navigator.forward() on the server because it is a stateless ` +
                        `environment.`,
                )
            },
            block() {
                throw new Error(
                    `You cannot use navigator.block() on the server because it is a stateless ` +
                        `environment.`,
                )
            },
        }

        return () => (
            <Router
                navigator={staticNavigator}
                static={true}
                {...propsRef.value}
                v-slots={slots}
            ></Router>
        )
    },
})
