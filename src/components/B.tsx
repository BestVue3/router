import { defineComponent, reactive } from 'vue'

const B = defineComponent({
    setup() {
        const state = reactive({
            c: 1,
        })

        setInterval(() => (state.c += 1), 1000)
        return () => <div>B {state.c}</div>
    },
})

B.__hmrId = 'bb'

declare const __VUE_HMR_RUNTIME__: any

if (module.hot) {
    const api = __VUE_HMR_RUNTIME__
    module.hot.accept()
    if (!api.createRecord('bb')) {
        api.reload('bb', B)
    }

    // module.hot.accept('./App.tsx', () => {
    //     api.reload('aaabbbccc', App)
    //     api.rerender('aaabbbccc')
    // })
}

export default B
