import { mount } from '@vue/test-utils'
import { Router as BaseRouter, Route, Link } from '@'

import Routes from '../utils/RoutesDisableKeepAlive'

const Router: any = BaseRouter // skip ts validation

function createHref({ pathname = '/', search = '', hash = '' }) {
    return pathname + search + hash
}

function createMockHistory({ pathname = '/', search = '', hash = '' }) {
    let location = { pathname, search, hash }
    return {
        action: 'POP',
        location,
        createHref,
        push() {},
        replace() {},
        go() {},
        back() {},
        forward() {},
        listen() {},
        block() {},
    }
}

describe('Link push and replace', () => {
    describe('to a different pathname, when it is clicked', () => {
        it('performs a push', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="../about">About</Link>
                    </div>
                )
            }

            let history = createMockHistory({ pathname: '/home' })
            let spy = jest.spyOn(history, 'push')

            const wrapper = mount(() => (
                <Router
                    action={history.action}
                    location={history.location}
                    navigator={history}
                >
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists()).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pathname: '/about',
                        search: '',
                        hash: '',
                    }),
                    undefined,
                )
            })
        })
    })

    describe('to a different search string, when it is clicked', () => {
        it('performs a push (with the existing pathname)', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="?name=michael">Michael</Link>
                    </div>
                )
            }

            let history = createMockHistory({ pathname: '/home' })
            let spy = jest.spyOn(history, 'push')

            const wrapper = mount(() => (
                <Router
                    action={history.action}
                    location={history.location}
                    navigator={history}
                >
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists()).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pathname: '/home',
                        search: '?name=michael',
                        hash: '',
                    }),
                    undefined,
                )
            })
        })
    })

    describe('to a different hash, when it is clicked', () => {
        it('performs a push (with the existing pathname)', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to="#bio">Bio</Link>
                    </div>
                )
            }

            let history = createMockHistory({ pathname: '/home' })
            let spy = jest.spyOn(history, 'push')

            const wrapper = mount(() => (
                <Router
                    action={history.action}
                    location={history.location}
                    navigator={history}
                >
                    <Routes>
                        <Route path="home" element={<Home />} />
                    </Routes>
                </Router>
            ))

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists()).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pathname: '/home',
                        search: '',
                        hash: '#bio',
                    }),
                    undefined,
                )
            })
        })
    })

    describe('to the same page, when it is clicked', () => {
        it('performs a replace', () => {
            function Home() {
                return (
                    <div>
                        <h1>Home</h1>
                        <Link to=".">Home</Link>
                    </div>
                )
            }

            function About() {
                return <h1>About</h1>
            }

            let history = createMockHistory({ pathname: '/home' })
            let spy = jest.spyOn(history, 'replace')

            const wrapper = mount(() => (
                <Router
                    action={history.action}
                    location={history.location}
                    navigator={history}
                >
                    <Routes>
                        <Route path="home" element={<Home />} />
                        <Route path="about" element={<About />} />
                    </Routes>
                </Router>
            ))

            let anchorWrapper = wrapper.find('a')
            expect(anchorWrapper.exists()).toBeTruthy()

            return anchorWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        pathname: '/home',
                        search: '',
                        hash: '',
                    }),
                    undefined,
                )
            })
        })
    })
})
