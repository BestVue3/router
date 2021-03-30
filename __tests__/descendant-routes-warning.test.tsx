import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Route, Outlet } from '@'

import Routes from './utils/RoutesDisableKeepAlive'

describe('Descendant <Routes>', () => {
    let consoleWarn: any
    beforeEach(() => {
        consoleWarn = jest.spyOn(console, 'warn').mockImplementation()
    })

    afterEach(() => {
        consoleWarn.mockRestore()
    })

    describe('when the parent route path does not have a trailing *', () => {
        it('warns once when you visit the parent route', () => {
            function VueFundamentals() {
                return <h1>Vue Fundamentals</h1>
            }

            function AdvancedVue() {
                return <h1>Advanced Vue</h1>
            }

            function VueCourses() {
                return (
                    <div>
                        <h1>Vue</h1>

                        <Routes>
                            <Route
                                path="vue-fundamentals"
                                element={<VueFundamentals />}
                            />
                        </Routes>
                        <Routes>
                            <Route
                                path="advanced-vue"
                                element={<AdvancedVue />}
                            />
                        </Routes>
                    </div>
                )
            }

            function Courses() {
                return (
                    <div>
                        <h1>Courses</h1>
                        <Outlet />
                    </div>
                )
            }

            mount(() => (
                <Router initialEntries={['/courses/vue']}>
                    <Routes>
                        <Route path="courses" element={<Courses />}>
                            <Route path="vue" element={<VueCourses />} />
                        </Route>
                    </Routes>
                </Router>
            ))

            expect(consoleWarn).toHaveBeenCalledTimes(1)
            expect(consoleWarn).toHaveBeenCalledWith(
                expect.stringContaining('child routes will never render'),
            )
        })
    })

    describe('when the parent route has a trailing *', () => {
        it('does not warn when you visit the parent route', () => {
            function VueFundamentals() {
                return <h1>Vue Fundamentals</h1>
            }

            function VueCourses() {
                return (
                    <div>
                        <h1>Vue</h1>

                        <Routes>
                            <Route
                                path="vue-fundamentals"
                                element={<VueFundamentals />}
                            />
                        </Routes>
                    </div>
                )
            }

            function Courses() {
                return (
                    <div>
                        <h1>Courses</h1>
                        <Outlet />
                    </div>
                )
            }

            mount(() => (
                <Router initialEntries={['/courses/vue']}>
                    <Routes>
                        <Route path="courses" element={<Courses />}>
                            <Route path="vue/*" element={<VueCourses />} />
                        </Route>
                    </Routes>
                </Router>
            ))

            expect(consoleWarn).not.toHaveBeenCalled()
        })
    })
})
