<a name="v0-1-3"></a>

# Version 0.1.3

-   `useRoutes` use default `basenameEffect` as `() => ''`
-   type accepted as `VNode` also accept `JSX.Element` so that it worked in JSX

<a name="v0-1-2"></a>

# Version 0.1.2

-   Fix `<useBlocker>` confirm forever bug
-   Fix the usage of `watchEffect`, unlike `useEffect` in React, `watchEffect` accepe an `onInvalidate` to perform unbind _effet_

<a name="v0-1-1"></a>

# Version 0.1.1

-   Fix `<Route>` not update issue in SFC, see [https://github.com/vuejs/vue-next/issues/2893](https://github.com/vuejs/vue-next/issues/2893).
-   Update Chinese documentation.

<a name="v0-1-0"></a>

# Version 0.1.0

-   Reduce built files to 5.22kb
-   Move tests out of lib
-   We can switch unit tests from using build output
-   Build process now match with Vue3
-   `<Route>` support use `slots.element` as content, this make `<Route>` used in SFC simpler, since in SFC pass `VNode` as props is not quite convenience
-   `element` prop and slot in `<Route>` support function, it will have better performence in vue3.
