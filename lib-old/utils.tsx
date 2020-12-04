import { Slots, VNode } from 'vue'
import invariant from 'tiny-invariant'

export function renderSlots(slots: Slots, name = 'default'): VNode[] {
    if (!slots[name]) {
        // TODO: if dev throw error
    }

    if (typeof slots[name] !== 'function') {
        console.warn(
            `${name} slot is not a function, it's better to use function for slots`,
        )
        return slots[name] as any // eslint-disable-line
    }

    const children = slots[name] && (slots[name] as any)()
    // if (children === undefined) {
    invariant(
        children !== undefined,
        'if your children is none, you should return null instead of undefined',
    )
    // }
    return children as VNode[]
}

export const rs = renderSlots
