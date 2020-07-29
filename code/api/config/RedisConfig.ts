import * as redis from 'redis'
import { promisifyAll } from 'bluebird'
import config from './index'

interface RedisOptions {
  host: string,
  port: number,
  password: string,
  detectBuffers: boolean,
  retryStrategy: (options: any) => any
}

const options: RedisOptions = {
  host: config.REDIS.host,
  port: config.REDIS.port,
  password: config.REDIS.password,
  detectBuffers: true,
  retryStrategy: function (options: any): any {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}

// const client = redis.createClient(options)
const client: any = promisifyAll(redis.createClient(options))

client.on('error', (err: string | number): void => {
  console.log('Redis Client Error:' + err)
})
interface indexObject {
  [index: string]: string
}
const setValue = (key: string, value: string | indexObject, time?: number): void => {
  if (typeof value === 'undefined' || value == null) {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    // { key1: value1, key2: value2}
    // Object.keys(value) => [key1, key2]
    Object.keys(value).forEach((item: string): void => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

// const {promisify} = require('util');
// const getAsync = promisify(client.get).bind(client);

const getValue = (key: string): string => {
  return client.getAsync(key)
}

const getHValue = (key: string): string | object => {
  // v8 Promisify method use util, must node > 8
  // return promisify(client.hgetall).bind(client)(key)

  // bluebird async
  return client.hgetallAsync(key)
}

const delValue = (key: string) => {
  client.del(key, (err: string, res: number):void => {
    if (res === 1) {
      console.log('delete successfully')
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

export {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}
