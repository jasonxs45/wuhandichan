import api from './index'
let modify = {
  get () {
    let opt = {
      Act: 'MemberGetMyInfo'
    }
    return api.globalQuery(opt)
  },
  save (Name, Tel, Address) {
    let opt = {
      Act: 'MemberSaveMyInfo',
      Data: JSON.stringify({
        Name,
        Tel,
        Address
      })
    }
    return api.globalQuery(opt)
  }
}
export default modify
