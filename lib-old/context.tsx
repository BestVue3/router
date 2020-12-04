import { defineComponent, inject, isRef, Ref, PropType, provide } from 'vue'
import { History, Location, Action } from 'history'
import invariant from 'tiny-invariant'

import { rs } from './utils'

interface LocationContextObject {
    action?: Action
    location?: Location
    navigator?: Navigator
    static: boolean
}

export interface Match {
    path: string
    url: string
    params: {
        [key: string]: any
    }
    isExact: boolean
}

export interface HistoryContext {
    history: History
    location: Location
    match: Match
    staticContext: object
}

export const HistoryObjectContextKey = Symbol()
export const HistoryContextKey = Symbol()

export function useHistoryContext(name?: string) {
    const contextRef = inject<Ref<HistoryContext>>(HistoryObjectContextKey)

    invariant(
        contextRef && isRef(contextRef),
        name
            ? `<${name}> must be used with <Router />`
            : 'you should use `useHistoryContext` under <Router />',
    )

    return contextRef
}

export function useHistory(name?: string) {
    const historyRef = inject<Ref<History>>(HistoryContextKey)

    invariant(
        historyRef && isRef(historyRef),
        name
            ? `<${name}> must be used with <Router />`
            : 'you should use `useHistory` under <Router />',
    )

    return historyRef
}

export const HistoryContextProvider = defineComponent({
    name: 'HistoryContextProvider',
    props: {
        value: {
            type: Object as PropType<Ref<HistoryContext>>,
            required: true,
        },
    },
    setup(props, { slots }) {
        provide(HistoryObjectContextKey, props.value)
        return () => rs(slots)
    },
})
