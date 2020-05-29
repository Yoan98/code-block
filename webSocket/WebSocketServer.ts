import * as WebScoket from 'ws'
import { getTokenPayload } from '../common/Utils'

interface configType {
  port?: number,
  timeInterval?: number,
  isAuth?: boolean,
  options?: object
}

class WebScoketServer {
  wss: any
  interval: number
  isAuth: boolean
  port: number
  options: object
  timeInterval: number
  handle: any

  constructor (config: configType = {}) {
    const defaultConfig = {
      port: 3001,
      timeInterval: 6 * 1000,
      isAuth: true
    }

    // 最终配置
    const finalConfig = { ...defaultConfig, ...config }

    this.wss = {}
    this.isAuth = finalConfig.isAuth
    this.port = finalConfig.port
    this.timeInterval = finalConfig.timeInterval
    this.options = config.options || {}
  }

  // 初始化websocket服务
  init () {
    this.wss = new WebScoket.Server({ port: this.port, ...this.options })

    // 心跳检测
    this.heartbeat()

    // 连接信息
    this.wss.on('connection', (ws: any) => {
      ws.isAlive = true

      ws.on('message', (msg: any) => {
        this.onMessage(ws, msg)
      })

      ws.on('close', () => this.onClose(ws))
    })
  }

  onMessage (ws: any, msg: any) {
    // 用户鉴权
    // 心跳检测
    // 消息发送
    const msgObj = JSON.parse(msg)
    const events: any = {
      auth: () => {
        try {
          const obj: any = getTokenPayload(msgObj.message)
          if (obj) {
            ws.isAuth = true
            ws._id = obj._id
          }
          ws.send(JSON.stringify({
            event: 'message',
            message: 'auth is ok'
          }))
        } catch (error) {
          ws.send(JSON.stringify({
            event: 'noauth',
            message: 'please auth again'
          }))
        }
      },
      heartbeat: () => {
        if (msgObj.message === 'pong') {
          ws.isAlive = true
        }
      },
      message: () => {
        // 鉴权拦截,当客户端的auto通过，并且要手动设置这个类实例的isAuth为false
        if (!ws.isAuth && this.isAuth) {
          return
        }
        // 消息广播
        this.wss.clients.forEach((client: any) => {
          if (client.readyState === WebScoket.OPEN && client._id === ws._id) {
            ws.send(msgObj)
          }
        })
      }
    }
    events[msgObj.event]()
  }

  // 点对点的消息发送
  send (uid: any, msg: any) {
    this.wss.clients.forEach((client: any) => {
      if (client.readyState === WebScoket.OPEN && client._id === uid) {
        client.send(msg)
      }
    })
  }

  // 广播消息
  brodcast (msg: string) {
    this.wss.clients.forEach((client: any) => {
      if (client.readyState === WebScoket.OPEN) {
        client.send(msg)
      }
    })
  }

  heartbeat () {
    setInterval(() => {
      this.wss.clients.forEach((ws: any) => {
        console.log(ws.isAlive)
        if (!ws.isAlive) {
          return ws.terminate()
        }
        // 主动发送心跳检查请求
        // 当客户端返回了消息之后，主动设置flag在线
        ws.isAlive = false
        ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'ping'
        }))
      })
    }, this.timeInterval)
  }

  onClose (ws: any) {
    console.log('websocket已关闭')
    ws.close()
  }
}

export default WebScoketServer
