![Coverage](https://img.shields.io/codecov/c/github/BestVue3/router)
![License](https://img.shields.io/npm/l/@bv3/router)
![Version](https://img.shields.io/npm/v/@bv3/router)

Vue3 声明式路由组件。

本库的 global 版本在 gzip 之后大概 5.2kb。唯一的依赖[history](https://github.com/ReactTraining/history) gzip 之后大概 1.5kb。些微小于 Vue-Router 的 9.7kb。

> [!注意:]
>
> 本项目仍然在重度开发中，在我们发布 1.0.0 正式版之前 API 随时可能会变化（主要式添加新的 API），你需要自己决定是否在正式项目中使用本库。

[视频教程](https://www.bilibili.com/video/BV145411n7tS/)

# 为什么另外一个路由库

Vue 社区已经有一个官方的路由库了，为什么需要另外一个？

主要的原因在于我们觉得 Vue 官方太过于保守。Vue3 有一个非常棒的 compisition API，他比 option API 具有太多的优势，但是因为需要兼容 Vue2，
Vue3 保留了 option API，并且 Vue-Router 也类似。这限制了 composition API 的发挥，比如*我们必须要通过对象来定义组件*等。

我们对使用 JSX 开发 Vue3 的应用更感兴趣。React Router 的 API 相比 Vue-Router 更适合 JSX 语法。我们不推荐使用`Vue.use()`来合并一个插件，虽然`Vue.use()`和我们提供的`<BrowserRouter>`都是使用`provide`来对应用提供位置信息，这种用法会让用户觉得他们仍然在使用 mixin（Vue-Router 实际上还在`app.config.globalProperties.$router`挂载了路由对象来兼容 Vue2 的使用方式）。

更多:

-   [为什么使用 JSX 开发 Vue3 应用](https://www.bestvue3.com/blogs/why-jsx)
-   [The best pratice of Vue3 effects](#TODO: url)

# 文档

-   [Get Start](./get-start.md)
-   [Api Reference](./api-reference.md)
-   [Examples](./examples.md)
