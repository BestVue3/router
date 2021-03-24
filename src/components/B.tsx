import { defineComponent, reactive } from 'vue'

const B = defineComponent({
    setup() {
        console.log('rerender')
        const state = reactive({
            c: 1,
        })

        return () => <div onClick={() => (state.c += 1)}>B {state.c}</div>
    },
})

export default B
