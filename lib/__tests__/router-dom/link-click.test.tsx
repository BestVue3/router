import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Routes, Route, Link } from '../..'

describe('A <Link> click', () => {
    it('navigates to the new page', () => {
        function Home() {
            return (
                <div>
                    <h1>Home</h1>
                    <Link to="../about">About</Link>
                </div>
            )
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

        let anchorWrapper = wrapper.find('a')
        expect(anchorWrapper.exists()).toBeTruthy()

        return anchorWrapper.trigger('click').then(() => {
            const h1Wrapper = wrapper.find('h1')

            expect(h1Wrapper.exists).toBeTruthy()
            expect(h1Wrapper.text()).toEqual('About')
        })
    })

    describe('when preventDefault is used on the click handler', () => {
        it('stays on the same page', () => {
            function Home() {
                function handleClick(event: MouseEvent) {
                    event.preventDefault()
                }

                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about" onClick={handleClick}>
                            About
                        </Link>
                    </div>
                )
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

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                const h1Wrapper = wrapper.find('h1')

                expect(h1Wrapper.exists).toBeTruthy()
                expect(h1Wrapper.text()).toEqual('Home')
            })
        })
    })

    describe('with a right click', () => {
        it('stays on the same page', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about">About</Link>
                    </div>
                )
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

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists).toBeTruthy()

            let RightMouseButton = 2
            return anchorWrapper
                .trigger('click', {
                    button: RightMouseButton,
                })
                .then(() => {
                    const h1Wrapper = wrapper.find('h1')

                    expect(h1Wrapper.exists).toBeTruthy()
                    expect(h1Wrapper.text()).toEqual('Home')
                })
        })
    })

    describe('when the link is supposed to open in a new window', () => {
        it('stays on the same page', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about" target="_blank">
                            About
                        </Link>
                    </div>
                )
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

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                const h1Wrapper = wrapper.find('h1')

                expect(h1Wrapper.exists).toBeTruthy()
                expect(h1Wrapper.text()).toEqual('Home')
            })
        })
    })

    describe('when the modifier keys are used', () => {
        it('stays on the same page', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about">About</Link>
                    </div>
                )
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

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists).toBeTruthy()

            return anchorWrapper
                .trigger('click', {
                    ctrlKey: true,
                })
                .then(() => {
                    const h1Wrapper = wrapper.find('h1')

                    expect(h1Wrapper.exists).toBeTruthy()
                    expect(h1Wrapper.text()).toEqual('Home')
                })
        })
    })
})
