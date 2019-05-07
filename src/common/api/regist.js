import api from './index'
let regist = {
  // 发送验证码
  send (Tel) {
    let opt = {
      Act: 'MemberSendValidCode',
      Data: JSON.stringify({
        Tel
      })
    }
    return api.globalQuery(opt)
  },
  // 提交
  submit (Name, Tel, CertNumber, Code) {
    let opt = {
      Act: 'MemberAdd',
      Data: JSON.stringify({
        Name,
        Tel,
        Code,
        CertNumber
      })
    }
    return api.globalQuery(opt)
  }
}
export default regist
