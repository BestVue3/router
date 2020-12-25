# Version 0.0.4

-   Reduce built files to 5.22kb
-   Move _**tests**_ out of lib
-   We can switch unit tests from using build output
-   Build process now match with Vue3
-   `<Route>` support use `slots.element` as content, this make `<Route>` used in SFC simpler, since in SFC pass `VNode` as props is not quite convenience
-   `element` prop and slot in `<Route>` support function, it will have better performence in vue3.
