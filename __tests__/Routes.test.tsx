import { defineComponent, Fragment, nextTick, onMounted } from 'vue'
import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Routes, Route, useNavigate } from '@'

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

describe('Switch <Routes> in SFC & template', () => {
    it(`show success`, done => {
        const Home = defineComponent({
            setup() {
                const navigate = useNavigate()

                onMounted(() => {
                    navigate('/about')
                })

                return () => <h1>Home</h1>
            },
        })

        function About() {
            return <h1>About</h1>
        }

        const wrapper = mount({
            template: `
            <Router :initialEntries="['/home']">
                <Routes>
                    <Route path="home">
                        <template v-slot:element>
                            <Home />
                        </template>
                    </Route>
                    <Route path="about">
                        <template v-slot:element>
                            <About />
                        </template>
                    </Route>
                </Routes>
            </Router>
            `,
            components: {
                Router,
                Routes,
                Route,
                Home,
                About,
            },
            data() {
                return { index: 0 }
            },
        })

        expect(wrapper.html()).toEqual(`<h1>Home</h1>`)
        nextTick(() => {
            expect(wrapper.html()).toEqual(`<h1>About</h1>`)
            done()
        })
    })
})
