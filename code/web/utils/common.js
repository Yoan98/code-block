
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
