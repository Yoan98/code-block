import axios from 'axios'
import errorHandle from './errorHandle'

class HttpRequest {
  constructor (axiosConfig) {
    this.axiosConfig = axiosConfig
  }
  // axio的基础配置
  _getConfig () {
    const config = this.axiosConfig
    return config
  }
  // 拦截器的配置
  interceptors (instance) {
    // Add a request interceptor
    instance.interceptors.request.use((config) => {
      // Do something before request is sent
      // console.log(config)
      return config
    }, (err) => {
      // Do something with request error
      errorHandle(err)
      return Promise.reject(err)
    })

    // Add a response interceptor
    instance.interceptors.response.use((res) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      if (res.status === 200) {
        return Promise.resolve(res.data)
      }
      return Promise.reject(res)
    }, (err) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      errorHandle(err)
      return Promise.reject(err)
    })
  }
  // 执行axio请求
  request (options) {
    const instance = axios.create()
    this.interceptors(instance)
    const newOptions = Object.assign(this._getConfig(), options)

    return instance(newOptions)
  }
  get (url, config) {
    config = Object.assign({
      url: url,
      method: 'get'
    }, config)
    return this.request(config)
  }
  post (url, data) {
    const config = {
      url: url,
      method: 'post',
      data: data
    }
    return this.request(config)
  }
}

export default HttpRequest
