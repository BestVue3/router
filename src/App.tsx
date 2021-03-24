import { createMemoryHistory } from 'history'
import { createApp, defineComponent, onMounted, reactive } from 'vue'
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

import A from './components/A'
import B from './components/B'

const App = defineComponent({
    name: 'App',
    setup(p, { slots }) {
        const history = createMemoryHistory({
            initialEntries: ['/test/haha'],
        })

        const state = reactive({
            count: 1,
        })

        setInterval(() => {
            state.count += 1
        }, 1000)

        setTimeout(() => {
            history.push('/test/a%20dynamic%20segment')
        }, 1000)
        return () => {
            return (
                <BrowserRouter>
                    <div>
                        <Link to="/">Home</Link>
                        <Link to="about">About1</Link>
                    </div>
                    <Routes>
                        <Route path="/" v-slots={{ element: <A /> }}></Route>
                        <Route
                            path="about"
                            v-slots={{ element: <B /> }}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            )
        }
    },
})

export default App
