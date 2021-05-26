# React相关的笔记

## api大全

- Component
- PureComponent
- memo
- forwardRef
- lazy
```js
const LazyComponent =  React.lazy(()=> new Promise((resolve)=>{
      setTimeout(()=>{
          resolve({
              default: ()=> <Test />
          })
      },2000)
}))
```
- Suspense 等待某个异步操作
```js
const ProfilePage = React.lazy(() => import('./ProfilePage')); // 懒加载
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```
- Fragment 与`<></>`简写不同的是可以添加key
- Profiler 用于开发阶段测试性能
- StrictMode 严格模式，为后元素触发额外的检查和警告
- createElement
- cloneElement
- createContext 用于创建上下文
```js
const MyContext = React.createContext(defaultValue)
function ComponentB(){
    /* 用 Consumer 订阅， 来自 Provider 中 value 的改变  */
    return <MyContext.Consumer>
        { (value) => <ComponentA  {...value} /> }
    </MyContext.Consumer>
}
function ComponentA(props){
    const { name , mes } = props
    return <div> 
            <div> 姓名： { name }  </div>
            <div> 想对大家说： { mes }  </div>
         </div>
}
function index(){
    const [ value , ] = React.useState({
        name:'alien',
        mes:'let us learn React '
    })
    return <div style={{ marginTop:'50px' }} >
        <MyContext.Provider value={value}  >
          <ComponentB />
    </MyContext.Provider>
    </div>
}
```
- createRef
- isValidElement 验证是否为react element元素
- Children.map
- Children.forEach
- Children.count
- Children.toArray
- Children.only 验证是否只包含一个子节点
- useState
- useEffect
- useMemo
- useCallback 缓存函数
- useRef
- useLayoutEffect **useEffect执行顺序**: 组件更新挂载完成 -> 浏览器 dom 绘制完成 -> 执行 useEffect 回调。
**useLayoutEffect 执行顺序**: 组件更新挂载完成 ->  执行 useLayoutEffect 回调-> 浏览器dom绘制完成。
- useReducer
```js 
 const [ number , dispatchNumbner ] = useReducer((state,action)=>{
       const { payload , name  } = action
       /* return的值为新的state */
       switch(name){
           case 'add':
               return state + 1
           case 'sub':
               return state - 1 
           case 'reset':
             return payload       
       }
       return state
   },0)
```
- useContext
- useImperativeHandle
- useDebugValue React开发工具中自定义hook标签
- 17.0.2的实验阶段hook
    - useDeferredValue 返回一个延迟响应的 `const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });`
    - useTransition 允许组件切换到下一个界面之前等待内容加载
- ReactDOM.render
- ReactDOM.hydrate 服务端渲染
- ReactDOM.createPortal 将组件渲染到父组件以外的容器中
- ReactDOM.unstable_batchedUpdates 被破坏的批量更新重新批量更新
- ReactDOM.flushSync 提高回调函数中的更新的优先级
- ReactDOM.findDOMNode 用于访问组件的DOM元素
- ReactDOM.unmountComponentAtNode 从DOM中卸载组件

## 高阶组件

> 参数为一个组件，返回值也是一个组件的组件。

## React源码解读

- [React原理解析](https://yuchengkai.cn/react/#%E4%BB%8B%E7%BB%8D)