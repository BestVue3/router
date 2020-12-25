import { renderToString } from '@vue/server-renderer'
import { VNode } from 'vue'
import { Routes, Route, StaticRouter as Router, Navigate } from '@'

describe('A <Navigate> in a <StaticRouter>', () => {
    let consoleWarn: any
    beforeEach(() => {
        consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleWarn.mockRestore()
    })

    it('warns about using on the initial render', done => {
        function Home() {
            return <Navigate to="/somewhere-else?the=query" />
        }

        renderToString(
            (
                <Router location="/home">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </Router>
            ) as VNode,
        ).then(() => {
            expect(consoleWarn).toHaveBeenCalledWith(
                expect.stringMatching(
                    '<Navigate> must not be used on the initial render',
                ),
            )
            done()
        })
    })
})

// describe('useNavigate in a <StaticRouter>', () => {
//     let consoleWarn: any
//     beforeEach(() => {
//         consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
//     })

//     afterEach(() => {
//         consoleWarn.mockRestore()
//     })

//     it('warns about using on the initial render', done => {
//         const Home = defineComponent({
//             setup() {
//                 const navigate = useNavigate()

//                 navigate('about')
//                 return () => null
//             },
//         })

//         renderToString(
//             (
//                 <Router location="/home">
//                     <Routes>
//                         <Route path="/home" element={<Home />} />
//                     </Routes>
//                 </Router>
//             ) as VNode,
//         ).then(() => {
//             expect(consoleWarn).toHaveBeenCalledWith(
//                 expect.stringContaining(
//                     'You should call navigate() in a watchEffect, not in your setup function.',
//                 ),
//             )
//             done()
//         })
//     })
// })
