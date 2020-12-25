// TODO: ssr?

test('static link', () => {
    expect(true).toBe(true)
})

// import { mount } from '@vue/test-utils'
// import { defineComponent, nextTick, onMounted, ref } from 'vue'
// import {
//     MemoryRouter as Router,
//     Routes,
//     Route,
//     Link,
//     useNavigate,
//     useParams,
//     useSearchParams,
// } from '@'

// describe('A <StaticRouter>', () => {
//   describe('with a <Link to> string', () => {
//     it('uses the right href', () => {
//       let html = ReactDOMServer.renderToStaticMarkup(
//         <Router location="/">
//           <Link to="mjackson" />
//         </Router>
//       );

//       expect(html).toContain('href="/mjackson"');
//     });
//   });

//   describe('with a <Link to> object', () => {
//     it('uses the right href', () => {
//       let html = ReactDOMServer.renderToStaticMarkup(
//         <Router location="/">
//           <Link to={{ pathname: '/mjackson' }} />
//         </Router>
//       );

//       expect(html).toContain('href="/mjackson"');
//     });
//   });
// });
