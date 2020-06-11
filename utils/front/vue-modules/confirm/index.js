import ConfirmComponent from './Confirm'
// 自定义弹框插件
const Confirm = {}

Confirm.install = (Vue) => {
  const ConfirmConstructor = Vue.extend(ConfirmComponent)
  const instance = new ConfirmConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  Vue.prototype.$confirm = (msg, fn1, fn2) => {
    instance.msg = msg
    instance.isShow = true
    instance.fn1 = fn1
    instance.fn2 = fn2
  }
}

export default Confirm
