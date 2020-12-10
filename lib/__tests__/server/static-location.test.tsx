import { renderToString } from '@vue/server-renderer'
import { defineComponent, VNode } from 'vue'
import { Routes, Route, StaticRouter as Router, useLocation } from '../../'

describe('A <StaticRouter>', () => {
    describe('with a string location prop', () => {
        it('parses the location into an object', done => {
            let location: any

            const LocationChecker = defineComponent({
                setup() {
                    location = useLocation().value

                    return () => null
                },
            })

            renderToString(
                (
                    <Router location="/the/path?the=query#the-hash">
                        <Routes>
                            <Route
                                path="/the/path"
                                element={<LocationChecker />}
                            />
                        </Routes>
                    </Router>
                ) as VNode,
            ).then(() => {
                expect(location).toMatchObject({
                    pathname: '/the/path',
                    search: '?the=query',
                    hash: '#the-hash',
                    state: {},
                    key: expect.any(String),
                })
                done()
            })
        })
    })

    describe('with an object location prop', () => {
        it('adds missing properties', done => {
            let location: any

            const LocationChecker = defineComponent({
                setup() {
                    location = useLocation().value

                    return () => null
                },
            })

            renderToString(
                (
                    <Router
                        location={{
                            pathname: '/the/path',
                            search: '?the=query',
                        }}
                    >
                        <Routes>
                            <Route
                                path="/the/path"
                                element={<LocationChecker />}
                            />
                        </Routes>
                    </Router>
                ) as VNode,
            ).then(() => {
                expect(location).toMatchObject({
                    pathname: '/the/path',
                    search: '?the=query',
                    hash: '',
                    state: {},
                    key: expect.any(String),
                })
                done()
            })
        })
    })
})
