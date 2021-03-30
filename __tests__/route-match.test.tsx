import { mount } from '@vue/test-utils'
import { InitialEntry } from 'history'
import { PartialRouteObject } from 'lib/types'
import { defineComponent, PropType } from 'vue'
import { MemoryRouter as Router, Route, useParams, Outlet, useRoutes } from '@'

import Routes from './utils/RoutesDisableKeepAlive'

describe('route matching', () => {
    function VueFundamentals() {
        return <p>Vue Fundamentals</p>
    }

    function AdvancedVue() {
        return <p>Advanced Vue</p>
    }

    function Home() {
        return <p>Home</p>
    }

    function NotFound() {
        return <p>Not Found</p>
    }

    function NeverRenderFun() {
        throw new Error('NeverRender should ... uh ... never render')
    }

    function describeRouteMatching(routes: JSX.Element) {
        let testPaths = [
            '/courses',
            '/courses/routing',
            '/courses/routing/grades',
            '/courses/new',
            '/courses/not/found',
            '/courses/vue3-fundamentals',
            '/courses/advanced-vue3',
            '/',
            '/not-found',
        ]

        testPaths.forEach(path => {
            it(`renders the right elements at ${path}`, () => {
                expect(renderRoutes(routes, path)).toMatchSnapshot()
            })
        })
    }

    function renderRoutes(children: any, entry: InitialEntry) {
        // let renderer = createTestRenderer(
        //     <Router initialEntries={[entry]} />,
        // )
        const wrapper = mount(() => (
            <Router
                initialEntries={[entry]}
                v-slots={{ default: () => children }}
            />
        ))

        return wrapper.html()
    }

    function Courses() {
        return (
            <div>
                <h1>Courses</h1>
                <Outlet />
            </div>
        )
    }

    const Course = defineComponent({
        setup() {
            let paramsRef = useParams()

            return () => {
                let { id } = paramsRef.value

                return (
                    <div>
                        <h2>Course {id}</h2>
                        <Outlet />
                    </div>
                )
            }
        },
    })

    function CourseGrades() {
        return <p>Course Grades</p>
    }

    function NewCourse() {
        return <p>New Course</p>
    }

    function CoursesIndex() {
        return <p>All Courses</p>
    }

    function CoursesNotFound() {
        return <p>Course Not Found</p>
    }

    function Landing() {
        return (
            <p>
                <h1>Welcome to Vue3 Training</h1>
                <Outlet />
            </p>
        )
    }

    const NeverRender: any = NeverRenderFun

    describe('using a route config object', () => {
        // function RoutesRenderer({ routes }: { routes: RouteObject[] }) {
        //   return useRoutes({
        //       partialRoutes: routes
        //   });
        // }

        const RoutesRenderer = defineComponent({
            name: 'RoutesRender',
            props: {
                routes: {
                    type: Array as PropType<PartialRouteObject[]>,
                    required: true,
                },
            },
            setup(props) {
                return useRoutes(
                    () => props.routes,
                    () => '',
                )
            },
        })

        let routes = [
            {
                path: 'courses',
                element: <Courses />,
                children: [
                    {
                        path: ':id',
                        element: <Course />,
                        children: [
                            { path: 'grades', element: <CourseGrades /> },
                        ],
                    },
                    { path: 'new', element: <NewCourse /> },
                    { path: '/', element: <CoursesIndex /> },
                    { path: '*', element: <CoursesNotFound /> },
                ],
            },
            {
                path: 'courses',
                element: <Landing />,
                children: [
                    {
                        path: 'vue3-fundamentals',
                        element: <VueFundamentals />,
                    },
                    { path: 'advanced-vue3', element: <AdvancedVue /> },
                    { path: '*', element: <NeverRender /> },
                ],
            },
            { path: '/', element: <Home /> },
            { path: '*', element: <NotFound /> },
        ]

        describeRouteMatching(<RoutesRenderer routes={routes} />)
    })

    describe('using <Routes> with <Route> elements', () => {
        let routes = (
            <Routes>
                <Route path="courses" element={<Courses />}>
                    <Route path=":id" element={<Course />}>
                        <Route path="grades" element={<CourseGrades />} />
                    </Route>
                    <Route path="new" element={<NewCourse />} />
                    <Route path="/" element={<CoursesIndex />} />
                    <Route path="*" element={<CoursesNotFound />} />
                </Route>
                <Route path="courses" element={<Landing />}>
                    <Route
                        path="vue3-fundamentals"
                        element={<VueFundamentals />}
                    />
                    <Route path="advanced-vue3" element={<AdvancedVue />} />
                    <Route path="*" element={<NeverRender />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        )

        describeRouteMatching(routes)
    })

    describe('using <Routes> and the *secret menu*', () => {
        // TODO: need helper funtion to help deal with `path` prop
        const CS: any = Courses
        const C: any = Course
        const CG: any = CourseGrades
        const NC: any = NewCourse
        const CI: any = CoursesIndex
        const CNF: any = CoursesNotFound
        const L: any = Landing
        const RF: any = VueFundamentals
        const AR: any = AdvancedVue
        const H: any = Home
        const N: any = NotFound

        let routes = (
            <Routes>
                <CS path="courses">
                    <C path=":id">
                        <CG path="grades" />
                    </C>
                    <NC path="new" />
                    <CI path="/" />
                    <CNF path="*" />
                </CS>
                <L path="courses">
                    <RF path="vue3-fundamentals" />
                    <AR path="advanced-vue3" />
                    <NeverRender path="*" />
                </L>
                <H path="/" />
                <N path="*" />
            </Routes>
        )

        describeRouteMatching(routes)
    })
})
