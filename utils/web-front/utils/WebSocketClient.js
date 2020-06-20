import store from '../store'
import { setTimeout } from 'core-js'
import configs from '@/config/index'

class WebScoketClient {
  constructor (config = {}) {
    const defaultConfig = {
      url: configs.wsUrl.url,
      port: configs.wsUrl.port,
      protocal: 'ws',
      timeInterval: 6 * 1000
    }
    const finalConfig = { ...defaultConfig, ...config }

    this.ws = {}
    this.url = finalConfig.url
    this.port = finalConfig.port
    this.protocal = finalConfig.protocal
    this.handle = null
    this.timeInterval = finalConfig.timeInterval
  }

  init () {
    this.ws = new WebSocket(`${this.protocal}://${this.url}:${this.port}`)
    this.ws.onopen = () => this.onOpen()
    this.ws.onmessage = (msg) => this.onMessage(msg)
    this.ws.onclose = () => this.onClose()
    this.ws.onerror = () => this.onError()
  }

  send (msg) {
    this.ws.send(msg)
  }

  // 与服务端连接成功
  onOpen () {
    this.ws.send(JSON.stringify({
      event: 'auth',
      message: 'Bearer ' + store.state.token
    }))
  }
  // 客户端接收到消息
  onMessage (msg) {
    const obj = JSON.parse(msg.data)
    switch (obj.event) {
      case 'noauth':
        // 鉴权失败
        console.log('token未通过')
        break
      case 'heartbeat':
        // 心跳检查
        this.checkServer()
        this.send(JSON.stringify({
          event: 'heartbeat',
          message: 'pong'
        }))
        break
      default:
        store.dispatch(obj.event, obj)
    }
  }
  // 当客户端主动断开
  onClose () {
    // console.log('close:' + this.ws.readyState)
    // console.log('已关闭websocket')
    this.ws.close()
  }
  // 当连接发生错误
  onError () {
    // console.log('error' + this.ws.readyState)
    // console.log('websocket连接失败')
    // 连接失败后，断线重练
    setTimeout(() => {
      this.init()
    }, 1000)
  }

  // 心跳检测
  checkServer () {
    clearTimeout(this.handle)
    // 当每一次测试心跳检测数据的时间超过了30s，则断开重连
    this.handle = setTimeout(() => {
      this.onClose()
      this.onError()
    }, this.timeInterval + 1000)
  }
}

export default WebScoketClient
