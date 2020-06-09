import store from '../store'

export default {
  'hasRole': {
    inserted: function (el, binding) {
      // 判断是否是管理员
      const roles = store.state.userInfo.roles || ['user']
      if (!roles.includes(binding.value)) {
        // 不存在, 移除该dom元素
        el.parentNode.removeChild(el)
      }
    }
  }
}
