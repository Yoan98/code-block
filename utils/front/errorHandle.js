const errorHandle = (err) => {
  if (err.message === '取消重复请求') return
  console.log(err)
}

export default errorHandle
