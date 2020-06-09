import face from '@/assets/js/face'

const escapeHtml = (val = '') => {
  let result = val
  // 更替表情
  const faceReg = /face\[\S*\]/g
  if (faceReg.test(result)) {
    const group = result.match(faceReg)
    if (group.length > 0) {
      group.map(item => {
        const faceName = item.match(/\[\S*\]/g)[0]
        result = result.replace(item, `<img src="${face[faceName]}" />`)
      })
    }
  }
  // 更替图片
  const imgReg = /img\[\S*\]/g
  if (imgReg.test(result)) {
    const group = result.match(imgReg)
    if (group.length > 0) {
      group.map(item => {
        const imgUrl = item.match(item.substr(4, item.length - 5))[0]
        result = result.replace(item, `<img src="${imgUrl}"/>`)
      })
    }
  }
  // 更替链接
  const linkReg = /a\(.*\]/g
  if (linkReg.test(result)) {
    const group = result.match(linkReg)
    let titleReg = /\(.*\)/g
    let urlReg = /\[.*\]/g
    group.map(item => {
      const title = item.match(titleReg)[0].replace(/\(|\)/g, '')
      const url = item.match(urlReg)[0].replace(/\[|\]/g, '')
      result = result.replace(item, `<a href=${url}>${title}</a>`)
    })
  }
  // 更替引用
  result = result.replace(/\[quote\]/, '<div>')
  result = result.replace(/\[\/quote\]/, '</div>')
  // 更替代码
  // 更替hr
  return result
}

export { escapeHtml }
