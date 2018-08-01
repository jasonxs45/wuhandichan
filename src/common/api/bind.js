import api from './index'
let bind = {
  // ==================业主绑定
  getProjectList () {
    let opt = {
      Act: 'ProjectGetList'
    }
    return api.globalQuery(opt)
  },
  getOwnerHouseList (ProjectID, Name) {
    let opt = {
      Act: 'HouseGetOwerList',
      Data: JSON.stringify({
        ProjectID,
        Name
      })
    }
    return api.globalQuery(opt)
  },
  houseOwerBind (HouseID, Name, IDCardLast4) {
    let opt = {
      Act: 'HouseOwerBind',
      Data: JSON.stringify({
        HouseID,
        Name,
        IDCardLast4
      })
    }
    return api.globalQuery(opt)
  },
  // ===================家属与租户
  // 获取会员信息
  getMemberInfo () {
    let opt = {
      Act: 'MemberGetMyInfo'
    }
    return api.globalQuery(opt)
  },
  // 提交申请
  memberRegist (Name, Tel, IDCard) {
    let opt = {
      Act: 'MemberRegister',
      Data: JSON.stringify({
        Name,
        Tel,
        IDCard
      })
    }
    return api.globalQuery(opt)
  },
  // ===================二手业主
  // 获取分期
  getStageList () {
    let opt = {
      Act: 'StageGetList'
    }
    return api.globalQuery(opt)
  },
  // 提交申请
  secondApply (args) {
    let opt = {
      Act: 'HouseSecendApply',
      Data: JSON.stringify(args)
    }
    return api.globalQuery(opt)
  },
  // ==================业主审核
  // 我的房源
  getMyHouse () {
    let opt = {
      Act: 'HouseGetMyList'
    }
    return api.globalQuery(opt)
  },
  // 获取申请人的信息
  getApplier (ID) {
    let opt = {
      Act: 'MemberGetInfo',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  //  审核通过
  getPass (args) {
    let opt = {
      Act: 'HouseRelationBind',
      Data: JSON.stringify(args)
    }
    return api.globalQuery(opt)
  }
}
export default bind
