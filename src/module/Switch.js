/**
 * Switch组件
 * @param {*} props 
 * @returns 
 */
export default function (props) {
  const { rank, module, defend, className } = props
  let { slot } = this
  return {
    name: 'Switch',
    node(h) {
      const { data: $ } = this

      return h('div', { class: className ? typeof className === 'string' ? className : "Switch" : "Switch" }, [slot($.router)])
    },
    data: {
      router: '/'
    },
    methods: {
      handleRouter(router) {
        // 匹配路由拼接路由字符串
        router = router.split('?')
        switch (router[0]) {
          case "/":
            this.data.router = "/"
            break
          case "#/":
            this.data.router = "/"
            break
          default:
            let reg1 = new RegExp("#/", "g");
            let a1 = router[0].replace(reg1, "");
            a1 = a1.split("/");
            let temp = "";
            for (let i = 0; i < rank; i++) {
              if (a1[i] === undefined) {
                temp += ""
              } else {
                temp += "/" + a1[i]
              }
            }
            this.data.router = temp
            break;
        }
      },
      getRouter(to) {
        // 获取和设置路由
        if (to) {
          location.href = "#" + to
          this.methods.handleRouter.call(this, "#" + to);
        } else {
          let hash = window.location;
          hash = hash.hash !== '' ? hash.hash : '/';
          this.methods.handleRouter.call(this, hash);
        }
      },
      onhashchange(event) {
        if (typeof defend === "function") {
          let newGetRouter = this.methods.getRouter.bind(this)
          let oldURL = event !== undefined ? new URL(event.oldURL) : "";
          let newURL = event !== undefined ? new URL(event.newURL) : new URL(location.href);
          oldURL = oldURL !== "" ? oldURL.hash === "" ? "/" : oldURL.hash.split('#')[1] : "";
          newURL = newURL.hash === "" ? "/" : newURL.hash.split('#')[1]
          defend(oldURL, newURL, newGetRouter)
        } else if (defend === undefined) {
          // 处理路由首位
          this.methods.getRouter.call(this)
        } else {
          console.error("[hashRouter] defend 需要一个函数");
        }
      },
    },
    life: {
      createDom() {
        let _this = this;

        // 创建组件时获取路由
        this.methods.onhashchange.call(this)

        // 添加路由事件监听
        window.addEventListener('hashchange', _this.methods.onhashchange.bind(this))
      },
      unLoading() {
        // 组件卸载前解除事件监听
        window.removeEventListener('hashchange', this.methods.onhashchange)
      }
    },
    module
  }
}