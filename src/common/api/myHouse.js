import api from './index'
let myHouse = {
  list () {
    let opt = {
      Act: 'HouseGetMyAllList'
    }
    return api.globalQuery(opt)
  },
  member (HouseID) {
    let opt = {
      Act: 'HouseRelationGetList',
      Data: JSON.stringify({
        HouseID
      })
    }
    return api.globalQuery(opt)
  },
  unBindMe (HouseID) {
    let opt = {
      Act: 'HouseUnBindMe',
      Data: JSON.stringify({
        HouseID
      })
    }
    return api.globalQuery(opt)
  },
  unBind (HouseID, MemberID) {
    let opt = {
      Act: 'HouseUnBind',
      Data: JSON.stringify({
        HouseID,
        MemberID
      })
    }
    return api.globalQuery(opt)
  }
}
export default myHouse
