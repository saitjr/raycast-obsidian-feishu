import { base as _base } from './base'

const permission = {}

permission.addFullPermission = async (driveURL) => {
  const host = _base.getHostByURL(driveURL)
  const currentBrowerType = _base.getBrowserTypeByURL(driveURL)
  const addPermissionBrowerType = currentBrowerType === 'chrome' ? 'safari' : 'chrome'
  const addPermissionAccount = _base.getOwnerAccountByBrowserType(addPermissionBrowerType)
  const url = `https://${host}/space/api/suite/permission/members/create/`
  const params = {
    'token': 'doccnea4gWvy9EH0mWMqsnW99Nb',
    'type': '2',
    'owners': '[{"owner_id":"' + addPermissionAccount + '","owner_type":1,"permission":1024}]',
    'notify_lark': '0',
    'send_lark_im': 'false',
    'lark_im_text': '',
    'notify_lark_v2': 'false',
    'notify_lark_v3': 'false'
  }
  const res = await _base.formPost(url, params)
  return res.code // 0 为成功，错误字段为 res.msg
}

export const module = permission

// permission.addFullPermission('https://saitjr-blog.feishu.cn/docs/doccnea4gWvy9EH0mWMqsnW99Nb').then(data => {
//   console.log(data)
// })
