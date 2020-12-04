import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Routes, Route } from '..'

describe('A <Route>', () => {
    it('renders its `element` prop', () => {
        function Home() {
            return <h1>Home</h1>
        }

        const wrapper = mount(() => (
            <Router initialEntries={['/home']}>
                <Routes>
                    <Route path="home" element={<Home />} />
                </Routes>
            </Router>
        ))

        expect(wrapper.html()).toEqual(`<h1>Home</h1>`)
    })

    it('renders its child routes when no `element` prop is given', () => {
        function Home() {
            return <h1>Home</h1>
        }

        const wrapper = mount(() => (
            <Router initialEntries={['/app/home']}>
                <Routes>
                    <Route path="app">
                        <Route path="home" element={<Home />} />
                    </Route>
                </Routes>
            </Router>
        ))

        expect(wrapper.html()).toEqual(`<h1>Home</h1>`)
    })
})
