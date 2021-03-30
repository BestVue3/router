import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { MemoryRouter as Router, Route, useSearchParams } from '@'

import Routes from '../utils/RoutesDisableKeepAlive'

describe('useSearchParams', () => {
    const SearchPage = defineComponent({
        setup() {
            const queryRef = ref()
            const [searchParamsRef, setSearchParams] = useSearchParams(() => ({
                q: '',
            }))
            // const query = searchParams.get('q')

            function handleSubmit(event: any) {
                event.preventDefault()
                setSearchParams({ q: queryRef.value.value })
            }

            return () => {
                const query = searchParamsRef.value.get('q')

                return (
                    <div>
                        <p>The current query is "{query}".</p>

                        <form onSubmit={handleSubmit}>
                            <input
                                name="q"
                                value={query as string}
                                ref={queryRef}
                            />
                        </form>
                    </div>
                )
            }
        },
    })

    it('reads and writes the search string', () => {
        const wrapper = mount(() => (
            <Router initialEntries={['/search?q=Michael+Jackson']}>
                <Routes>
                    <Route path="search" element={<SearchPage />} />
                </Routes>
            </Router>
        ))

        let form = wrapper.find('form')
        expect(form.exists()).toBeTruthy()

        let queryInput = wrapper.find('input[name=q]')
        expect(queryInput.exists()).toBeTruthy()

        expect(wrapper.html()).toMatch(/The current query is "Michael Jackson"/)
        ;(queryInput.element as any).value = 'Ryan Florence'
        return form.trigger('submit').then(() => {
            expect(wrapper.html()).toMatch(
                /The current query is "Ryan Florence"/,
            )
        })
        // act(() => {
        //     queryInput.value = 'Ryan Florence'
        //     form.dispatchEvent(
        //         new Event('submit', { bubbles: true, cancelable: true }),
        //     )
        // })

        // expect(node.innerHTML).toMatch(/The current query is "Ryan Florence"/)
    })
})
