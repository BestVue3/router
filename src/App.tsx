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
                    <Routes>
                        <Route
                            path="/"
                            element={<MarkdownViewer html={md.markup} />}
                        ></Route>
                    </Routes>
                </BrowserRouter>
            )
        }
    },
})
export default App
