
import { Message } from "element-ui"
class WebSocketClient {
  constructor (config = {}, callBack = () => {}) {
    const defaultConfig = {
      url: "ws://192.168.0.207:9876/ws",
      timeInterval: 5 * 1000, // 超时则重连的时间
      limitCheckCount: 5 // 限制心跳监测的次数（超过则主动断开）
    }
    const finalConfig = { ...defaultConfig, ...config }

    this.ws = {}
    this.url = finalConfig.url
    this.handle = null
    this.timeInterval = finalConfig.timeInterval
    this.callBack = callBack
    this.checkCount = 0 // 心跳检测次数
  }

  init () {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = () => this._onOpen()
    this.ws.onmessage = (msg) => this._onMessage(msg)
    this.ws.onclose = () => this._onClose()
    this.ws.onerror = () => this._onError()
  }

  // 发送消息
  send (msg) {
    this.ws.send(msg)
  }

  // 与服务端连接建立时触发
  _onOpen () {
    console.log("websocket连接成功")
  }

  // 客户端接收到消息
  _onMessage (msg) {
    try {
      const obj = JSON.parse(msg.data)
      this.callBack(obj)
    } catch (error) {
      this.callBack(msg.data)
    }

    // 心跳检测
    // this.checkServer()
  }

  // 当客户端主动断开
  _onClose () {
    console.log("close:" + this.ws.readyState)
    console.log("已关闭websocket")
    Message({
      message: '已关闭websocket',
      type: 'error'
    })
    this.ws.close()
  }

  // 当连接发生错误
  _onError () {
    Message({
      message: 'websocket连接失败,1秒后重连',
      type: 'error'
    })
    // 连接失败后，断线重练
    setTimeout(() => {
      console.log("websocket重新连接")
      this.init()
    }, 1000)
  }

  // 心跳检测
  checkServer () {
    this.checkCount = 0
    clearInterval(this.handle)
    // 当每一次测试心跳检测数据的时间超过了所设时间，则断开重连
    this.handle = setInterval(() => {
      // 如果超过重连次数限制则主动断开连接
      if (this.checkCount >= this.limitCheckCount) {
        clearInterval(this.handle)
        this._onClose()
        console.log('服务器已断开连接')
      } else {
        this.checkCount++
        this._onClose()
        this._onError()
      }
    }, this.timeInterval + 1000)
  }
}

export default WebSocketClient
