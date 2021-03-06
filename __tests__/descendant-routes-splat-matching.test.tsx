import { mount } from '@vue/test-utils'
import { MemoryRouter as Router, Route, Outlet } from '@'

import Routes from './utils/RoutesDisableKeepAlive'

describe('Descendant <Routes> splat matching', () => {
    describe('when the parent route path ends with /*', () => {
        it('works', () => {
            function VueFundamentals() {
                return <h1>Vue Fundamentals</h1>
            }

            function VueCourses() {
                return (
                    <div>
                        <h1>Vue</h1>
                        <Routes roughlyDisableKeepAlive>
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

            const wrapper = mount(() => (
                <Router initialEntries={['/courses/vue/vue-fundamentals']}>
                    <Routes roughlyDisableKeepAlive>
                        <Route path="courses" element={<Courses />}>
                            <Route path="vue/*" element={<VueCourses />} />
                        </Route>
                    </Routes>
                </Router>
            ))

            expect(wrapper.html()).toMatchSnapshot()
        })
    })
})
