import { defineComponent, reactive } from 'vue'

const A = defineComponent({
    setup() {
        const state = reactive({
            c: 1,
        })

        return () => <div onClick={() => (state.c += 1)}>Ax {state.c}</div>
    },
})

export default A
