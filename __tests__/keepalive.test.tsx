import { defineComponent, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import {
    MemoryRouter as Router,
    Routes,
    Route,
    useNavigate,
    Outlet,
    useRoutes,
} from '@'

describe('keepalive with <Routes>', () => {
    it('should keepalive with `keepalive` prop', done => {
        let navigate: any

        const A = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const B = () => <button>A</button>

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/a']}>
                        <Routes>
                            <Route path="a" element={<A />} keepalive></Route>
                            <Route path="b" element={<B />}></Route>
                        </Routes>
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/b')
                nextTick(() => {
                    expect(buttonText()).toBe('A')
                    navigate('/a')
                    nextTick(() => {
                        expect(buttonText()).toBe('1')
                        done()
                    })
                })
            })
        })
    })

    it('should not keepalive without `keepalive` prop', done => {
        let navigate: any

        const A = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const B = () => <button>A</button>

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/a']}>
                        <Routes>
                            <Route path="a" element={<A />}></Route>
                            <Route path="b" element={<B />}></Route>
                        </Routes>
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/b')
                nextTick(() => {
                    expect(buttonText()).toBe('A')
                    navigate('/a')
                    nextTick(() => {
                        expect(buttonText()).toBe('0')
                        done()
                    })
                })
            })
        })
    })
})

describe('keepalive with nested <Routes>', () => {
    it('should keepalive with `keepalive` prop', done => {
        let navigate: any

        const Child = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const A = defineComponent({
            setup() {
                navigate = useNavigate()

                return () => <Outlet />
            },
        })

        const B = () => <button>A</button>

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/parent/a']}>
                        <Routes>
                            <Route path="parent" element={<A />}>
                                <Route
                                    path="a"
                                    keepalive
                                    element={<Child />}
                                ></Route>
                                <Route path="b" element={<B />}></Route>
                            </Route>
                        </Routes>
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/parent/b')
                nextTick(() => {
                    expect(buttonText()).toBe('A')
                    navigate('/parent/a')
                    nextTick(() => {
                        expect(buttonText()).toBe('1')
                        done()
                    })
                })
            })
        })
    })

    it('should not keepalive without `keepalive` prop', done => {
        let navigate: any

        const Child = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const A = defineComponent({
            setup() {
                navigate = useNavigate()

                return () => <Outlet />
            },
        })

        const B = () => <button>A</button>

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/parent/a']}>
                        <Routes>
                            <Route path="parent" element={<A />}>
                                <Route path="a" element={<Child />}></Route>
                                <Route path="b" element={<B />}></Route>
                            </Route>
                        </Routes>
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/parent/b')
                nextTick(() => {
                    expect(buttonText()).toBe('A')
                    navigate('/parent/a')
                    nextTick(() => {
                        expect(buttonText()).toBe('0')
                        done()
                    })
                })
            })
        })
    })
})

describe('keepalive with `useRoutes`', () => {
    it('should work as expect', done => {
        let navigate: any
        const RouteComponent = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const CustomRoutes = defineComponent(() => {
            const renderRoutes = useRoutes(() => [
                {
                    path: 'a',
                    element: <RouteComponent />,
                    keepalive: true,
                },
                {
                    path: 'b',
                    element: <RouteComponent />,
                },
            ])

            return renderRoutes
        })

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/a']}>
                        <CustomRoutes />
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/b')
                nextTick(() => {
                    expect(buttonText()).toBe('0')
                    wrapper.find('button').trigger('click')
                    nextTick(() => {
                        expect(buttonText()).toBe('1')
                        navigate('/a')
                        nextTick(() => {
                            expect(buttonText()).toBe('1')
                            navigate('/b')
                            nextTick(() => {
                                expect(buttonText()).toBe('0')
                                done()
                            })
                        })
                    })
                })
            })
        })
    })

    it('nested children should work as expect', done => {
        let navigate: any
        const RouteComponent = defineComponent({
            setup() {
                navigate = useNavigate()
                const state = reactive({
                    count: 0,
                })

                return () => (
                    <button onClick={() => (state.count += 1)}>
                        {state.count}
                    </button>
                )
            },
        })

        const CustomRoutes = defineComponent(() => {
            const renderRoutes = useRoutes(() => [
                {
                    path: 'parent',
                    element: <Route />,
                    keepalive: true,
                    children: [
                        {
                            path: 'b',
                            element: <RouteComponent />,
                        },
                        {
                            path: 'a',
                            keepalive: true,
                            element: <RouteComponent />,
                        },
                    ],
                },
            ])

            return renderRoutes
        })

        const wrapper = mount(
            defineComponent(() => {
                return () => (
                    <Router initialEntries={['/parent/a']}>
                        <CustomRoutes />
                    </Router>
                )
            }),
        )

        function buttonText() {
            return wrapper.find('button').text()
        }

        nextTick(() => {
            expect(buttonText()).toBe('0')
            wrapper.find('button').trigger('click')
            nextTick(() => {
                expect(buttonText()).toBe('1')
                navigate('/parent/b')
                nextTick(() => {
                    expect(buttonText()).toBe('0')
                    wrapper.find('button').trigger('click')
                    nextTick(() => {
                        expect(buttonText()).toBe('1')
                        navigate('/parent/a')
                        nextTick(() => {
                            expect(buttonText()).toBe('1')
                            navigate('/parent/b')
                            nextTick(() => {
                                expect(buttonText()).toBe('0')
                                done()
                            })
                        })
                    })
                })
            })
        })
    })
})
