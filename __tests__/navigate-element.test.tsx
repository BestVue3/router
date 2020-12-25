import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { MemoryRouter as Router, Routes, Route, Navigate } from '@'

describe('navigate using an element', () => {
    describe('with an absolute href', () => {
        it('navigates to the correct URL', () => {
            function Home() {
                return <Navigate to="/about" />
            }

            function About() {
                return <h1>About</h1>
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                        <Route path="about" element={<About />} />
                    </Routes>
                </Router>
            ))

            return nextTick(() => {
                expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>About</h1>"`)
            })
        })
    })

    describe('with a relative href', () => {
        it('navigates to the correct URL', () => {
            function Home() {
                return <Navigate to="../about" />
            }

            function About() {
                return <h1>About</h1>
            }

            const wrapper = mount(() => (
                <Router initialEntries={['/home']}>
                    <Routes>
                        <Route path="home" element={<Home />} />
                        <Route path="about" element={<About />} />
                    </Routes>
                </Router>
            ))

            return nextTick(() => {
                expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>About</h1>"`)
            })
        })
    })
})
