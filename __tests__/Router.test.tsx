import { mount } from '@vue/test-utils'
import { createMemoryHistory } from 'history'
import { Router, Routes, Route } from '@'

describe('A <Router>', () => {
    let consoleError: any
    beforeEach(() => {
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleError.mockRestore()
    })

    it('throws if another <Router> is already in context', () => {
        let history = createMemoryHistory()

        expect(() => {
            mount(() => (
                <Router
                    action={history.action}
                    location={history.location}
                    navigator={history}
                >
                    <Router
                        action={history.action}
                        location={history.location}
                        navigator={history}
                    />
                </Router>
            ))
        }).toThrow(/cannot render a <Router> inside another <Router>/)

        // invariant just throws not `console.error`
        expect(consoleError).not.toHaveBeenCalled()
    })
})
