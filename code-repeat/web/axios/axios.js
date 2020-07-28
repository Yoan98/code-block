import axios from 'axios'
import errorHandle from './errorHandle'
import store from '@/store'
import selfConfig from '../config'
const CancelToken = axios.CancelToken

class HttpRequest {
  constructor (axiosConfig) {
    this.axiosConfig = axiosConfig || {}
    this.pendding = {}
  }
  // axio的基础配置
  _getConfig () {
    const config = {
      baseUrl: selfConfig.baseURL,
      headers: {
      'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 10000,
      ...this.axiosConfig
    }
    return config
  }
  removePendding (key, isRequest = false) {
    if (this.pendding[key] && isRequest) {
      this.pendding[key]('取消重复请求')
      delete this.pendding[key]
    }
  }
  // 拦截器的配置
  interceptors (instance) {
    // Add a request interceptor
    instance.interceptors.request.use((config) => {
      // Do something before request is sent,this config is your config of axios request
      // 取消重复请求
      let key = config.url + '&' + config.method
      this.removePendding(key, true)
      config.cancelToken = new CancelToken((c) => {
        // An executor function receives a cancel function as a parameter
        this.pendding[key] = c
      })
      // 判断是否为公共路径
      let isPublic = false
      selfConfig.publicList.map((path) => {
        isPublic = isPublic || path.test(config.url)
      })
      const token = store.state.token
      // 当为私有路径时，给header添加jwt的token
      if (!isPublic && token) {
        config.headers.Authorization = 'Bearer ' + store.state.token
      }
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
      const key = res.config.url + '&' + res.config.method
      this.removePendding(key)
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
  // 执行axios请求
  request (options) {
    const instance = axios.create()
    // 将拦截器添加到对应的axios的实例上
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
