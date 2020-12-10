# 快速上手

我们极度推荐使用 jsx 进行 vue3 开发，你可以查看我们[如何使用 jsx 开发 vue3]()来进行学习。该项目的测试和 demo 项目都是通过 jsx 进行开发的，我们会优先保证 jsx 开发方式的正确性，理论上我们的 API 是完全兼容 SFC 的，但是目前我们并没有进行全面的测试。

你需要创建一个 vue3 应用来使用`@pure-vue/router`，你可以通过[vue-cli]()来搭建项目，这是 vue 官方的一个项目创建工具，使用方便功能强大。

```bash
npm i -g @vue/cli
vue create pure-vue-router-demo
```

然后你需要安装本库到你的项目

```bash
npm i @pure-vue/router -S
// or yarn
yarn add @pure-vue/router
```

## 最简单用法

通过`Routes`包含路由节点，我们就可以在根据实际路径匹配对应节点。当路由匹配`/home`时，`<Home />`会被渲染，对应的当路由匹配`/about`时，`<About />`会被渲染

```jsx
<Routes>
    <Route path="home" element={<Home />} />
    <Route path="about" element={<About />} />
</Routes>
```

## 嵌套路由

嵌套路由是非常常见的需求，在`@pure-vue/router`中可以非常简单实现。只需要在具体的路由下面添加嵌套的`Route`节点就可以，需要注意的是我们在这里把`about`路由的`path`改为了`about/*`。这是必要的，我们需要告知路由不仅仅只匹配`/about`而应该把以`/about`开头的所有路由都匹配，这样才能正确渲染出`<About />`和其子内容。

```jsx
<Routes>
    <Route path="home" element={<Home />} />
    <Route path="about/*" element={<About />}>
        <Route path="me" element={<AboutMe>} />
    </Route>
</Routes>
```

另外一点我们需要决定在`<About />`中你在什么地方放置子路由节点，这个实现非常简单，我们提供了`Outlet`组件，该组件所处的位置即为子路由的内容展示的位置，你可以根据你的实际需求把它放在任何地方。

```jsx
import { Outlet } from '@pure-vue/router'

// your About component
function About() {
    return <div>
        <YourContentHere />
        <Outlet />
        <YourContentAfter>
    </div>
}
```

## 你甚至可以不使用`Route`

我们把上面的例子可以非常简单地替换为下面的例子，你不需要做任何的其他改动，他们就能生效。下面这个例子和上面的例子结果是一模一样的

```jsx
<Routes>
    <Home path="home" />
    <About path="about/*">
        <AboutMe path="me" />
    </About>
</Route>
```

这就是`@pure-vue/router`的神奇所在，一眼就能看明白的路由结构以及及其简约的代码。

## 继续深入

以上是最基本的使用方法，我们还提供了一系列非常好用又简单的工具来帮组你快速搭建一个高可维护性的前端应用。继续探索来发现`@pure-vue/router`的神奇之处吧。
