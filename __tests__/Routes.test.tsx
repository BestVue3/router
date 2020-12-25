import { Fragment } from 'vue'
import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Routes, Route } from '@'

describe('A <Routes>', () => {
    it('renders the first route that matches the URL', () => {
        function Home() {
            return <h1>Home</h1>
        }

        const wrapper = mount(() => (
            <Router initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Router>
        ))

        expect(wrapper.html()).toMatchSnapshot()
    })

    it('does not render a 2nd route that also matches the URL', () => {
        function Home() {
            return <h1>Home</h1>
        }

        function Dashboard() {
            return <h1>Dashboard</h1>
        }

        const wrapper = mount(() => (
            <Router initialEntries={['/home']}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/home" element={<Dashboard />} />
                </Routes>
            </Router>
        ))

        expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders with non-element children', () => {
        function Home() {
            return <h1>Home</h1>
        }

        const wrapper = mount(() => (
            <Router initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {false}
                    {undefined}
                </Routes>
            </Router>
        ))

        expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders with React.Fragment children', () => {
        function Home() {
            return <h1>Home</h1>
        }

        function Admin() {
            return <h1>Admin</h1>
        }

        const wrappper = mount(() => (
            <Router initialEntries={['/admin']}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Fragment>
                        <Route path="/admin" element={<Admin />} />
                    </Fragment>
                </Routes>
            </Router>
        ))

        expect(wrappper.html()).toMatchSnapshot()
    })
})
