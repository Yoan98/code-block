import { extend, localize } from 'vee-validate'
/* eslint-disable */
import { required, email, min, length, confirmed, is_not } from 'vee-validate/dist/rules'
import zh from 'vee-validate/dist/locale/zh_CN.json'

// 扩展验证规则
extend('email', email)
extend('required', required)
extend('min', min)
extend('length', length)
extend('confirmed', confirmed)
extend('is_not', is_not)
extend('password', value => {
  return /^\w{8,16}$/ig.test(value)
})

// 扩展本地中文，字段，提示信息
localize({
  zh: {
    // input的name的名称
    names: {
      email: '邮箱',
      password: '密码',
      username: '用户名',
      code: '验证码',
      repassword: '密码',
      name: '昵称',
      title: '标题',
      catlog: '所选专题'
    },
    // 每个input下的验证字段，对应着input的name名称下的字段
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
      },
      repassword: {
        required: '不能为空',
        confirmed: '请输入相同的密码'
      },
      email: {
        required: '请输入邮箱',
        email: '邮箱格式不正确'
      },
      title: {
        required: '请输入标题'
      },
      catlog: {
        is_not: '请选择专栏'
      }
    }
  }
})
// 添加并执行规则
localize('zh', zh)
