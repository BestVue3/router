import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Route, Link } from '@'

import Routes from '../utils/RoutesDisableKeepAlive'

describe('Link href', () => {
    describe('absolute', () => {
        it('is correct', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="/about">About</Link>
                    </div>
                )
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            //   let anchor = renderer.root.findByType('a');
            const anchorWrapper = wrapper.find('a')

            expect(anchorWrapper.exists).toBeTruthy()
            expect(anchorWrapper.attributes().href).toEqual('/about')
        })
    })

    describe('relative self', () => {
        it('is correct', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to=".">Home</Link>
                    </div>
                )
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            const anchorWrapper = wrapper.find('a')

            expect(anchorWrapper.exists).toBeTruthy()
            expect(anchorWrapper.attributes().href).toEqual('/home')
        })
    })

    describe('relative sibling', () => {
        it('is correct', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about">About</Link>
                    </div>
                )
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            const anchorWrapper = wrapper.find('a')

            expect(anchorWrapper.exists).toBeTruthy()
            expect(anchorWrapper.attributes().href).toEqual('/about')
        })
    })

    describe('relative with more .. segments than are in the URL', () => {
        it('is correct', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../../about">About</Link>
                    </div>
                )
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            const anchorWrapper = wrapper.find('a')

            expect(anchorWrapper.exists).toBeTruthy()
            expect(anchorWrapper.attributes().href).toEqual('/about')
        })
    })
})
