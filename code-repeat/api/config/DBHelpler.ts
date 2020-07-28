import * as mongoose from 'mongoose'
import config from './index'

// 创建连接
mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

// 连接成功
mongoose.connection.on('connected', (): void => {
  console.log('Mongoose connection open to ' + config.DB_URL)
})

// 连接异常
mongoose.connection.on('error', (err): void => {
  console.log('Mongoose connection error: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', (): void => {
  console.log('Mongoose connection disconnected')
})

export default mongoose
