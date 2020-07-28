// koa的ctx声明
export interface ctxType{
  status: number,
  body: object,
  request: any,
  header: any
}

// koa链条的报错与数据库报错声明
export interface errType{
  status: number
  message: string,
  statck: string,
  name: string,
  code: number
}
