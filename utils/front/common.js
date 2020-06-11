import moment from 'dayjs'

// 清除所有active状态
// options:object 传入对象
const cleanActive = options => {
  Object.keys(options).forEach(key => {
    options[key] = false
  })
}

// 找出active状态的属性
// options:object 传入对象
const findSort = options => {
  return Object.keys(options).find(sort => {
    return options[sort]
  })
}

// 设置发帖时间不超7天的格式化
// date: 日期格式
const dateFormate = (date) => {
  let momentTime = moment(date)
  if (momentTime.isBefore(moment().subtract(7, 'day'))) {
    return momentTime.format('YYYY-MM-DD')
  } else {
    // 设置7天内时间差的精确时间
    let time = momentTime.diff(moment(), 's') * (-1)
    if (time < 60) {
      time = Math.floor(time) + '秒前'
    } else if (time / 60 < 60) {
      time = Math.floor(time / 60) + '分钟前'
    } else if (time / 60 / 60 < 24) {
      time = Math.floor(time / 60 / 60) + '小时前'
    } else {
      time = Math.floor(time / 60 / 60 / 24) + '天前'
    }
    return time
  }
}

// 获取当前元素距离body顶部高度
// elem: string 元素的css选择器
const getElemY = (elem) => {
  return document.querySelector(elem).getBoundingClientRect().top + window.pageYOffset
}

/**
 *
 * @param {string} elem 要移动到元素的css选择器
 * @param {number} duration 整个动画持续时间,毫秒
 * @param {number} offset 一定的偏移量
 */
const scrollToElem = (elem, duration, offset = 0) => {
  const initY = window.pageYOffset
  const elemY = getElemY(elem)
  // 获取元素要移动距离
  const diff = elemY - initY - offset
  // 设置移动动画效果
  let start = null
  if (!diff) return
  const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

  window.requestAnimationFrame(function step (timeStep) {
    // 设置动画开始时的时间
    if (!start) start = timeStep
    // 保存每一帧动画时间与初始的时间差
    const progress = timeStep - start
    // 得出每一帧完成的百分比
    let percent = Math.min(progress / duration, 1)
    // 曲线化整体完成进度
    percent = easing(percent)
    // 移动scroll
    window.scrollTo(0, initY + diff * percent)
    // 整体动画未完成之前，不断执行每一帧
    if (progress < duration) {
      window.requestAnimationFrame(step)
    }
  })
}

export { cleanActive, findSort, dateFormate, scrollToElem }
