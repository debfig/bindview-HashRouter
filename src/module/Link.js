export default function (props) {
  let { className, to, rank, activeClass } = props
  let { slot } = this

  if (!to) { console.error("[Router] Link 组件的 to 不能为空"); }

  return {
    name: 'Link',
    node(h) {
      let { router } = this
      return h('a', {
        href: "#" + to,
        class: h.className(to, router, className, activeClass)
      }, [slot()])
    },
    data: {
      router: '/'
    },
    methods: {
      handleRouter(router) {
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
      onhashchange() {
        let hash = window.location;
        hash = hash.hash !== '' ? hash.hash : '/';
        this.methods.handleRouter.call(this, hash);
      },
      className(to, router, className, activeClass) {
        let newTo = to.split('?')[0];
        let active = activeClass ? activeClass : "active"
        if (newTo === router) {
          return className ? className + " " + active : active
        } else {
          return className ? className : ''
        }
      }
    },
    life: {
      createDom() {
        let _this = this;

        let onload = function () {
          let hash = window.location
          hash = hash.hash !== '' ? hash.hash : '/'
          _this.methods.handleRouter.call(_this, hash);
        }

        // 创建组件时获取路由
        onload()

        // 添加路由事件监听
        window.addEventListener('hashchange', _this.methods.onhashchange.bind(this))
      },
      unLoading() {
        // 组件卸载前解除事件监听
        window.removeEventListener('hashchange', this.methods.onhashchange)
      }
    },
  }
}