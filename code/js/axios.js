/*
 * @Description: 封装axios的类
 * @Date: 2021-02-07 09:06:23
 * @LastEditors: hy
 * @LastEditTime: 2021-02-07 09:58:49
 */
import axios from 'axios'

const CancelToken = axios.CancelToken
/**
 * @description: 封装axios，配置好的拦截器
 * @param {axiosConfig: Object,errorHandle: (err) => void} // axios的默认配置传参与错误处理函数
 */
class HttpRequest {
  constructor (axiosConfig = {},errorHandle = () => {}) {
    this.pending = {}
    this.axiosConfig = this._getConfig(axiosConfig)
    this.errorHandle = errorHandle
  }
  // axios的基础配置
  _getConfig (axiosConfig) {
    const config = {
      baseURL: '',
      headers: {
      'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000,
      ...axiosConfig
    }
    return config
  }
  // 取消重复请求
  _removePending (key, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('cancel repeat request')
      delete this.pending[key]
    }
  }
  // 拦截器的配置
  _interceptors (instance) {
    // Add a request interceptor
    instance.interceptors.request.use((config) => {
      // Do something before request is sent,this config is your config of axios request

      // 请求时取消重复请求
      let key = config.url + '&' + config.method
      this._removePending(key, true)
      config.cancelToken = new CancelToken((c) => {
        // An executor function receives a cancel function as a parameter
        this.pending[key] = c
      })

      return config
    }, (err) => {
      // Do something with request error
      this.errorHandle(err)
      return Promise.reject(err)
    })

    // Add a response interceptor
    instance.interceptors.response.use((res) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data

      // 返回请求时，将先前存入的去掉，以免影响第二次请求
      const key = res.config.url + '&' + res.config.method
      this._removePending(key)

      if (res.status === 200) {
        return Promise.resolve(res.data)
      }
      return Promise.reject(res)
    }, (err) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      this.errorHandle(err)
      return Promise.reject(err)
    })
  }
  // 执行axios请求
  request (options) {
    const instance = axios.create()
    // 将拦截器添加到对应的axios的实例上
    this._interceptors(instance)
    const newOptions = Object.assign(this.axiosConfig, options)

    return instance(newOptions)
  }
  get (url, params, options) {
    const config = {
      url: url,
      method: 'get',
      params,
      ...options
    }
    return this.request(config)
  }
  post (url, data, options) {
    const config = {
      url: url,
      method: 'post',
      data,
      ...options
    }
    return this.request(config)
  }
}

export default HttpRequest
