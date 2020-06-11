import PopComponent from './Pop'
// 自定义弹框插件
const Pop = {}

Pop.install = (Vue) => {
  // 应用组件并挂载
  const PopConstructor = Vue.extend(PopComponent)
  const instance = new PopConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  // 扩展实例的方法
  Vue.prototype.$pop = (msg, type) => {
    instance.msg = msg
    instance.type = type
    instance.isShow = true
  }
}

export default Pop
