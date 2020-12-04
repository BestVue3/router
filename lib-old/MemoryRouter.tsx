import {
    createMemoryHistory,
    MemoryHistoryOptions,
    InitialEntry,
} from 'history'

import { computed, defineComponent, PropType, toRaw } from 'vue'

import Router from './Router'

export default defineComponent({
    name: 'MemoryRouter',
    props: {
        initialEntries: Array as PropType<InitialEntry[]>,
        initialIndex: Number,
        getUserConfirmation: Function,
        keyLength: Number,
    },
    setup(props, { slots }) {
        const historyRef = computed(() => {
            return createMemoryHistory(props)
        })

        return () => {
            return <Router history={historyRef.value} v-slots={slots} />
        }
    },
})
