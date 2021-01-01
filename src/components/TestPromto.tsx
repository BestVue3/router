/* eslint-disabled */

import { createApp, defineComponent, reactive } from 'vue'
import {
    BrowserRouter,
    Routes,
    Link,
    Prompt,
    defineRouteComponent,
} from '../../lib'

const Home = defineRouteComponent(() => {
    return () => <div>Home</div>
})

const Form = defineRouteComponent({
    setup() {
        const state = reactive({
            input: '',
        })

        const arr = [1, 2]

        return () => {
            return (
                <form>
                    <Prompt
                        when={!!state.input}
                        message="You will lose your input!"
                    />
                    <p>
                        {state.input
                            ? 'Blocking! try to click Home'
                            : 'Not blocked, try to input something'}
                    </p>
                    <input v-model={state.input} />
                    {arr.map(a => (
                        <span>{a}</span>
                    ))}
                </form>
            )
        }
    },
})

export default defineComponent({
    setup() {
        return () => (
            <BrowserRouter>
                <div>
                    <Link to="/" style="margin-right: 10px;">
                        Home
                    </Link>
                    <Link to="/form">Form</Link>
                </div>
                <hr />
                <Routes>
                    <Home path="/" />
                    <Form path="form" />
                </Routes>
            </BrowserRouter>
        )
    },
})
