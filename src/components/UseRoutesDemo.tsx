/* eslint-disabled */

import { createApp, defineComponent } from 'vue'
import { BrowserRouter, Link, useRoutes } from '../../lib'

function Home() {
    return <div>Home</div>
}

function About() {
    return <div>About</div>
}

const RouterApp = defineComponent({
    setup() {
        const renderRoutes = useRoutes(() => [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
        ])

        return () => renderRoutes()
    },
})

const App = defineComponent({
    setup() {
        return () => (
            <BrowserRouter>
                <div>
                    <Link to="/" style="margin-right: 10px;">
                        Home
                    </Link>
                    <Link to="/about">About</Link>
                </div>
                <hr />
                <RouterApp />
            </BrowserRouter>
        )
    },
})

// createApp(App).mount("#app");
export default App
