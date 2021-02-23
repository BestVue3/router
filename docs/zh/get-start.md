<a name="top"></a>

# 为什么另外一个路由库

Vue 社区已经有一个官方的路由库了，为什么需要另外一个？

怎么说呢，对于 API 的喜好每个人都会不一样吧。我是一个比较追求极致体验的人，在之前使用 React 进行开发的时候，我就是一个痴迷于**一切皆组件**的理念的人，我曾经丧心病狂地尝试封装`<Axios>`组件，通过传递 props 来获取数据，没有尝试过的同学可能不能领会这种近乎于偏执的追求。其实在 React 生态这种尝试非常常见，你任何能想象到的前端技术大概都能找到组件。

所以在后来用 Vue 的时候，就非常不习惯各种：

-   mixins
-   原型链上挂方法（说实话这是非常差的开发方式）
-   SFC

但是 Vue3 的 composition API 让我看到了希望，曾经几乎只能通过 mixin 来扩展的功能，现在有了更好的解决方案。而且我也终于可以摆脱`this`了（我真的非常讨厌`this`）。我从 19 年接触 Vue3 开始就在研究 JSX 开发方式，在 Vue3 中一切皆组件的目的并不比 React 难，但是社区并没有很多人追求这个方向，那么，**我就自己做吧。**

所以，就有了 BestVue3 Router 这个库，看完介绍相信你们就能体会到一些这种感受吧。

更多:

