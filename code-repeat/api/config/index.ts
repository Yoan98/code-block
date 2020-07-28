import * as path from 'path'

interface REDISType {
  host: string,
  port: number,
  password: string
}

const isPro: boolean = process.env.NODE_ENV === 'production'

// MongoDB连接
const DB_URL: string = 'mongodb://manange1:1165994030@47.113.115.181:15000/FlyCommunity'

// Redis连接
const REDIS: REDISType = {
  host: '47.113.115.181',
  port: 15001,
  password: '1165994030hy'
}

// JsonWebToken密钥
const JWT_SECRET: string = 'qVgbuNBLazGRnMzaHQqAVO8dHKbMgdsyfTL3NBGJrydX5LiuyOWPUQB4zmMU9nYP7BeyzcSc962eKDOhGpwUYuYZFPfP'

// APP域名
const baseUrl: string = isPro ? 'http://47.113.115.181:10010' : 'http://localhost:8080'

// websocket本地端口
const wsPort = isPro ? 12000 : 3001

// 上传的文件夹路径
const uploadPath: string = isPro ? '/app/public' : path.join(path.resolve(__dirname), '../../public')

export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl,
  uploadPath,
  wsPort
}
