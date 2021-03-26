<a name="top"></a>

# BestVue3 Router API 文档

BestVue3 Router is a collection of [Vue3 components](https://v3.vuejs.org/guide/component-registration.html), [Composition API(also known as hooks)](https://v3.vuejs.org/api/composition-api.html) and utilities that make it easy to build multi-page applications with [Vue3](https://v3.vuejs.org). This reference contains the function signatures and return types of the various interfaces in BestVue3 Router.

BestVue3 Router 是一系列帮助构建 Vue3 多页应用的[Vue3 组件](https://v3.vuejs.org/guide/component-registration.html)，[Composition API(也有叫 hooks)](https://v3.vuejs.org/api/composition-api.html)和工具方法集合。这个文档包含 BestVue3 Router 中包含的组件的 Props 定义，函数签名以及返回类型。

> [!提示:]
>
> 你可以前往 [examples 页面] ](./examples.md) 来查看更多具有代表性的如何深度使用 BestVue3 Router 的例子

<a name="overview"></a>

## Overview

<a name="install"></a>

### Install

BestVue3 Router 在 npm 的包名为`@bv3/router`:

```bash
npm i @bv3/router -S
```

or using yarn

```bash
yarn add @bv3/router
```

<a name="setup"></a>

### 配置

想要在你的应用里面使用 BestVue3 Router，你需要在你的根节点附近渲染一个 _路由器(router)_ 节点。我们提供了几种不同的路由器，你可以根据你的需要场景来使用。

-   [`<BrowserRouter>`](#browserrouter) or [`<HashRouter>`](#hashrouter) 应该在浏览器中使用。具体选择哪个在于你希望你的 URL 如何呈现。
-   [`<StaticRouter>`](#staticrouter) 应该在服务端渲染的时候使用
-   [`<MemoryRouter>`](#memoryrouter) 在测试场景非常有用，他是一个参考其他路由器的实现。

这些路由器提供为 BestVue3 Router 在不同的环境运行提供上下文。他们都在内部渲染[一个`<Router>`](#router)节点，你也可以使用`<Router>`如果你希望更加细粒度地控制路由器。但是大概率内置的路由器就是你需要的了。

<a name="routing"></a>

### 路由

路由决定了在你的应用中某个页面应该渲染哪个 BestVue3 的节点，以及他们如何嵌套。BestVue3 Router 提供两种方式来声明你的路由路线。

-   [`<Routes>` and `<Route>`](#routes-and-route) 如果你希望使用组件
-   [`useRoutes`](#useroutes) 如果你更喜欢使用 JS 对象

如果你有需要构建你自己的高级接口，一些我们内部使用的低级 API 同样在开放 API 中导出了。

-   [`matchPath`](#matchpath) - 根据 URL 匹配路径
-   [`matchRoutes`](#matchroutes) - 根据[location](#location)匹配一系列路由路线
-   [`createRoutesFromArray`](#createroutesfromarray) - 根据一组 JS 对象生成路由配置
-   [`createRoutesFromChildren`](#createroutesfromchildren) - 根据一组 VNodeChild 节点(也即 [`<Route>`](#route) 节点)创建路由配置

<a name="navigation"></a>

### Navigation

BestVue3 Router 的导航接口让你可以通过修改当前的位置信息来切换当前渲染的页面。根据你的需求，我们提供了两种主要的导航方式。

-   [`<Link>`](#link) 渲染一个无障碍的`<a>`节点。这让用户通过点击页面上的节点来切换路由。
-   [`useNavigate`](#usenavigate) and [`<Navigate>`](#navigate) 让你可以以变成的方式来导航，通常在事件处理器或者一些状态变化之后使用。

如果你需要构建你自己的导航接口，我们也提供了一些低级 API。

-   [`useResolvedPath`](#useresolvedpath) - 根据当前位置信息决定一个相对路径的最终路径[location](#location)
-   [`useHref`](#usehref) - 决定一个相对路径适用于`<a href>`
-   [`resolvePath`](#resolvepath) - 根据给定的 URL 地址决定一个相对路径

<a name="confirming-navigation"></a>

### 导航二次确认

有时候在在进行导航之前你需要进行二次确认。比如说，如果你的用户已经在当前页面的表单中输入了一些内容，你应该希望在他们跳转到其他页面之前提醒他们保存数据。

-   [`usePrompt`](#useprompt) and [`<Prompt>`](#prompt) 当用户想要从当前页面跳转时触发一个平台原生的提示
-   [`useBlocker`](#useblocker) 是一个低级 API，他让你在用户想要跳转的时候保持页面不动，并且执行一个你给定的函数。

<a name="search-parameters"></a>

### Search Parameters

通过[the `useSearchParams` hook](#usesearchparams)调用 URL 的[搜索参数](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)。

---

<a name="reference"></a>

## Reference

<a name="browserrouter"></a>

### `<BrowserRouter>`

<details>
  <summary>Props 定义</summary>

```tsx
const BrowserRouterProps = {
    window: Object as PropType<Window>,
} as const
```

</details>

在浏览器环境中，`<BrowserRouter>`是更推荐的接口。一个`<BrowserRouter>` 保存浏览器地址栏中当前的位置信息，并且通过浏览器原生的 history 栈来进行导航切换。

`<BrowserRouter window>` defaults to using the current [document's `defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView), but it may also be used to track changes to another's window's URL, in an `<iframe>`, for example.

`<BrowserRouter window>`默认使用当前的[文档的 `defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView)，但他同样可以用来追踪其他窗口的变化，比如一个`<iframe>`。

```tsx
import { createApp } from 'vue'

createApp(() => <BrowserRouter>{/* 你的APP在这里渲染 */}</BrowserRouter>).mount(
    '#app',
)
```

<a name="hashrouter"></a>

### `<HashRouter>`

<details>
  <summary>Props 定义</summary>

```tsx
const HashRouterProps = {
    window: Object as PropType<Window>,
} as const
```

</details>

`<HashRouter>`会在浏览器 URL 不应该（或者不能）发送到服务器的场景下使用。这会发生在你不能完全控制服务器的情况下。在这种情况下，`<HashRouter>`可以把当前位置信息存储在 URL 的`hash`部分，所以不会请求服务端。

`<HashRouter window>`默认使用当前的[文档的 `defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView)，但他同样可以用来追踪其他窗口的变化，比如一个`<iframe>`。

```tsx
import { createApp } from 'vue'

createApp(() => <HashRouter>{/* 你的APP在这里渲染 */}</HashRouter>).mount(
    '#app',
)
```

<a name="memoryrouter"></a>

### `<MemoryRouter>`

<details>
  <summary>Props 定义</summary>

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

一个`<MemoryRouter>`把位置信息存储在内部的数组里面。跟`<BrowserHistory>` 和 `<HashHistory>`不同，他并不绑定到任何类似浏览器的 history 栈这样的外部资源上。这对于一些你希望完全控制 history 栈的情况非常得理想，比如测试场景。

-   `<MemoryRouter initialEntries>` 默认是 `["/"]` (单一入口的根 `/` URL)
-   `<MemoryRouter initialIndex>` 默认是 `props.initialEntries` 上的最后一个。

> [!提示:]
>
> 大部分 BestVue3 Router 的测试是通过`<MemoryRouter>`实现的，
> 所以你可以通过[查看我们的测试用例](https://github.com/BestVue3/router/tree/master/lib/__tests__).看到很多非常棒的例子

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
  <summary>Props 定义</summary>

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

一个`<Link>`让用户可以通过点击或者触碰他来导航到另外一个页面。一个`<Link>`渲染一个具有真实指向目标资源`href`的无障碍的`<a>`节点。这意味着在`<Link>`上的右键操作可以正常工作。

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

一个相对的`<Link to>`值（不以`/`开始）由他的父路由决定，这意味着他的路径是在渲染这个`<Link>`节点的路由节点的基础上构建的。他可以包含`..`来链接到上级的路由。在这些场景下，`..`和命令行的`cd`函数工作方式一摸一样；每个`..`删除一断父路径。

> [!注意:]
>
> 包含`..`的`<Link to>`和普通的`<a href>`在当前 URL 以`/`结尾的时候行为不一样。
> `<Link to>`会忽略斜杠然后每个`..`会删除一段 URL。
> 但是`<a href>`在当前 URL 是否以`/`结尾的情况处理`..`的方式不一样。

<a name="navigate"></a>

### `<Navigate>`

<details>
  <summary>Props 定义</summary>

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

一个`<Navigate>`节点在他渲染的时候就会渲染当前的位置。他是[`useNavigate`](#usenavigate)的一个包装，并且接收所有相同的参数。

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
  <summary>Props 定义</summary>

```tsx
const OutletProps = {} as const
```

</details>

一个`<Outlet>`应该用在父路由节点中用来渲染他们的子路由节点。这允许嵌套的 UI 在子路由渲染的时候得以展现。如果父路由完全匹配，则他不会渲染任何内容。

```tsx
function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>

            {/* 这个节点在URL是"/messages"时渲染<DashboardMessages>，
                在URL是"/tasks"时渲染<DashboardTasks>，
                在URL是"/"时渲染null
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
  <summary>Prompt 定义</summary>

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

`<Prompt>`是声明式版本的[`usePrompt`](#useprompt)。他不渲染任何内容。他只通过他的 props 来调用`usePrompt`

<a name="router"></a>

### `<Router>`

<details>
  <summary>Props 定义</summary>

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

`<Router>` 是所有路由器([`<BrowserRouter>`](#browserrouter), [`<HashRouter>`](#hashrouter), [`<StaticRouter>`](#staticrouter)组件共享的接口。在 Vue3 中，`<Router>`是一个给整个 APP 提供路由上下文信息的[context provider](https://v3.vuejs.org/api/composition-api.html#provide-inject)

你也许永远不需要手动渲染一个`<Router>`。你应该根据你的场景使用一个高级路由器。你在你的应用中永远只需要一个路由器。

<a name="routes"></a>
<a name="route"></a>
<a name="routes-and-route"></a>

### `<Routes>` and `<Route>`

<details>
  <summary>Props 定义</summary>

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

`<Routes>` 和 `<Route>`是在 BestVue3 Router 中基于当前[`location`](#location)渲染一些内容的主要方式。你可以认为一个`<Route>`类似一个`if`条件判断；如果他的`path`匹配当前的 URL，他会渲染他的`element`属性或者插槽！`<Route caseSensitive>`属性决定匹配方式是否应该大小写敏感（默认为`false`）。

Whenever the location changes, `<Routes>` looks through all its `children` `<Route>` elements to find the best match and renders that branch of the UI. `<Route>` elements may be nested to indicate nested UI, which also correspond to nested URL paths. Parent routes render their child routes by rendering an [`<Outlet>`](#outlet).

每当位置变化，`<Routes>`会从所有的`children` `<Route>`中查找节点定最匹配的并渲染其 UI。`<Route>` 节点可以是嵌套来表示嵌套 UI，同时也表示嵌套的 URL 路径。父路由通过[`<Outlet>`](#outlet)来渲染他们的子路由。

```tsx
<Routes>
    <Route path="/" element={<Dashboard />}>
        <Route path="messages" element={<DashboardMessages />} />
        <Route path="tasks" element={<DashboardTasks />} />
    </Route>
    <Route path="about" element={<AboutPage />} />
</Routes>
```

> [!注意:]
>
> 如果相比 JSX 你更喜欢通过 JS 对象来定义你的路由，[尝试`useRoutes`](#useroutes)

默认的`<Route element>`是一个 [`<Outlet>`](#outlet)。这意味着即便没有声明`element`属性，路由仍然会渲染他们的子节点，所以你可以不需要嵌套 UI 也可以嵌套路由路径。

For example, in the following config the parent route renders an `<Outlet>` by default, so the child route will render without any surrounding UI. But the child route's path is `/users/:id` because it still builds on its parent.

举个例子，在下面的配置中父路由默认渲染一个`<Outlet>`，所以他的子路由在没有其他 UI 包含的情况下仍然会渲染。但是子路由的路径是`/users/:id`因为他的路径仍然是在父路由的基础上构建的。

```tsx
<Route path="users">
    <Route path=":id" element={<UserProfile />} />
</Route>
```

你可以给`<Route>`传递`keepalive`来控制该路由在跳转之后是否被保存。
在一个组件被卸载时你想要保持他的状态和其子树的状态时，KeepAlive 是一个非常有用的功能。
我们通过把路由渲染在`<KeepAlive>`下来实现这个功能。我们觉得这种实现方式显然更加自然。

```tsx
<Routes>
    <Route path="stay" element={<Kept />} keepalive />
    <Route path="leave" element={<Lost />}>
</Route>
```

> [!注意:]
>
> 之前的例子都是使用 JSX 作为语法，在 JSX 中传递 VNode 非常的简单
> 但是我们认为在很长一段时间里，很多开发者仍然会选择使用 SFC 进行开发
> 所哟我们提供了 slot 方式来传递`element`

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
  <summary>Props 定义</summary>

```tsx
const StaticRouterProps = {
    location: {
        type: [String, Object] as PropType<string | Record<string, any>>,
        default: '/',
    },
} as const
```

</details>

`<StaticRouter>`是用来在[node](https://nodejs.org)环境中渲染 BestVue3 Router 前端应用的。通过`location`属性来提供当前的位置。`<StaticRouter location>` 默认路径是 `"/"`

```tsx
import { renderToString } from '@vue/server-renderer'
import { StaticRouter } from '@bv3/router'
import http from 'http'

async function requestHandler(req, res) {
    let html = await renderToString(
        <StaticRouter location={req.url}>{/* 你的应用在这里 */}</StaticRouter>,
    )

    res.write(html)
    res.end()
}

http.createServer(requestHandler).listen(3000)
```

<a name="createroutesfromarray"></a>

### `createRoutesFromArray`

<details>
  <summary>函数定义</summary>

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

`createRoutesFromArray`是一个帮助补充路由对象数组（可能的）缺失部分的方法。他在[`useRoutes`](#useroutes)中被用来创建路由对象。

<a name="createroutesfromchildren"></a>

### `createRoutesFromChildren`

<details>
  <summary>函数定义</summary>

```tsx
declare function createRoutesFromChildren(children: VNodeChild): RouteObject[]
```

</details>

`createRoutesFromChildren`是一个帮助通过 VNodes 来创建路由对象的方法。他在[`<Routes>` element](#routes)内部被用来从他的[`<Route>`](#route)子节点中创建路由对象。

类似的有 [`createRoutesFromArray`](#createroutesfromarray).

<a name="generatepath"></a>

### `generatePath`

<details>
  <summary>函数定义</summary>

```tsx
declare function generatePath(path: string, params: Params = {}): string
```

</details>

`generatePath` interpolates a set of params into a route path string with `:id` and `*` placeholders. This can be useful when you want to eliminate placeholders from a route path so it matches statically instead of using a dynamic parameter.

`generatePath`对具有`:id`和`*`的路由路径进行参数的插值。这在你需要从一个路由路径中消除占位符来实现静态地匹配而不是动态参数的时候很有用。

```tsx
generatePath('/users/:id', { id: 42 }) // "/users/42"
generatePath('/files/:type/*', { type: 'img', '*': 'cat.jpg' }) // "/files/img/cat.jpg"
```

<a name="location"></a>

### `Location`

在 BestVue3 Router 中"location"定义就是[history](https://github.com/ReactTraining/history)库中的[`Location`接口](https://github.com/ReactTraining/history/blob/master/docs/api-reference.md#location)。

> [!注意:]
>
> history 模块是 BestVue3 Router 的主要依赖
> BestVue3 Router 中的很多核心类型都是从 history 库中直接导出的
> 包括`Location`， `To`， `Path`， `State`，和一些其他的。
> 你可以从[他的文档](https://github.com/ReactTraining/history/tree/master/docs)中获取更多信息。

<a name="matchroutes"></a>

### `matchRoutes`

<details>
  <summary>函数定义</summary>

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

`matchRoutes` 在一组路由和给定的[`location`](#location)之间进行路由匹配算法来找到哪些路由匹配。如果他找到了匹配的，一组`RouteMatch`对象会被返回，每一项代表一个匹配的路由。

这是 BestVue3 Router 的核心匹配算法。他在[`useRoutes`](#useroutes)和 [`<Routes>` component](#routes)内部都被用来决定哪些路由匹配当前的位置。他也可能在某些你需要手动匹配路径的地方产生作用。

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

`matchPath` 匹配路由的路径正则和 URL 然后返回匹配信息。这在任何你想要手动运行路由器的匹配算法来决定路由路径是否匹配的时候都很有用。如果正则不匹配给定的路径则返回`null`。

[`useMatch` hook](#usematch) 在内部使用这个方法来匹配一个路由路径和当前的位置。

<a name="resolvepath"></a>

### `resolvePath`

<details>
  <summary>函数定义</summary>

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

`resolvePath`处理给定的`To`值到一个真实的包含绝对`pathname`的`Path`对象。这在你需要从一个相对的`To`值获取准确准确的路径的时候很有用。举个例子，`<Link>`组件使用这个函数来获取他指向的真实的 URL。

The [`useResolvedPath` hook](#useresolvedpath) uses `resolvePath` internally to resolve against the current `location.pathname`.

[`useResolvedPath` hook](#useresolvedpath)在内部使用`resolvePath`来根据当前`location.pathname`进行处理。

<a name="useblocker"></a>

### `useBlocker`

<details>
  <summary>函数定义</summary>

```tsx
declare function useBlocker(blocker: Blocker, getWhen: () => boolean): void
```

</details>

`useBlocker` 是一个低级的 hook 来允许你阻止路由从当前页面跳转，也即阻止当前的位置变化。除非你同时展示了一个提醒弹窗让你的用户明白为什么他们的跳转尝试被阻止了，不然你也许不应该这么做。在这些场景下，你也许会更愿意使用[`usePrompt`](#useprompt) 或者 [`<Prompt>`](#prompt)

<a name="usehref"></a>

### `useHref`

<details>
  <summary>函数定义</summary>

```tsx
declare function useHref(toEffect: () => To): string
```

</details>

`useHref`给定的`to`位置返回一个可能会被用来进行链接的 URL，即便在 BestVue3 Router 之外。

> [!提示:]
>
> 你也行会对看一下`@bv3/router`中的`<Link>`组件的来了解他如何在内部使用`useHref`
> 来确定他的`href`值感兴趣。

<a name="uselocation"></a>

### `useLocation`

<details>
  <summary>函数定义</summary>

```tsx
declare function useLocation(): Location
```

</details>

这个钩子返回当前的[`location`](#location)对象。这在你如果需要根据当前位置的变化来执行一些副作用（函数）的时候很有用。

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
  <summary>函数定义</summary>

```tsx
declare function useMatch(pattern: PathPattern): PathMatch | null
```

</details>

返回一个给定相对路径和当前位置的路由匹配的对象。

可以在[`matchPath`](#matchpath)查看更多信息。

<a name="usenavigate"></a>

### `useNavigate`

<details>
  <summary>函数定义</summary>

```tsx
declare function useNavigate(): NavigateFunction

interface NavigateFunction {
    (to: To, options?: { replace?: boolean; state?: State }): void
    (delta: number): void
}
```

</details>

`useNavigate`钩子返回一个让你可以手动跳转的函数，比如当一个表单提交完成之后。

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

`navigate`函数有两个签名：

-   一是传递一个`To`值（和`<Link to>`一样）和一个可选的第二个`{ replace, state }`参数，或者
-   传递你想到达的 history 栈的层数。比如，`navigate(-1)`和点击返回按钮是对等的。

<a name="useoutlet"></a>

### `useOutlet`

<details>
  <summary>函数定义</summary>

```tsx
declare function useOutlet(): Ref<VNode | null>
```

</details>

返回路由层级中子路由的节点。这个钩子在[`<Outlet>`](#outlet)内部用来渲染子路由。

<a name="useparams"></a>

### `useParams`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useParams(): Ref<Params>
```

</details>

`useParams` 钩子返回匹配的`<Route path>`在当前的 URL 上的动态参数的 key/value 对象。子路由继承所有父路由的参数。

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
  <summary>函数定义</summary>

```tsx
declare function usePrompt(
    messageEffect: () => string,
    whenEffect: () => boolean,
): void
```

</details>

`usePrompt`钩子会被用来在用户从当前跳转进行二次确认。在用户输入了一些没有保存的表单数据，当他们意外地离开或者关闭 tab 的时候你希望提醒他们这会导致他们丢失之前的工作的时候很有用。

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

`usePrompt`使用在网页端使用[`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm)。

> [!注意:]
>
> 如果你需要一个自定义的弹窗，你需要直接使用[`useBlocker`](#useblocker)
> 同时你需要自己处理无障碍需求

<a name="useresolvedpath"></a>

### `useResolvedPath`

<details>
  <summary>Type declaration</summary>

```tsx
declare function useResolvedPath(toEffect: () => To): Path
```

</details>

这个钩子根据当前的位置和给定的`to`值来获取`pathname`。

这在根据相对值来构建链接的时候很有用。比如，你可以查看[`<NavLink>`](#navlink) 的源码，他内部调用`useResolvedPath`来获取他链接到的页面的完整路径。

阅读[`resolvePath`](#resolvepath)来获取更多信息。

<a name="useroutes"></a>
<a name="partialrouteobject"></a>

### `useRoutes`

<details>
  <summary>函数定义</summary>

```tsx
declare function useRoutes(
    routesEffect: () => PartialRouteObject[],
    basenameEffect = () => string,
): () => VNode | null
```

</details>

`useRoutes`钩子是函数版本的[`<Routes>`](#routes)，他通过 JS 对象而不是`<Route>`节点来定义你的路由。这些对象和[`<Route>` elements](#route)有相同的属性，但是他们不需要 JSX。

`useRoutes`返回的是一个渲染匹配的路由结果的函数。你可以在你组件的渲染函数内直接调用这个函数。

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

查看类似的[`createRoutesFromArray`](#createroutesfromarray).

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

`useSearchParams`钩子用来读取和修改当前位置 URL 的搜索参数。`useSearchParams`返回一个包含两个值的数组，当前位置[搜索参数](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams)的`Ref`对象和一个用来更新他们的函数。

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
> `setSearchParams` 函数和[`navigate`](#usenavigate)相似，
> 但只修改 URL 的[search portion](https://developer.mozilla.org/en-US/docs/Web/API/Location/search)。
> 同时注意`setSearchParams`的第二个参数和`navigate`的第二个参数是一样的。

<a name="createsearchparams"></a>

A `createSearchParams(init: URLSearchParamsInit)` function is also exported that is essentially a thin wrapper around [`new URLSearchParams(init)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams) that adds support for using objects with array values. This is the same function that `useSearchParams` uses internally for creating `URLSearchParams` objects from `URLSearchParamsInit` values.

我们同样导出了`createSearchParams(init: URLSearchParamsInit)`函数，他是一个[`new URLSearchParams(init)`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams)的简单封装来增加对数组值的支持。这和`useSearchParams`内部通过`URLSearchParamsInit`来创建`URLSearchParams`对象的方法是一样的。

### `defineRouteComponent`

这是一个 typescript 的帮助方法，在 BestVue3 Router 你可以把任何组件当作路由组件，比如：

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

这和`<Route path="/" element={<Home />}>`是一模一样的。但是你显然不会主动定义`path`在你的组件 props，在 typescript 中这会导致类型检查错误。

`defineRouteComponent`和 Vue3 的`difineComponent`有一样的定义，除了返回的组件会自动增加`path` prop 定义。
