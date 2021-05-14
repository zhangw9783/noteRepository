[TOC]

# Redux源码解读

## 构建一个store

```javascript
export default function createStore<
  S,
  A extends Action,
  Ext = {},
  StateExt = never
>(
  reducer: Reducer<S, A>,
  preloadedState?: PreloadedState<S> | StoreEnhancer<Ext, StateExt>,
  enhancer?: StoreEnhancer<Ext, StateExt>
): Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext {
    // -----------
    /*
     * enhancer处理
    */
    if (typeof enhancer !== 'undefined') {
        return enhancer(createStore)(
        reducer,
        preloadedState as PreloadedState<S>
        ) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
    }
    /*
     * 订阅逻辑
     * 就是用一个list来维护订阅回调，并返回卸载该订阅的函数
     * 卸载订阅的函数就是将订阅回调从维护的list删除
     */
    function subscribe(listener: () => void) {
        let isSubscribed = true
        ensureCanMutateNextListeners()
        nextListeners.push(listener)
        return function unsubscribe() {
            isSubscribed = false
            ensureCanMutateNextListeners()
            const index = nextListeners.indexOf(listener)
            nextListeners.splice(index, 1)
            currentListeners = null
        }
    }
    /**
     * dispatch定义
     * 直接将当前state和action交给reducer运行得出新的state
     * 再依次序运行订阅回调
     */
    function dispatch(action: A) {
        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }
        const listeners = (currentListeners = nextListeners)
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener()
        }
        return action
    }
    /*
     * 替换reducer，当代码分割需要异步加载reducer的时候
     * currentReducer替换成新的reducer
     * 然后再dispatch一个REPLACE
    */
    function replaceReducer<NewState, NewActions extends A>(
        nextReducer: Reducer<NewState, NewActions>
    ): Store<ExtendState<NewState, StateExt>, NewActions, StateExt, Ext> & Ext {
        ;((currentReducer as unknown) as Reducer<
            NewState,
            NewActions
        >) = nextReducer
        dispatch({ type: ActionTypes.REPLACE } as A)
        return (store as unknown) as Store<
            ExtendState<NewState, StateExt>,
            NewActions,
            StateExt,
            Ext
            > &
            Ext
    }
    /**
     * 生成一个最小量级的发布订阅方法
     * 返回一个带subscribe方法的对象
     * subscribe订阅的对象通过next方法来获取最新的state
     */
    function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer: unknown) {
        function observeState() {
          const observerAsObserver = observer as Observer<S>
          if (observerAsObserver.next) {
            observerAsObserver.next(getState())
          }
        }
        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },
      [$$observable]() {
        return this
      }
    }
  }
  // 返回store
  const store = ({
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  } as unknown) as Store<ExtendState<S, StateExt>, A, StateExt, Ext> & Ext
  return store
}
```