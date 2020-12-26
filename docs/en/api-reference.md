<a name="top"></a>

# BestVue3 Router API Reference

BestVue3 Router is a collection of [Vue3 components](https://v3.vuejs.org/guide/component-registration.html), [Composition API(also known as hooks)](https://v3.vuejs.org/api/composition-api.html) and utilities that make it easy to build multi-page applications with [Vue3](https://v3.vuejs.org). This reference contains the component props declaration, function signatures and return types of the various interfaces in BestVue3 Router.

> [!Tip:]
>
> Please refer to [our examples](./examples) for more in-depth usage
> examples of how you can use BestVue3 Router to accomplish specific tasks.

<a name="overview"></a>

## Overview

<a name="install"></a>

### Install

BestVue3 Router is published to npm named `@bv3/router`:

```bash
npm i @bv3/router -S
```

or using yarn

```bash
yarn add @bv3/router
```

<a name="setup"></a>

### Setup

To get BestVue3 Router working in your app, you need to render a router element at or near the root of your element tree. We provide several different routers, depending on where you're running your app.

-   [`<BrowserRouter>`](#browserrouter) or [`<HashRouter>`](#hashrouter) should be used when running in a web browser. Which one you pick depends on the style of URL you prefer or need.
-   [`<StaticRouter>`](#staticrouter) should be used when server-rendering a website
-   [`<MemoryRouter>`](#memoryrouter) is useful in testing scenarios and as a reference implementation for the other routers

These routers provide the context that BestVue3 Router needs to operate in a particular environment. Each one renders [a `<Router>`](#router) internally, which you may also do if you need more fine-grained control for some reason. But it is highly likely that one of the built-in routers is what you need.

<a name="routing"></a>

### Routing

Routing is the process of deciding which BestVue3 elements will be rendered on a given page of your app, and how they will be nested. BestVue3 Router provides two interfaces for declaring your routes.

-   [`<Routes>` and `<Route>`](#routes-and-route) if you're using components
-   [`useRoutes`](#useroutes) if you'd prefer a JavaScript object-based config

A few low-level pieces that we use internally are also exposed as public API, in case you need to build your own higher-level interfaces for some reason.

-   [`matchPath`](#matchpath) - matches a path pattern against a URL pathname
-   [`matchRoutes`](#matchroutes) - matches a set of routes against a [location](#location)
-   [`createRoutesFromArray`](#createroutesfromarray) - creates a route config from a set of plain JavaScript objects
-   [`createRoutesFromChildren`](#createroutesfromchildren) - creates a route config from a set of VNodeChild (i.e. [`<Route>`](#route) elements)

<a name="navigation"></a>

### Navigation

BestVue3 Router's navigation interfaces let you change the currently rendered page by modifying the current [location](#location). There are two main interfaces for navigating between pages in your app, depending on what you need.

-   [`<Link>`](#link) render an accessible `<a>` element. This lets the user initiate navigation by clicking an element on the page.
-   [`useNavigate`](#usenavigate) and [`<Navigate>`](#navigate) let you programmatically navigate, usually in an event handler or in response to some change in state

There are a few low-level APIs that we use internally that may also prove useful when building your own navigation interfaces.

-   [`useResolvedPath`](#useresolvedpath) - resolves a relative path against the current [location](#location)
-   [`useHref`](#usehref) - resolves a relative path suitable for use as a `<a href>`
-   [`resolvePath`](#resolvepath) - resolves a relative path against a given URL pathname

<a name="confirming-navigation"></a>

### Confirming Navigation

Sometimes you need to confirm navigation before it actually happens. For example, if the user has entered some data into a form on the current page, you may want to prompt them to save the data before they navigate to a different page.

-   [`usePrompt`](#useprompt) and [`<Prompt>`](#prompt) trigger a platform-native confirmation prompt when the user tries to navigate away from the current page
-   [`useBlocker`](#useblocker) is a low-level interface that lets you keep the user on the same page and execute a function that will be called when they try to navigate away

<a name="search-parameters"></a>

### Search Parameters

Access to the URL [search parameters](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) is provided via [the `useSearchParams` hook](#usesearchparams).

---

<a name="reference"></a>

## Reference

<a name="browserrouter"></a>

### `<BrowserRouter>`

<details>
  <summary>Props declaration</summary>

```tsx
const BrowserRouterProps = {
    window: Object as PropType<Window>,
} as const
```

</details>

`<BrowserRouter>` is the recommended interface for running BestVue3 Router in a web browser. A `<BrowserRouter>` stores the current location in the browser's address bar using clean URLs and navigates using the browser's built-in history stack.

`<BrowserRouter window>` defaults to using the current [document's `defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView), but it may also be used to track changes to another's window's URL, in an `<iframe>`, for example.

```tsx
import { createApp } from 'vue'

createApp(() => (
    <BrowserRouter>{/* The rest of your app goes here */}</BrowserRouter>
)).mount('#app')
```

<a name="hashrouter"></a>

### `<HashRouter>`

<details>
  <summary>Props declaration</summary>

```tsx
const HashRouterProps = {
    window: Object as PropType<Window>,
} as const
```

</details>

`<HashRouter>` is for use in web browsers when the URL should not (or cannot) be sent to the server for some reason. This may happen in some shared hosting scenarios where you do not have full control over the server. In these situations, `<HashRouter>` makes it possible to store the current location in the `hash` portion of the current URL, so it is never sent to the server.

`<HashRouter window>` defaults to using the current [document's `defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView), but it may also be used to track changes to another window's URL, in an `<iframe>`, for example.

```tsx
import { createApp } from 'vue'

createApp(() => (
    <HashRouter>{/* The rest of your app goes here */}</HashRouter>
)).mount('#app')
```

<a name="memoryrouter"></a>

### `<MemoryRouter>`

<details>
  <summary>Props declaration</summary>

```tsx
export const MemoryRouterProps = {
    initialEntries: {
        type: Array as PropType<InitialEntry[]>,
    },
    initialIndex: Number,
} as const
```

</details>

A `<MemoryRouter>` stores its locations internally in an array. Unlike `<BrowserHistory>` and `<HashHistory>`, it isn't tied to an external source, like the history stack in a browser. This makes it ideal for scenarios where you need complete control over the history stack, like testing.

-   `<MemoryRouter initialEntries>` defaults to `["/"]` (a single entry at the root `/` URL)
-   `<MemoryRouter initialIndex>` defaults to the last index of `props.initialEntries`

> [!Tip:]
>
> Most of BestVue3 Router's tests are written using a `<MemoryRouter>` as the
> source of truth, so you can see some great examples of using it by just
> [browsing through our tests](https://github.com/BestVue3/router/tree/master/lib/__tests__).

```tsx
import { mount } from '@vue/test-utils'

describe('My app', () => {
    it('renders correctly', () => {
        const wrapper = mount(() => (
            <MemoryRouter initialEntries={['/users/mjackson']}>
                <Routes>
                    <Route path="users" element={<Users />}>
                        <Route path=":id" element={<UserProfile />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        ))

        expect(wrapper.html()).toMatchSnapshot()
    })
})
```

<a name="link"></a>

### `<Link>`

<details>
  <summary>Props declaration</summary>

```tsx
const LinkProps = {
    onClick: {
        type: Function as PropType<(e: MouseEvent) => void>,
    },
    replace: Boolean,
    state: Object as PropType<State>,
    target: String,
    linkRef: Object as PropType<Ref<HTMLAnchorElement>>,
    to: {
        type: [String, Object] as PropType<To>,
        required: true,
    },
} as const
```

</details>

A `<Link>` is an element that lets the user navigate to another page by clicking or tapping on it. A `<Link>` renders an accessible `<a>` element with a real `href` that points to the resource it's linking to. This means that things like right-clicking a `<Link>` work as you'd expect.

```tsx
import { Link } from '@bv3/router'

// functional component
function UsersIndexPage({ users }) {
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <Link to={user.id}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

A relative `<Link to>` value (that does not begin with `/`) resolves relative to the parent route, which means that it builds upon the URL path that was matched by the route that rendered that `<Link>`. It may contain `..` to link to routes further up the hierarchy. In these cases, `..` works exactly like the command-line `cd` function; each `..` removes one segment of the parent path.

> [!Note:]
>
> `<Link to>` with a `..` behaves differently from a normal `<a href>` when the
> current URL ends with `/`. `<Link to>` ignores the trailing slash, and removes
> one URL segment for each `..`. But an `<a href>` value handles `..` differently
> when the current URL ends with `/` vs when it does not.

<a name="navigate"></a>

### `<Navigate>`

<details>
  <summary>Props declaration</summary>

```tsx
const NavigateProps = {
    to: {
        type: [Object, String] as PropType<To>,
        required: true,
    },
    replace: Boolean,
    state: {
        type: Object as PropType<State>,
    },
} as const
```

</details>

A `<Navigate>` element changes the current location when it is rendered. It's a component wrapper around [`useNavigate`](#usenavigate), and accepts all the same arguments as props.

```tsx
import { Navigate } from '@bv3/router'

const LoginForm = defineComponent({
    setup() {
        const state = reactive({ user: null, error: null })

        async handleSubmit(event) {
            event.preventDefault()
            try {
                let user = await login(event.target)
                state.user = user
            } catch (error) {
                state.error = error
            }
        }

        return () => {
            let { user, error } = this.state
            return (
                <div>
                    {error && <p>{error.message}</p>}
                    {user && <Navigate to="/dashboard" replace={true} />}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" />
                        <input type="password" name="password" />
                    </form>
                </div>
            )
        }
    }
})
```

<a name="outlet"></a>

### `<Outlet>`

<details>
  <summary>Props declaration</summary>

```tsx
const OutletProps = {} as const
```

</details>

An `<Outlet>` should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered. If the parent route matched exactly, it will render nothing.

```tsx
function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            {/* This element will render either <DashboardMessages> when the URL is
                "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
            */}
            <Outlet />
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />}>
                <Route path="messages" element={<DashboardMessages />} />
                <Route path="tasks" element={<DashboardTasks />} />
            </Route>
        </Routes>
    )
}
```

<a name="prompt"></a>

### `<Prompt>`

<details>
  <summary>Prompt declaration</summary>

```tsx
const PromptProps = {
    message: {
        type: String,
        required: true,
    },
    when: Boolean,
} as const
```

</details>

A `<Prompt>` is the declarative version of [`usePrompt`](#useprompt). It doesn't render anything. It just calls `usePrompt` with its props.

<a name="router"></a>

### `<Router>`

<details>
  <summary>Props declaration</summary>

```tsx
const RouterProps = {
    action: {
        type: String as PropType<Action>,
        default: Action.Pop,
    },
    location: {
        type: Object as PropType<Location>,
    },
    navigator: {
        type: Object as PropType<Navigator>,
        required: true,
    },
    static: {
        type: Boolean,
        default: false,
    },
} as const
```

</details>

`<Router>` is the low-level interface that is shared by all router components ([`<BrowserRouter>`](#browserrouter), [`<HashRouter>`](#hashrouter), [`<StaticRouter>`](#staticrouter). In terms of Vue3, `<Router>` is a [context provider](https://v3.vuejs.org/api/composition-api.html#provide-inject) that supplies routing information to the rest of the app.

You probably never need to render a `<Router>` manually. Instead, you should use one of the higher-level routers depending on your environment. You only ever need one router in a given app.

<a name="routes"></a>
<a name="route"></a>
<a name="routes-and-route"></a>

### `<Routes>` and `<Route>`

<details>
  <summary>Props declaration</summary>

```tsx
const RoutesProps = {
    basename: {
        type: String,
        default: '',
    },
} as const

const RouteProps = {
    element: {
        type: Object as PropType<VNode | JSX.Element | (() => VNodeChild)>,
    },
    path: String,
} as const
```

</details>

`<Routes>` and `<Route>` are the primary ways to render something in BestVue3 Router based on the current [`location`](#location). You can think about a `<Route>` kind of like an `if` statement; if its `path` matches the current URL, it renders its `element` prop or slot! The `<Route caseSensitive>` prop determines if the matching should be done in a case-sensitive manner (defaults to `false`).

Whenever the location changes, `<Routes>` looks through all its `children` `<Route>` elements to find the best match and renders that branch of the UI. `<Route>` elements may be nested to indicate nested UI, which also correspond to nested URL paths. Parent routes render their child routes by rendering an [`<Outlet>`](#outlet).

```tsx
<Routes>
    <Route path="/" element={<Dashboard />}>
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="tasks" element={<DashboardTasks />} />
    </Route>
    <Route path="about" element={<AboutPage />} />
</Routes>
```

> [!Note:]
>
> If you'd prefer to define your routes as regular JavaScript objects instead
> of using JSX, [try `useRoutes` instead](#useroutes).

The default `<Route element>` is an [`<Outlet>`](#outlet). This means the route will still render its children even without an explicit `element` prop, so you can nest route paths without nesting UI around the child route elements.

For example, in the following config the parent route renders an `<Outlet>` by default, so the child route will render without any surrounding UI. But the child route's path is `/users/:id` because it still builds on its parent.

```tsx
<Route path="users">
    <Route path=":id" element={<UserProfile />} />
</Route>
```

> [!Note:]
>
> The example before use JSX as syntax, in JSX pass VNode is really easy
> But we guess lots of developer still prefer SFC in a long time
> So we provide slot way to pass `element`

```html
<template>
    <Routes>
        <Route path="/">
            <template v-slot:element>
                <Dashboard />
            </template>
            <Route path="messages">
                <template v-slot:element>
                    <DashboardMessages />}
                </template>
            </Route>
            <Route path="tasks" element={<DashboardTasks />}>
                <template v-slot:element>
                    <DashboardTasks />}
                </template>
            </Route>
        </Route>
    </Routes>
</template>
```

<a name="staticrouter"></a>

### `<StaticRouter>`

<details>
  <summary>Props declaration</summary>

```tsx
const StaticRouterProps = {
    location: {
        type: [String, Object] as PropType<string | Record<string, any>>,
        default: '/',
    },
} as const
```

</details>

`<StaticRouter>` is used to render a BestVue3 Router web app in [node](https://nodejs.org). Provide the current location via the `location` prop.

-   `<StaticRouter location>` defaults to `"/"`

```tsx
import { renderToString } from '@vue/server-renderer'
import { StaticRouter } from '@bv3/router'
import http from 'http'

async function requestHandler(req, res) {
    let html = await renderToString(
        <StaticRouter location={req.url}>
            {/* The rest of your app goes here */}
        </StaticRouter>,
    )

    res.write(html)
    res.end()
}

http.createServer(requestHandler).listen(3000)
```

<a name="createroutesfromarray"></a>

### `createRoutesFromArray`

<details>
  <summary>Type declaration</summary>

```tsx
declare function createRoutesFromArray(
    array: PartialRouteObject[],
): RouteObject[]

interface PartialRouteObject {
    path?: string
    caseSensitive?: boolean
    node?: VNode
    children?: PartialRouteObject[]
}

interface RouteObject {
    caseSensitive: boolean
    children?: RouteObject[]
    node: VNode
    path: string
}
```

</details>

`createRoutesFromArray` is a helper that fills in the (potentially) missing pieces in an array of route objects. It is used internally by [`useRoutes`](#useroutes) to create route objects.

<a name="createroutesfromchildren"></a>

### `createRoutesFromChildren`

<details>
  <summary>Type declaration</summary>

```tsx
declare function createRoutesFromChildren(children: VNodeChild): RouteObject[]
```

</details>

`createRoutesFromChildren` is a helper that creates route objects from VNodes. It is used internally in a [`<Routes>` element](#routes) to generate a route config from its [`<Route>`](#route) children elements.

See also [`createRoutesFromArray`](#createroutesfromarray).

<a name="generatepath"></a>

### `generatePath`

<details>
  <summary>Type declaration</summary>

```tsx
declare function generatePath(path: string, params: Params = {}): string
```

</details>

`generatePath` interpolates a set of params into a route path string with `:id` and `*` placeholders. This can be useful when you want to eliminate placeholders from a route path so it matches statically instead of using a dynamic parameter.

```tsx
generatePath('/users/:id', { id: 42 }) // "/users/42"
generatePath('/files/:type/*', { type: 'img', '*': 'cat.jpg' }) // "/files/img/cat.jpg"
```

<a name="location"></a>

### `Location`

The term "location" in BestVue3 Router refers to [the `Location` interface](https://github.com/ReactTraining/history/blob/master/docs/api-reference.md#location) from the [history](https://github.com/ReactTraining/history) library.

> [!Note:]
>
> The history package is BestVue3 Router's main dependency and many of the
> core types in BestVue3 Router come directly from that library including
> `Location`, `To`, `Path`, `State`, and others. You can read more about
> the history library in [its documentation](https://github.com/ReactTraining/history/tree/master/docs).

<a name="matchroutes"></a>

### `matchRoutes`

<details>
  <summary>Type declaration</summary>

```tsx
declare function matchRoutes(
    routes: RouteObject[],
    location: string | PartialLocation,
    basename: string = '',
): RouteMatch[] | null

interface RouteMatch {
    route: RouteObject
    pathname: string
    params: Params
}
```

</details>

`matchRoutes` runs the route matching algorithm for a set of routes against a given [`location`](#location) to see which routes (if any) match. If it finds a match, an array of `RouteMatch` objects is returned, one for each route that matched.

This is the heart of BestVue3 Router's matching algorithm. It is used internally by [`useRoutes`](#useroutes) and the [`<Routes>` component](#routes) to determine which routes match the current location. It can also be useful in some situations where you want to manually match a set of routes.

<a name="matchpath"></a>

### `matchPath`

<details>
  <summary>Type declaration</summary>

```tsx
declare function matchPath(
    pattern: PathPattern,
    pathname: string,
): PathMatch | null

type PathPattern =
    | string
    | { path: string; caseSensitive?: boolean; end?: boolean }

interface PathMatch {
    path: string
    pathname: string
    params: Params
}
```

</details>

`matchPath` matches a route path pattern against a URL pathname and returns information about the match. This is useful whenever you need to manually run the router's matching algorithm to determine if a route path matches or not. It returns `null` if the pattern does not match the given pathname.

The [`useMatch` hook](#usematch) uses this function internally to match a route path relative to the current location.

<a name="resolvepath"></a>

### `resolvePath`

<details>
  <summary>Type declaration</summary>

```tsx
declare function resolvePath(to: To, fromPathname = '/'): Path

type To = string | PartialLocation

interface Path {
    pathname: string
    search: string
    hash: string
}
```

</details>

`resolvePath` resolves a given `To` value into an actual `Path` object with an absolute `pathname`. This is useful whenever you need to know the exact path for a relative `To` value. For example, the `<Link>` component uses this function to know the actual URL it points to.

The [`useResolvedPath` hook](#useresolvedpath) uses `resolvePath` internally to resolve against the current `location.pathname`.

<a name="useblocker"></a>

### `useBlocker`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useBlocker(blocker: Blocker, getWhen: () => boolean): void
```

</details>

`useBlocker` is a low-level hook that allows you to block navigation away from the current page, i.e. prevent the current location from changing. This is probably something you don't ever want to do unless you also display a confirmation dialog to the user to help them understand why their navigation attempt was blocked. In these cases, you probably want to use [`usePrompt`](#useprompt) or [`<Prompt>`](#prompt) instead.

<a name="usehref"></a>

### `useHref`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useHref(toEffect: () => To): string
```

</details>

The `useHref` hook returns a URL that may be used to link to the given `to` location, even outside of BestVue3 Router.

> [!Tip:]
>
> You may be interested in taking a look at the source for the `<Link>`
> component in `@bv3/router` to see how it uses `useHref` internally to
> determine its own `href` value.

<a name="uselocation"></a>

### `useLocation`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useLocation(): Location
```

</details>

This hook returns the current [`location`](#location) object. This can be useful if you'd like to perform some side effect whenever the current location changes.

```tsx
import { watchEffect } from 'vue'
import { useLocation } from '@bv3/router';

function App() {
  let location = useLocation();

  watchEffect(() => {
    ga('send', 'pageview');
  });

  return () => // ...
}
```

<a name="usematch"></a>

### `useMatch`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useMatch(pattern: PathPattern): PathMatch | null
```

</details>

Returns match data about a route at the given path relative to the current location.

See [`matchPath`](#matchpath) for more information.

<a name="usenavigate"></a>

### `useNavigate`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useNavigate(): NavigateFunction

interface NavigateFunction {
    (to: To, options?: { replace?: boolean; state?: State }): void
    (delta: number): void
}
```

</details>

The `useNavigate` hook returns a function that lets you navigate programmatically, for example after a form is submitted.

```tsx
import { defineComponent } from 'vue'
import { useNavigate } from '@bv3/router'

const SignupForm = defineComponent({
    setup() {
        const navigate = useNavigate()

        async function handleSubmit(event) {
            event.preventDefault()
            await submitForm(event.target)
            navigate('../success', { replace: true })
        }

        return () => <form onSubmit={handleSubmit}>{/* ... */}</form>
    },
})
```

The `navigate` function has two signatures:

-   Either pass a `To` value (same type as `<Link to>`) with an optional second `{ replace, state }` arg or
-   Pass the delta you want to go in the history stack. For example, `navigate(-1)` is equivalent to hitting the back button.

<a name="useoutlet"></a>

### `useOutlet`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useOutlet(): Ref<VNode | null>
```

</details>

Returns the element for the child route at this level of the route hierarchy. This hook is used internally by [`<Outlet>`](#outlet) to render child routes.

<a name="useparams"></a>

### `useParams`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useParams(): Ref<Params>
```

</details>

The `useParams` hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the `<Route path>`. Child routes inherit all params from their parent routes.

```tsx
import { defineComponent } from 'vue'
import { Routes, Route, useParams } from '@bv3/router';

const ProfilePage = defineComponent({
    setup() {
        // Get the userId param from the URL.
        const paramsRef= useParams();

        return () => {
            const { userId } = paramsRef.value
            // ...
        }
    }
})

function App() {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId" element={<ProfilePage />} />
        <Route path="me" element={...} />
      </Route>
    </Routes>
  );
}
```

<a name="useprompt"></a>

### `usePrompt`

<details>
  <summary>Type declaration</summary>

```tsx
declare function usePrompt(
    messageEffect: () => string,
    whenEffect: () => boolean,
): void
```

</details>

The `usePrompt` hook may be used to confirm navigation before the user navigates away from the current page. This is useful when someone has entered unsaved data into a form, and you'd like to prompt them before they accidentally leave or close the tab and lose their work.

```tsx
import { defineComponent, reactive } from 'vue'
import { usePrompt } from '@bv3/router'

const SignupForm = defineComponent({
    setup() {
        const state = reactive({})
        const messageRef = ref('Are you sure you want to leave?')
        usePrompt(() => messageRef.value, () => state.formData !== null)
        return () => // ...
    }
})
```

`usePrompt` uses [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) on the web.

> [!Note:]
>
> If you need a more custom dialog box, you will have to use [`useBlocker`](#useblocker)
> directly and handle accessibility issues yourself.

<a name="useresolvedpath"></a>

### `useResolvedPath`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useResolvedPath(toEffect: () => To): Path
```

</details>

This hook resolves the `pathname` of the location in the given `to` value against the pathname of the current location.

This is useful when building links from relative values. For example, check out the source to [`<NavLink>`](#navlink) which calls `useResolvedPath` internally to resolve the full pathname of the page being linked to.

See [`resolvePath`](#resolvepath) for more information.

<a name="useroutes"></a>
<a name="partialrouteobject"></a>

### `useRoutes`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useRoutes(
    routesEffect: () => PartialRouteObject[],
    basenameEffect = () => string,
): () => VNode | null
```

</details>

The `useRoutes` hook is the functional equivalent of [`<Routes>`](#routes), but it uses JavaScript objects instead of `<Route>` elements to define your routes. These objects have the same properties as normal [`<Route>` elements](#route), but they don't require JSX.

The return value of `useRoutes` is a function which render the result of matched routes. You can directly invoke the function in your render function.

```tsx
import { defineComponent } from 'vue'
import { useRoutes } from '@bv3/router'

const App = defineComponent({
    setup() {
        const renderElement = useRoutes([
            {
                path: '/',
                element: <Dashboard />,
                children: [
                    { path: 'messages', element: <DashboardMessages /> },
                    { path: 'tasks', element: <DashboardTasks /> },
                ],
            },
            { path: 'team', element: <AboutPage /> },
        ])

        return () => renderElement()
    },
})
```

See also [`createRoutesFromArray`](#createroutesfromarray).

<a name="usesearchparams"></a>

### `useSearchParams`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useSearchParams(
    defaultInitEffect: () => URLSearchParamsInit,
): [
    Ref<URLSearchParams>,
    (
        nextInit: URLSearchParamsInit,
        navigateOptions?: { replace?: boolean; state?: State },
    ) => void,
]

type ParamKeyValuePair = [string, string]
type URLSearchParamsInit =
    | string
    | ParamKeyValuePair[]
    | Record<string, string | string[]>
    | URLSearchParams
```

</details>

The `useSearchParams` hook is used to read and modify the query string in the URL for the current location. `useSearchParams` returns an array of two values: the `Ref` of current location's [search params](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) and a function that may be used to update them.

```tsx
import { defineComponent } from 'vue'
import { useSearchParams } from '@bv3/router'

const App = defineComponent({
    setup() {
        let [searchParamsRef, setSearchParams] = useSearchParams()

        function handleSubmit(event) {
            event.preventDefault()
            // The serialize function here would be responsible for
            // creating an object of { key: value } pairs from the
            // fields in the form that make up the query.
            let params = serializeFormQuery(event.target)
            setSearchParams(params)
        }

        return () => (
            <div>
                <form onSubmit={handleSubmit}>{/* ... */}</form>
            </div>
        )
    },
})
```

> [!Note:]
>
> The `setSearchParams` function works like [`navigate`](#usenavigate), but
> only for the [search portion](https://developer.mozilla.org/en-US/docs/Web/API/Location/search)
> of the URL. Also note that the second arg to `setSearchParams` is
> the same type as the second arg to `navigate`.

<a name="createsearchparams"></a>

A `createSearchParams(init: URLSearchParamsInit)` function is also exported that is essentially a thin wrapper around [`new URLSearchParams(init)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams) that adds support for using objects with array values. This is the same function that `useSearchParams` uses internally for creating `URLSearchParams` objects from `URLSearchParamsInit` values.

### `defineRouteComponent`

This is a help funtion for typescript, in BestVue3 Router you can use any Component as Route, for example:

```tsx
function App() {
    return (
        <Routes>
            <Home path="/">
            <About path="/about">
        </Routes>
    )
}
```

It work exactly the same as `<Route path="/" element={<Home />}>` in javascript. But you obviously won't define the `path` prop in your compoent, in typescript this will emit type check error.

The `defineRouteComponent` have the some type declaration with `defineComponent` in Vue3 except the return component will auto contain `path` prop declaration.
