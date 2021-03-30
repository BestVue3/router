import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { MemoryRouter as Router, Route, useParams, Outlet } from '@'

import Routes from './utils/RoutesDisableKeepAlive'

const COMMENT_HTML = '<!---->'

describe('<Routes> with a basename', () => {
    const User = defineComponent({
        setup() {
            const paramsRef = useParams()
            return () => {
                const { userId } = paramsRef.value
                return (
                    <div>
                        <h1>User: {userId}</h1>
                        <Outlet />
                    </div>
                )
            }
        },
    })

    function Dashboard() {
        return <h1>Dashboard</h1>
    }

    let userRoute = (
        <Route path="users/:userId" element={<User />}>
            <Route path="dashboard" element={<Dashboard />} />
        </Route>
    )

    it('does not match when the URL pathname does not start with that base', () => {
        const wrapper = mount(() => (
            <Router initialEntries={['/app/users/michael/dashboard']}>
                <Routes basename="/base">{userRoute}</Routes>
            </Router>
        ))

        expect(wrapper.html()).toEqual(COMMENT_HTML)
    })

    it('matches when the URL pathname starts with that base', () => {
        const wrapper = mount(() => (
            <Router initialEntries={['/app/users/michael/dashboard']}>
                <Routes basename="/app" roughlyDisableKeepAlive>
                    {userRoute}
                </Routes>
            </Router>
        ))

        // expect(renderer.toJSON()).not.toBeNull()
        expect(wrapper.html()).toEqual(
            '<div><h1>User: michael</h1><h1>Dashboard</h1></div>',
        )
    })
})
