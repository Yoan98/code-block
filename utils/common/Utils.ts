import * as fs from 'fs'
import * as path from 'path'

import { getValue } from '../config/RedisConfig'
import * as jwt from 'jsonwebtoken'
import config from '../config/index'

// 获取token里的payload
const getTokenPayload = (token: string): object|string => {
  // 因为koa-jwt的缘故，在发送token时，前面要加上Bearer和空格，所以要做一次split
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

// 与redis中的数据进行验证
const checkCode = async (key: string, value: string): Promise<boolean> => {
  const result = await getValue(key)
  if (result != null && result.toLowerCase() === value.toLowerCase()) {
    return true
  }
  return false
}

// 随机生成4位数字
const makeRanNum = (): string => {
  const List: number[] = []
  for (let i: number = 0; i < 4; i++) {
    const number: number = Math.floor(Math.random() * 10)
    List.push(number)
  }
  const code = List.join('')
  return code
}

// 查询本地是否有此目录结构
const getStat = (path: string): Promise<boolean|any> => {
  return new Promise((resolve) => {
    fs.stat(path, (err, stat) => {
      return err ? resolve(false) : resolve(stat)
    })
  })
}

// 创建目录
const mkdir = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.mkdir(path, (err) => {
      return err ? resolve(false) : resolve(true)
    })
  })
}

// 递归生成目录
const dirExits = async (dir: string): Promise<boolean> => {
  // 判断当前是否已有目录
  const isExits = await getStat(dir)
  if (isExits && isExits.isDirectory()) {
    // 有 返回ture
    return true
  } else if (isExits) {
    // 有 但是是文件，返回false
    return false
  }
  // 没有 通过递归形式，判断上一级目录，生成目录结构
  const tmpDir = path.parse(dir).dir
  const status = await dirExits(tmpDir)
  if (status) {
    const res = await mkdir(dir)
    return res
  } else {
    return false
  }
}

const sortObj = (arr: Array<any>, property: any) => {
  return arr.sort((m, n) => m[property] - n[property])
}

const sortMenus = (tree: any) => {
  tree = sortObj(tree, 'sort')
  if (tree.children && tree.children.length > 0) {
    tree.children = sortMenus(tree.children)
  }
  if (tree.operations && tree.operations.length > 0) {
    tree.operations = sortMenus(tree.operations)
  }
  return tree
}

const getMenuData = (tree: any, rights: any, flag?: any): any => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    // _id 包含在menus中
    // 结构进行改造，删除opertaions
    if (rights.includes(item._id + '') || flag) {
      if (item.type === 'menu') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            hideInBread: item.hideInBread,
            hideInMenu: item.hideInMenu,
            notCache: item.notCache,
            icon: item.icon
          },
          component: item.component,
          children: getMenuData(item.children, rights)
        })
      } else if (item.type === 'link') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            icon: item.icon,
            href: item.link
          }
        })
      }
    }
  }

  return sortObj(arr, 'sort')
}

const flatten = (arr: any) => {
  while (arr.some((item: any) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

const getRights = (tree: any, menus: any): any => {
  const arr = []
  for (const item of tree) {
    if (item.operations && item.operations.length > 0) {
      for (const op of item.operations) {
        if (menus.includes(op._id + '')) {
          arr.push(op.path)
        }
      }
    } else if (item.children && item.children.length > 0) {
      arr.push(getRights(item.children, menus))
    }
  }
  return flatten(arr)
}
export { checkCode, getTokenPayload, makeRanNum, dirExits, sortObj, sortMenus, getMenuData, getRights }