-   [为什么使用 JSX 开发 Vue3 应用](https://www.bestvue3.com/blogs/why-jsx)
-   [The best pratice of Vue3 effects](#TODO: url)

<a name="start"></a>

# Getting Started with BestVue3 Router

BestVue3 Router 是一个功能完备的 Vue3 客户端和服务端路由组件，一个用来构建用户界面的 JS 库。BestVue3 Router 可以在网页端和 node.js 服务端运行。

<a name="create"></a>

## Create a new BestVue3 Router app

如果你刚开始使用 Vue3，我们建议你先学习[开始 Vue3 的最佳实践](#URL)。那里有很多的信息来帮助你开始使用 Vue3。BestVue3 Router 只兼容 Vue3。

<a name="intro"></a>

## 介绍

BestVue3 Router 的核心是*route*的概念。路由代表着一个你应用中的"页面" 。BestVue3 Router 代表着内部包含 URLs 的路由器，也叫做"locations"。BestVue3 Router 让你定义用户访问路由渲染的 VNodes。

一个简单的有两个页面的网页应用，"home"和"about"可能看起来类似这样：

```tsx
import { createApp } from 'vue'
import { BrowserRouter as Router, Routes, Route } from '@bv3/router'

function App() {
    return (
        <div>
            <h1>Welcome</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
            </Routes>
        </div>
    )
}

createApp(() => (
    <Router>
        <App />
    </Router>
)).mount('#aa')
```

[`<Router>` element](./api-reference.md#router)提供当前[location]../api-reference.md#location)的信息给剩余的后代。这个例子使用[`<BrowserRouter>`](./api-reference.md#browserrouter)。你应该只渲染一个唯一的`<Router>`在你的根组件附近。

[`<Routes>` element](./api-reference.md#routes)是你用来定义有哪些路由以及当路由匹配当前路径时这个[`<Route>` element](./api-reference.md#route)应该渲染什么内容。

在这篇教程的接下去的例子中我们预设你已经引入来 Vue3 并且在`<Router>`内渲染`<App>`节点，所以我们简明地只展示需要的`<Routes>`内容。

<a name="navigation"></a>

## 导航

BestVue3 Router 提供了[一个 `Link` 组件](./api-reference.md#link)你可以用来让你的用户在不同的页面之间[导航]../api-reference.md#navigation)

```tsx
import { Routes, Route, Link } from '@bv3/router'

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <nav>
                <Link to="/">Home</Link> | <Link to="about">About</Link>
            </nav>
        </div>
    )
}

function About() {
    return <h1>About</h1>
}

function App() {
    return (
        <div>
            <h1>Welcome</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
            </Routes>
        </div>
    )
}
```

<a name="params"></a>

## 读取路径参数

你可以在你的`<Route path>` 使用动态的`:id`-类似部分来提取值用来请求数据或者渲染一些内容。[`useParams` hook](./api-reference.md#useparams)返回一个`Ref`对象，其`value`是一个包含路径参数的对象。

```tsx
import { Routes, Route, useParams } from '@bv3/router'

const Invoice = defineComponent({
    setup() {
        const paramsRef = useParams()
        return () => <h1>Invoice {paramsRef.value.invoiceId}</h1>
    },
})

function App() {
    return (
        <Routes>
            <Route path="invoices/:invoiceId" element={<Invoice />} />
        </Routes>
    )
}
```

<a name="ranking"></a>

## 模糊路径和打分

当确定哪个路由来渲染的时候，`Routes`节点选择和当前位置最匹配的路径，通常是哪些更明确的路径。

比如，`path="invoices/sent"`只会匹配`/invoices/sent`，所以他比`path="invoices/:invoiceId"`在匹配以`/invoices` (`/invoices/123`, `/invoices/cupcakes`, 等)开头的 URL 时更加明确。你可以根据你的喜好按照任意顺序组织你的代码。

```tsx
import { Routes, Route, useParams } from '@bv3/router'

function Invoice() {
    const { invoiceId } = useParams()
    return () => <h1>Invoice {invoiceId}</h1>
}

function SentInvoices() {
    return <h1>Sent Invoices</h1>
}

function App() {
    return (
        <Routes>
            <Route path="invoices/:invoiceId" element={<Invoice />} />
            <Route path="invoices/sent" element={<SentInvoices />} />
        </Routes>
    )
}
```

<a name="nesting"></a>

## 嵌套路由

Routes may be nested inside one another, and their paths will nest too. Components that are used higher in the route hierarchy may render [an `<Outlet>` element](./api-reference.md#outlet) to render their child routes.

路由可以是嵌套的，他们的路径也会是嵌套的。高层级的路由渲染的组件需要渲染[一个 `<Outlet>` 节点](./api-reference.md#outlet)来让他们的子路由可以被渲染。

```tsx
import { Routes, Route, Outlet } from '@bv3/router'

function Invoices() {
    return (
        <div>
            <h1>Invoices</h1>

            {/*
                这个节点渲染他的子路由，在这个例子中可能是 <SentInvoices> 或者 <IndividualInvoice>
            */}
            <Outlet />
        </div>
    )
}

const IndividualInvoice = defineComponent({
    setup() {
        const paramseRef = useParams()
        return () => <h1>Invoice {paramseRef.value.invoiceId}</h1>
    },
})

function SentInvoices() {
    return <h1>Sent Invoices</h1>
}

function App() {
    return (
        <Routes>
            <Route path="invoices" element={<Invoices />}>
                <Route path=":invoiceId" element={<IndividualInvoice />} />
                <Route path="sent" element={<SentInvoices />} />
            </Route>
        </Routes>
    )
}
```

注意在上面这个例子中路由是如何嵌套在父路由中的。这个嵌套的行为在创建[导航](./api-reference.md#navigation)和容器不变子内容根据路由变化的布局的时候非常有用。

```tsx
import { Routes, Route, Link, Outlet } from '@bv3/router'

function Layout() {
    return (
        <div>
            <h1>Welcome to the app!</h1>
            <nav>
                <Link to="invoices">Invoices</Link> |{' '}
                <Link to="dashboard">Dashboard</Link>
            </nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

function Invoices() {
    return <h1>Invoices</h1>
}

function Dashboard() {
    return <h1>Dashboard</h1>
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="invoices" element={<Invoices />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    )
}
```

<a name="relative-links"></a>

## 相对的链接

相对的`<Link to>`值(不以`/`开始) 是相对于渲染他们的路由的路径的。下面的两个链接指向`/dashboard/invoices`和`/dashboard/team`因为他们都是在`<Dashboard>`下渲染的。这在你修改父路径或者重新安排你的组件结构的时候非常好用因为所有你的链接自动会更新。

```tsx
import { Routes, Route, Link, Outlet } from '@bv3/router'

function Home() {
    return <h1>Home</h1>
}

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <nav>
                <Link to="invoices">Invoices</Link> <Link to="team">Team</Link>
            </nav>
            <hr />
            <Outlet />
        </div>
    )
}

function Invoices() {
    return <h1>Invoices</h1>
}

function Team() {
    return <h1>Team</h1>
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />}>
                <Route path="invoices" element={<Invoices />} />
                <Route path="team" element={<Team />} />
            </Route>
        </Routes>
    )
}
```

<a name="index-routes"></a>

## 主路由

Nested routes may use `path="/"` to indicate they should render at the path of the parent component. You can think about these routes like index pages for the rest of the child routes.

嵌套路由可以使用`path="/"`来表明他们应该在他的父路由的路径下渲染。你可以认为这些路由就像其他子路由的主页。

```tsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />}>
                <Route path="/" element={<DashboardHome />} />
                <Route path="invoices" element={<DashboardInvoices />} />
            </Route>
        </Routes>
    )
}
```

<a name="not-found-routes"></a>

## "Not Found" 路由

When no other route matches the URL, you can render a "not found" route using `path="*"`. This route will match any URL, but will have the weakest precedence so the router will only pick it if no other routes match.

当没有其他路由匹配的时候，你可以使用`path="*"`渲染一个"not found"路由。这个路由会匹配任何 URL，但也会具有最弱的优先级，所以路由器只会在找不到其他匹配的路由的情况下选择他。

```tsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
```

<a name="multiple-sets-of-routes"></a>

## 多组路由

虽然在你的应用中应该只有一个`<Router>`，你可以根据需要有多个[`<Routes>`](./api-reference.md#routes)。每个`<Routes>`独立地选择子路由进行渲染。

```tsx
function App() {
    return (
        <div>
            <Sidebar>
                <Routes>
                    <Route path="/" element={<MainNav />} />
                    <Route path="dashboard" element={<DashboardNav />} />
                </Routes>
            </Sidebar>

            <MainContent>
                <Routes>
                    <Route path="/" element={<Home />}>
                        <Route path="about" element={<About />} />
                        <Route path="support" element={<Support />} />
                    </Route>
                    <Route path="dashboard" element={<Dashboard />}>
                        <Route path="invoices" element={<Invoices />} />
                        <Route path="team" element={<Team />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </MainContent>
        </div>
    )
}
```

<a name="descendant-routes"></a>

## 后辈路由集合

你可以在任何你需要的地方渲染[`<Routes>` 节点](./api-reference.md#routes)，包括在其他`<Routes>`的子树中。除了他们会自动在渲染他们的路由的基础上构建路径之外，他们跟其他`<Routes>`一样正常工作。如果你需要这么做，_请确保在父路由的路径最后放上\*_。不然的话父路由不会匹配比他路径长的 URL，你的后辈`<Routes>`永远不会展示。

```tsx
function Dashboard() {
    return (
        <div>
            <p>Look, more routes!</p>
            <Routes>
                <Route path="/" element={<DashboardGraphs />} />
                <Route path="invoices" element={<InvoiceList />} />
            </Routes>
        </div>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard/*" element={<Dashboard />} />
        </Routes>
    )
}
```

<a name="navigating"></a>

## 编程式的导航

If you need to navigate programmatically (like after the user submits a form),
use [the `useNavigate` hook](./api-reference.md#usenavigate) to get a function you can use to navigate.

如果你需要编程式地导航（比如在用户提交表单之后），使用[`useNavigate` 钩子](./api-reference.md#usenavigate)来获取一个函数帮你进行导航。

```tsx
import { useNavigate } from '@bv3/router'

const Invoices = defineComponent({
    setup() {
        const navigate = useNavigate()
        return () => (
            <div>
                <NewInvoiceForm
                    onSubmit={async event => {
                        const newInvoice = await createInvoice(event.target)
                        navigate(`/invoices/${newInvoice.id}`)
                    }}
                />
            </div>
        )
    },
})
```

以上！这里我们还没有覆盖所有的 API，但是这些绝对是最通用的场景。如果你想要再深入学习，你可以查看[完整的 API 文档](./api-reference.md)。
