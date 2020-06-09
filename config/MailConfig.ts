import * as nodemailer from 'nodemailer'
import * as qs from 'qs'

import config from './index'

interface sendInfoType {
  expire: string,
  email: string,
  senderAddress: string,
  data?: {
    key: string,
    username: string
  }
  code?: string,
  type?: string
}

// async..await is not allowed in global scope, must use a wrapper
async function send (sendInfo:sendInfoType): Promise<any> {
  const type: string = sendInfo.type === 'email' ? '/confirm' : '/reset'
  const url: string = `${config.baseUrl}/#${type}?${qs.stringify(sendInfo.data)}`
  let html: string = ''

  if (type === 'reset') {
    html = `<p>这是一封验证邮箱，请在${sendInfo.expire}时间内完成验证，您的验证码是${sendInfo.code}, <a href="${url}">请点击链接</a></p>`
  } else {
    html = `<p>这是一封验证邮箱，请在${sendInfo.expire}时间内完成验证，<a href="${url}">请点击链接</a></p>`
  }
  // create reusable transporter object using the default SMTP transport
  const transporter: any = nodemailer.createTransport({
    host: 'smtp.sendcloud.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'chipman_test_Kvj7gM', // generated ethereal user
      pass: 'sHvgDPj270yAWXLX' // generated ethereal password
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: sendInfo.senderAddress, // sender address
    to: sendInfo.email, // list of receivers
    subject: '邮箱验证', // Subject line
    text: 'HAPPY EVERYDAY', // plain text body
    html
  })

  return info.messageId
}

export default send
