![Coverage](https://img.shields.io/codecov/c/github/BestVue3/router)
![License](https://img.shields.io/npm/l/@bv3/router)
![Version](https://img.shields.io/npm/v/@bv3/router)

Vue3 声明式路由组件。

This global version of this lib is about 5.2kb after gzipped. And the only dependencies is [history](https://github.com/ReactTraining/history), which only 1.5kb after gzipped. Little smaller than Vue-Router which is about 9.7kb after gzipped.

本库的 global 版本在 gzip 之后大概 5.2kb。唯一的依赖[history](https://github.com/ReactTraining/history)gzip 之后大概 1.5kb。些微小于 Vue-Router 的 9.7kb。

> [!注意:]
>
> 本项目仍然在重度开发中，在我们发布 1.0.0 正式版之前 API 随时可能会变化（主要式添加新的 API），你需要自己决定是否在正式项目中使用本库。

# 为什么另外一个路由库

Vue 社区已经有一个官方的路由库了，为什么需要另外一个？

主要的原因在于我们觉得 Vue 官方太过于保守。Vue3 有一个非常棒的 compisition API，他比 option API 具有太多的优势，但是因为需要兼容 Vue2，
Vue3 保留了 option API，并且 Vue-Router 也类似。这限制了 composition API 的发挥，比如*我们必须要通过对象来定义组件*等。

在我们看来，option API 不仅仅是一个不太好的实践，更是一个差的实践方式。所以我们决定对 Vue3 社区做出一些改变。这会从 BestVue3 的 Router 库开始，并且这确实只是一个开始，未来我们会尝试去做更多的事来提升 Vue3 社区的开源质量。

更多:

-   [为什么使用 JSX 开发 Vue3 应用](https://www.bestvue3.com/blogs/why-jsx)
-   [The best pratice of Vue3 effects](#TODO: url)

# 文档

-   [Get Start](./get-start.md)
-   [Api Reference](./api-reference.md)
-   [Examples](./example.md)
