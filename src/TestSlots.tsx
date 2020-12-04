import { computed, defineComponent, h, ref } from 'vue'

const CompA = defineComponent({
    setup(p, { slots }) {
        const childrenRef = computed(() => {
            console.log('-------->')
            return slots.default && slots.default()
        })

        return () => childrenRef.value
    },
})

export default defineComponent({
    setup() {
        const flagRef = ref(false)
        setInterval(() => {
            flagRef.value = !flagRef.value
        }, 1000)

        // return () => (
        //     <CompA>
        //         <span>{flagRef.value ? '123' : 456}</span>
        //     </CompA>
        // )

        return () => h(CompA, () => h('span', flagRef.value ? '123' : '456'))
    },
})
