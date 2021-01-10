import { defineComponent, reactive } from 'vue'

const A = defineComponent({
    setup() {
        const state = reactive({
            c: 1,
        })

        setInterval(() => (state.c += 1), 1000)
        return () => <div>Ax {state.c}</div>
    },
})

A.__hmrId = 'aa'

declare const __VUE_HMR_RUNTIME__: any

if (module.hot) {
    const api = __VUE_HMR_RUNTIME__
    module.hot.accept()
    if (!api.createRecord('aa')) {
        api.reload('aa', A)
    }

    // module.hot.accept('./App.tsx', () => {
    //     api.reload('aaabbbccc', App)
    //     api.rerender('aaabbbccc')
    // })
}

export default A
