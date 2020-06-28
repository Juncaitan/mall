
import Toast from './Toast'

const obj = {}

obj.install = function(Vue){
  //创建组件构造器
  const toastContrustor = Vue.extend(Toast)

  const toast = new toastContrustor()

  toast.$mount(document.createElement('div'))
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast

}

export default obj
