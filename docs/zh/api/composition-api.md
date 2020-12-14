# Composition API

`@pure-vue/router`提供了一些 Composition API 来帮助我们便捷得扩展路由功能：

-   useHistory
-   useLocation
-   useSearchParams
-   useNavigate
-   useHref
-   usePrompt
-   useRouteContext
-   useOutlet
-   useParams
-   useResolvedPath
-   useBlocker

**注意：**因为 Vue3 的响应式机制，我们的 hooks 大部分情况下都是返回一个`Ref`对象，让我们在使用过程中能保证响应式。

## useHistory

`useHistory`是最顶层的 hook，通过这个 API 你可以获取到所有路由相关的数据，大部分时候你不需要直接使用这个 API，我们会有其他更直接提供具体功能的 hooks 来帮组你构建应用

```jsx
import { useHistory } from '@pure-vue/router'

const MyRoute = defineComponent({
    setup() {
        const historyRef = useHistory()

        return () => {
            const { location } = historyRef.value

            return <div>Here you are: {location.pathname}</div>
        }
    },
})
```

## useLocation

`useLocation`返回一个对应当前 url 的 location 对象，你可以通过他来获取页面路由的变化，这在一些需要记录每个页面访问的场景尤其有用

```jsx
import { useLocation } from '@pure-vue/router'

function loggerPageView() {
    const locationRef = useLocation()

    watchEffect(() => {
        ga.send(["pageview", locationRef.value.pathname]);
    })
}

const App = defineComponent({
    setup() {
        loggerPageView()

        return () => (
            <Router>
                <Routes>
                    {...your routes}
                </Routes>
            </Router>
        )
    }
})
```

每次路由变化，`watchEffect`都会执行并把页面访问请求发送给`ga`进行统计

## useSearchParams

`useSearchParams` 使用 `URLSearchParams` 来操作 Search 参数，如果你需要支持一些不支持该 API 的浏览器，你可以参考[https://github.com/ungap/url-search-params](https://github.com/ungap/url-search-params)来为你的项目增加`polyfill`。该 API 返回当前路由的所有`SearchParams`以及一个更新`SearchParams`的函数

```jsx
import { useSearchParams } from '@pure-vue/router'

const App = defineComponent({
    setup() {
        const [searchParamsRef, setSearchParams] = useSearchParams()

        function updateId(e) {
            setSearchParams({
                ...searchParamsRef.value,
                id: e.target.value,
            })
        }

        return () => {
            return <input value={searchParamsRef.value.id} onInput={updateId} />
        }
    },
})
```

**注意：**`setSearchParams`最终会导致路由的变化，以上例子只是用于展示，并不是最好的实践

## useNavigate

`useNavigate`返回一个帮助你跳转路由的函数，你可以通过调用这个函数来跳转你的路由，这个 hook 是直接返回函数本身的而不是`Ref`，因为函数本身不保存状态

```jsx
import { useNavigate } from '@pure-vue/router'

const App = defineComponent({
    setup() {
        const navigate = useNavigate()

        function goHome() {
            navigate('/home')
        }

        return () => {
            return <button onClick={goHome}>Go to Home</button>
        }
    },
})
```

`navigate`接收两个参数个参数

#### to

一个描述路由的对象，字符串路径或者一个数字表示向前或者向后跳转

```ts
navigate({
    pathname?: Pathname;
    search?: Search;
    hash?: Hash;
})

// or

navigate('/you/path')

// or

navigate(2)
```

#### options

一个描述跳转方式的对象

```js
{ replace?: boolean; state?: State }
```

## useHref

`useHref`帮助我们根据`To`来获取完整的路由路径，在我们需要创建自己的`Link`组件的时候非常有用，因为你需要考虑你的组件是否在其他路由下，所以最终路径需要考虑父路径

```jsx
import { useHref } from '@pure-vue/router'

const CustomLink = defineComponent({
    setup() {
        const state = reactive({
            path: '',
        })

        const hrefRef = useHref(() => state.path)

        function updatePath(e) {
            state.path = e.target.value
        }

        return () => <input value={state.path} onInput={updatePath} />
    },
})
```

**注意：**我们这里传给`useHref`使用的是函数，而非直接传递`state.path`，这是有意义的，你在后面很多地方都会看到这样的用法。这依然跟 Vue3 的响应式原理有关，我们需要保持对`state.path`的跟踪，如果直接执行`useHref(state.path)`会导致后续对`path`的更新无法更新`hrefRef`。如果你对于响应式原理有疑惑，可以看文章[深度理解 Vue3 的响应式原理]()

## usePrompt
