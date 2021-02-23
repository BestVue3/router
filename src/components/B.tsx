import { defineComponent, reactive } from 'vue'

const B = defineComponent({
    setup() {
        const state = reactive({
            c: 1,
        })

        return () => <div>B {state.c}</div>
    },
})

export default B
