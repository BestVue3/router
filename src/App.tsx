import { createMemoryHistory } from 'history'
import { createApp, defineComponent, onMounted } from 'vue'
import {
    MemoryRouter,
    Outlet,
    Route,
    Routes,
    Link,
    useParams,
    BrowserRouter,
    useNavigate,
    Navigate,
    defineRouteComponent,
} from '../lib'
// import MemoryRouter from './lib/MemoryRouter'
// import Route from './lib/Route'

import MarkdownViewer from './components/MarkdownViewer'

import md from '../docs/zh/guides/quick-start.md'

const App = defineComponent({
    name: 'App',
    setup(p, { slots }) {
        const history = createMemoryHistory({
            initialEntries: ['/test/haha'],
        })

        setTimeout(() => {
            history.push('/test/a%20dynamic%20segment')
        }, 1000)
        return () => {
            return (
                <BrowserRouter>
                    <div>
                        <Link to="/">Home</Link>
                        <Link to="about">About</Link>
                    </div>
                    <Routes>
                        <Route
                            path="/"
                            v-slots={{ element: <div>Home</div> }}
                        ></Route>
                        <Route
                            path="about"
                            v-slots={{ element: <div>About</div> }}
                        >
                            <Route
                                path="me"
                                v-slots={{ element: <div>Me</div> }}
                            ></Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            )
        }
    },
})
export default App
