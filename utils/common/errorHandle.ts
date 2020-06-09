import ErrorRecord from '../model/ErrorRecord'

type nextType = () => any

const errorHandle = (ctx: any, next:nextType) => {
  return next().catch((err: any): void => {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      ctx.status = err.status || 500
      ctx.body = {
        code: 500,
        msg: err.message
      }
      console.log('错误：' + err)
    }
    // 保存错误日志到数据库
    ErrorRecord.create({
      message: err.message,
      code: ctx.response.status,
      method: ctx.method,
      path: ctx.path,
      param: ctx.method === 'GET' ? ctx.query : ctx.request.body,
      username: '',
      stack: err.stack
    })
  })
}

export default errorHandle
