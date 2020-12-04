import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, onMounted } from 'vue'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    useParams,
} from '../..'

describe('navigate with params', () => {
    describe('when navigate params are not already encoded', () => {
        it('correctly encodes the param in the URL and decodes the param when it is used', () => {
            const Start = defineComponent({
                setup() {
                    let navigate = useNavigate()

                    onMounted(() => {
                        navigate('/blog/pure vue router')
                    })

                    return () => null
                },
            })

            const Blog = defineComponent({
                setup() {
                    let paramsRef = useParams()
                    return () => <h1>Blog: {paramsRef.value.slug}</h1>
                },
            })

            const wrapper = mount(() => (
                <Router>
                    <Routes>
                        <Route path="/" element={<Start />} />
                        <Route path="blog/:slug" element={<Blog />} />
                    </Routes>
                </Router>
            ))

            return nextTick(() => {
                expect(window.location.pathname).toEqual(
                    '/blog/pure%20vue%20router',
                )
                expect(wrapper.html()).toMatch(/pure vue router/)
            })
        })
    })

    describe('when navigate params are encoded using +', () => {
        it('does not alter the param encoding in the URL and decodes the param when it is used', () => {
            const Start = defineComponent({
                setup() {
                    let navigate = useNavigate()

                    onMounted(() => {
                        navigate('/blog/pure+vue+router')
                    })

                    return () => null
                },
            })

            const Blog = defineComponent({
                setup() {
                    let paramsRef = useParams()
                    return () => <h1>Blog: {paramsRef.value.slug}</h1>
                },
            })

            const wrapper = mount(() => (
                <Router>
                    <Routes>
                        <Route path="/" element={<Start />} />
                        <Route path="blog/:slug" element={<Blog />} />
                    </Routes>
                </Router>
            ))

            return nextTick(() => {
                // Need to add the + back for JSDom, but normal browsers leave
                // the + in the URL pathname. Should probably report this as a
                // bug in JSDom...
                let pathname = window.location.pathname.replace(/%20/g, '+')
                expect(pathname).toEqual('/blog/pure+vue+router')

                expect(wrapper.html()).toMatch(/pure vue router/)
            })
        })
    })
})
