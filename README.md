![Coverage](https://img.shields.io/codecov/c/github/BestVue3/router)
![License](https://img.shields.io/npm/l/@bv3/router)
![Version](https://img.shields.io/npm/v/@bv3/router)

[中文文档](./docs/zh/README.md)

Declarative routing for Vue3.

The global version of this lib is about 5.2kb after gzipped. And the only dependencies is [history](https://github.com/ReactTraining/history), which only 1.5kb after gzipped. Little smaller than Vue-Router which is about 9.7kb after gzipped.

> [!Note:]
>
> This project is still under heavy development, the main API may change (mostly add new API) before we reach the
> stable version which is `1.0.0`. You should decided yourself if using this module in your production project.

# Why another Router Library

Vue community already had an official router library, why another one?

The main reasoin is that we think Vue official is far too conservative. Vue3 contain a great composition API which have much more benefits then option API, but in order to be compatible with Vue2, Vue3 keep the option API and also Vue-Router will do the same thing. This bring some limition of using composition API like _we have to use object to define component_ etc.

And we are more interested about using JSX as syntax to develop Vue3 application. The React Router API will is more suitable for JSX then Vue-Router. We also not recommend `Vue.use()` to merge a plugin, althrough `Vue.use()` also did add `provide` location info to the rest of app, it will make people fill like they stil using mixin (Vue-Router actually add `app.config.globalProperties.$router` to compatible the usage of Vue2).

# Documentation

-   [Get Start](./docs/en/get-start.md)
-   [Api Reference](./docs/en/api-reference.md)
-   [Examples](./docs/en/example.md)
