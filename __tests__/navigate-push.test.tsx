import { mount } from '@vue/test-utils'
import { Location } from 'history'
import { defineComponent, nextTick } from 'vue'
import { Router as BaseRouter, Routes, Route, Navigate, useNavigate } from '@'

const Router: any = BaseRouter

function createMockHistory(initialLocation: Location) {
    return {
        action: 'POP',
        location: initialLocation,
        createHref() {},
        push() {},
        replace() {},
        go() {},
        back() {},
        forward() {},
        listen() {},
        block() {},
    }
}

describe('navigate', () => {
    describe('by default', () => {
        it('calls history.push()', () => {
            const Home = defineComponent({
                setup() {
                    let navigate = useNavigate()

                    function handleClick() {
                        navigate('/about')
                    }

                    return () => (
                        <div>
                            <h1>Home</h1>
                            <button onClick={handleClick}>click me</button>
                        </div>
                    )
                },
            })

            function About() {
                return <h1>About</h1>
            }

            let history = createMockHistory({
                pathname: '/home',
                search: '',
                hash: '',
            } as any)
            let spy = jest.spyOn(history, 'push')

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

            let buttonWrapper = wrapper.find('button')
            expect(buttonWrapper.exists()).toBeTruthy()

            return buttonWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalled()
            })
        })
    })

    describe('with { replace: true }', () => {
        it('calls history.replace()', () => {
            const Home = defineComponent({
                setup() {
                    let navigate = useNavigate()

                    function handleClick() {
                        navigate('/about', { replace: true })
                    }

                    return () => (
                        <div>
                            <h1>Home</h1>
                            <button onClick={handleClick}>click me</button>
                        </div>
                    )
                },
            })

            function About() {
                return <h1>About</h1>
            }

            let history = createMockHistory({
                pathname: '/home',
                search: '',
                hash: '',
            } as any)
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

            let buttonWrapper = wrapper.find('button')
            expect(buttonWrapper.exists()).toBeTruthy()

            return buttonWrapper.trigger('click').then(() => {
                expect(spy).toHaveBeenCalled()
            })
        })
    })
})
