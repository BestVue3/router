import { renderToString } from '@vue/server-renderer'
import { VNode } from 'vue'
import { Link, StaticRouter as Router } from '@'

describe('A <StaticRouter>', () => {
    describe('with a <Link to> string', () => {
        it('uses the right href', done => {
            renderToString(
                (
                    <Router location="/">
                        <Link to="mjackson" />
                    </Router>
                ) as VNode,
            ).then(html => {
                console.log(html)

                expect(html).toContain('href="/mjackson"')
                done()
            })
        })
    })

    describe('with a <Link to> object', () => {
        it('uses the right href', done => {
            renderToString(
                (
                    <Router location="/">
                        <Link to={{ pathname: '/mjackson' }} />
                    </Router>
                ) as VNode,
            ).then(html => {
                expect(html).toContain('href="/mjackson"')
                done()
            })
        })
    })
})
