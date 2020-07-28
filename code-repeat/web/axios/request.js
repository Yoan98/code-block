import config from '@/config/index'
import HttpRequest from './axios'

const axios = new HttpRequest(config.axiosConfig)

export default axios
