# Path

`@pure-vue/router`中的路径表示非常的简单，你可以跟 Linux 系统中的路径进行类比，以斜杠开头的`/path`可以理解为绝对路径，没有斜杠开头的`path`则类似相对路径，其完整路径取决于父级的路径，同时你还可以使用`.`表示当前路径，`..`表示上一个路径

```jsx
<Routes>
    <Route path="/a" element={<Parent />}>
        <Route path="/b" element={<Child />} />
    </Route>
</Routes>
```
