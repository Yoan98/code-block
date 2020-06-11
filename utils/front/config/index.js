const isDev = process.env.NODE_ENV === 'development'

// app路由
const baseURL = isDev ? 'http://localhost:3000' : 'http://47.113.115.181:12500'

// 配置axios的基础参数
const axiosConfig = {
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  timeout: 10000
}

// 公共目录列表
const publicList = [/^\/public/, /^\/login/, /^\/getCaptcha/, /^\/reg/, /^\/forget/]

// websocket配置
const wsUrl = {
  url: isDev ? 'localhost' : '47.113.115.181',
  port: isDev ? '3001' : 12000
}

export default {
  axiosConfig,
  publicList,
  baseURL,
  wsUrl
}
