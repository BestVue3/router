// import App from './App.vue'
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
} from '../lib'
// import MemoryRouter from './lib/MemoryRouter'
// import Route from './lib/Route'

console.log(MemoryRouter, Route)

const Comp = defineComponent({
    name: 'Comp',
    setup(p, { slots }) {
        return () => {
            const children = slots.default && slots.default()
            console.log(children)
            return children
        }
    },
})

/**
 *
 */
const Test = defineComponent({
    // props: {
    //     path: String,
    // },
    setup() {
        return () => [<h1>App</h1>, <Outlet></Outlet>]
    },
})

const XXX: any = Test

const TTT = defineComponent({
    setup() {
        const paramsRef = useParams()

        return () => {
            return <Link to=".">{paramsRef.value.text}</Link>
        }
    },
})

const Start = defineComponent({
    setup() {
        return () => <Navigate to="/blog/pure vue router" />
    },
})

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
                        <Route path="/" element={<Start />}></Route>
                        <Route path="blog/:text" element={<TTT />}></Route>
                        {/* <XXX path="app">
                            <Route path=":text" element={<TTT />}></Route>
                        </XXX> */}
                    </Routes>
                </BrowserRouter>
            )
        }
    },
})
export default App
