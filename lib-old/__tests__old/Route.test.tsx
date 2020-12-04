import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory as createHistory } from 'history'

import { MemoryRouter, Route, Router } from '../index'

describe('Route:', () => {
    it('should work', () => {
        const wrapper = mount(() => {
            return (
                <MemoryRouter>
                    <Route render={() => 'Hello'} path="/" />
                </MemoryRouter>
            )
        })

        expect(wrapper.html()).toBe('Hello')
    })

    describe('without a <Router>', () => {
        it('will throw error', () => {
            const render = () => {
                mount(() => {
                    return <Route render={() => ''} />
                })
            }
            expect(render).toThrow(
                'Invariant failed: <Route> must be used with <Router />',
            )
        })
    })

    describe('with a child slot', () => {
        it('renders when it matches', () => {
            const text = 'Hello'
            const wrapper = mount(() => {
                return (
                    <MemoryRouter initialEntries={['/test']}>
                        <Route path="/test">{text}</Route>
                    </MemoryRouter>
                )
            })

            expect(wrapper.html()).toBe(text)
        })

        it('renders when it matches at the root URL', () => {
            const text = 'Hello'

            const wrapper = mount(() => {
                return (
                    <MemoryRouter initialEntries={['/']}>
                        <Route path="/">{text}</Route>
                    </MemoryRouter>
                )
            })

            expect(wrapper.html()).toBe(text)
        })

        it('does not render when it does not match', () => {
            const text = 'Hello'

            const wrapper = mount(() => {
                return (
                    <MemoryRouter initialEntries={['/foo']}>
                        <Route path="/bar">{text}</Route>
                    </MemoryRouter>
                )
            })

            expect(wrapper.html()).not.toBe(text)
        })
    })

    describe('with a render prop', () => {
        it('renders when it matches', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/test']}>
                    <Route path="/test" render={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe(text)
        })

        it('renders when it matches at the root URL', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/']}>
                    <Route path="/" render={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe(text)
        })

        it('does not render when it does not match', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/bunnies']}>
                    <Route path="/flowers" render={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).not.toBe(text)
        })
    })

    describe('with a renderAlways prop', () => {
        it('renders when it matches', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/test']}>
                    <Route path="/test" renderAlways={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe(text)
        })

        it('renders when it matches at the root URL', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/']}>
                    <Route path="/" renderAlways={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe(text)
        })

        it('renders when it does not match', () => {
            const text = 'Hello'

            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/bunnies']}>
                    <Route path="/flowers" renderAlways={() => text} />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe(text)
        })
    })

    it('matches using nextContext when updating', done => {
        const history = createHistory({
            initialEntries: ['/path/first'],
        })

        const wrapper = mount(() => (
            <Router history={history}>
                <Route path="/path/:n" render={({ match }) => match.url} />
            </Router>
        ))

        history.push('/path/second')

        nextTick(() => {
            expect(wrapper.html()).toEqual('/path/second')
            done()
        })
    })

    describe('with dynamic segments in the path', () => {
        it('decodes them', () => {
            const wrapper = mount(() => (
                <MemoryRouter initialEntries={['/a%20dynamic%20segment']}>
                    <Route
                        path="/:id"
                        render={({ match }) => match.params.id}
                    />
                </MemoryRouter>
            ))

            expect(wrapper.html()).toBe('a dynamic segment')
        })
    })
})
