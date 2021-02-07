/*
 * @Description: 封装了websocket的类
 * @Date: 2021-02-07 09:06:23
 * @LastEditors: dashuaibi
 * @LastEditTime: 2021-02-07 10:10:07
 */

/**
 * @description: 封装了websocket的类
 * @param {config:{url: string,timeInterval: number},callBack:(msg) => {}}// callback为收到消息时触发函数
 * @return {*}
 */
class WebScoketClient {
  constructor (config = {},callBack = () => {}) {
    const defaultConfig = {
      url: '',
      timeInterval: 10 * 1000
    }
    const finalConfig = { ...defaultConfig, ...config }

    this.ws = {}
    this.url = finalConfig.url
    this.handle = null
    this.timeInterval = finalConfig.timeInterval
    this.callBack = callBack
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
    console.log('连接成功')
  }
  // 客户端接收到消息
  _onMessage (msg) {
    const obj = JSON.parse(msg.data)
    this.callBack(obj)

    // 根据后台与前台指定的消息规则再完成心跳检测
    // this.checkServer()
  }
  // 当客户端主动断开
  _onClose () {
    console.log('close:' + this.ws.readyState)
    console.log('已关闭websocket')
    this.ws.close()

  }
  // 当连接发生错误
  _onError () {
    console.log('error' + this.ws.readyState)
    console.log('websocket连接失败')
    // 连接失败后，断线重练
    setTimeout(() => {
      this.init()
    }, 1000)
  }

  // 心跳检测
  checkServer () {
    clearTimeout(this.handle)
    // 当每一次测试心跳检测数据的时间超过了所设时间，则断开重连
    this.handle = setTimeout(() => {
      this.onClose()
      this.onError()
    }, this.timeInterval + 1000)
  }
}

export default WebScoketClient
