## bindview-hashrouter

`bindview-hashrouter.js` 是基于 `bindview.js` 的路由工具库其中包含了 `Switch` `Link` 两个组件，还有一个 `Url` 对象有一些常用的方法，

**该路由工具库是基于 hash 路由的所以 a 标签不要使用锚点功能** 

<hr />

### Switch 路由组件

`Switch` 是基于动态组件创建的，组件需要两个属性 `rank` 路由级别 `module` 组件，组件使用了函数插槽，函数接收一个参数的是当前路由级别的路由字符串，通过这个字符串配合 `swtich` 语句返回对应的 组件 

```jsx
import Dome1 from "./Component/Dome1"
import Dome2 from "./Component/Dome2"
import I404 from "../Router/Component/404"

export default function () {

  let { uuid } = this
  let a = uuid(), b = uuid(), c = uuid()

  return {
    name: 'App',
    node() {
      return (
        <div id="App">
          <div><a href="#/Dome1">Dome1</a> | <a href="#/Dome2">Dome2</a></div>
          <hr />
              
          <Switch rank={1} module={{ Dome1, Dome2, I404 }}>{(router) => {
            switch (router) {
              case '/':
                return <Dome1 id={a} />
              case '/Dome1':
                return <Dome1 id={a} />
              case '/Dome2':
                return <Dome2 id={b} />
              default:
                return <I404 id={c} />
            }
          }}</Switch>
              
        </div>
      )
    },
    life: {
      createDom() {
        console.log(this);
      }
    }
  }
}
```

`Switch` 组件路由守卫, 组件上有一个 `defend` 属性它需要一个函数参数，函数会接到3个参数，为 `oldURL` `newURL` `next` 分别为 旧的路由，新的路由，和 `next` 用来对路由放行和定向重

```jsx
import requer from "./Requer"

import Home from "./view/Home";
import Login from "./view/Login";
import I404 from "./Component/404"

export default function () {

  let { uuid } = this
  let a = uuid(), b = uuid(), c = uuid(), d = uuid();

  return {
    name: 'App',
    node(h) {
      return (
        <Switch
          rank={1}
          module={{ Home, Login, I404 }}
          defend={h.defend} >{(router) => {
            switch (router) {
              case '/':
                return <Home id={a} />
              case '/Login':
                return <Login id={b} />
              default:
                return <I404 id={d} />
            }
          }}</Switch>
      )
    },
    methods: {
      async defend(oldURL, newURL, next) {
        if (!this.state) {
          let token = localStorage.getItem('Token')
          if (token) {
            let res = await requer.get('/get/getState')
            if (res.status === 200) {
              this.__proto__.state = true
              next()
            } else {
              next('/Login')
            }
          } else {
            next('/Login')
          }
        } else {
          next()
        }
      }
    },
    life: {
      createDom() {
        console.log(this);
      }
    }
  }
}
```



组件中还有一些方法，可以进行编程式路由

```js
import { Url } from "./bindview-hashrouter";

//跳转
Url.to()
// 示例
Url.to('/Dome1',{
    name:'tom'
})

// 前进
Url.go()
// 示例
Url.go()

// 回退
 Url.back()
// 示例
Url.back()

// 获取Query 
Url.query()
// 示例
Url.query() // 返回参数对象

// 将 utf-8 装换为中文
Url.utf8()
```

### Link 组件

`Link` 组件是配合 `Switch` 来使用的，组件会创建出一个 `a` 标签，组件上有三个属性， `to` 属性是要去的路由，`rank` 是路由级别跟 `Switch` 的路由级别一样， `className` a标签类名可以不添加，`activeClass` 激活时添加类名默认添加 `active` 

```jsx
import { Switch, Url, Link } from "./bindview-hashrouter";

import Dome1 from "./Component/Dome1"
import Dome2 from "./Component/Dome2"
import I404 from "../Router/Component/404"

export default function () {

  let { uuid } = this
  let a = uuid(), b = uuid(), c = uuid()

  return {
    name: 'App',
    node() {
      return (
        <div id="App">
          <div>
            <Link to='/Dome1' rank={1} activeClass="Link">Dome1</Link>
            |
            <Link to='/Dome2' rank={1} className='Test'>Dome2</Link>
            <hr />
          </div>
          <Switch rank={1} module={{ Dome1, Dome2, I404 }}>{(router) => {
            switch (router) {
              case '/':
                return <Dome1 id={a} />
              case '/Dome1':
                return <Dome1 id={a} />
              case '/Dome2':
                return <Dome2 id={b} />
              default:
                return <I404 id={c} />
            }
          }}</Switch>
        </div>
      )
    },
    life: {
      createDom() {
        console.log(this);
      }
    },
    module:{ Switch , Link }
  }
}
```

