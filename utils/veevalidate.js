import { extend, localize } from 'vee-validate'
import { required, email, min, length, confirmed } from 'vee-validate/dist/rules'
import zh from 'vee-validate/dist/locale/zh_CN.json'

// 扩展验证规则
extend('email', email)
extend('required', required)
extend('min', min)
extend('length', length)
extend('confirmed', confirmed)
extend('password', value => {
  return /^\w{8,16}$/ig.test(value)
})

// 扩展本地中文，字段，提示信息
localize({
  zh: {
    names: {
      email: '邮箱',
      password: '密码',
      username: '用户名',
      code: '验证码'
    },
    fields: {
      username: {
        required: '请输入邮箱',
        email: '邮箱格式不正确'
      },
      password: {
        required: '请输入密码',
        password: '请输入由数字，字母，下划线组成的8到16位密码'
      },
      code: {
        required: '请输入验证码'
      }
    }
  }
})
// 添加并执行规则
localize('zh', zh)
