import { defineComponent, DefineComponent } from 'vue'

/**
 * Since we try to support:
 * <Routes>
 *  <YourComponent path="/xxx">
 * </Routes>
 * we have to
 */
// export function makeRoute<Props>(
//     comp: DefineComponent<Props>,
// ): DefineComponent<Props & { path: string }>

// export default function defineRouteComponent<T extends DefineComponent>(comp: T) {
//     // return comp
//     const props = comp.pro
// }

// const A = makeRoute(
//     defineComponent({
//         props: {
//             a: String,
//         },
//     }),
// )
