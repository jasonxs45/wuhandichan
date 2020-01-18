import api from './index'
const ROLE = {
  // 用户
  user: '用户',
  // 工程师
  engineer: '工程师',
  // 管理员
  engineermanager: '地产客服',
  // 客服
  manager: '客服'
}
const STATE = {
  user: {
    untreated: '待受理',
    treated: '处理中',
    finished: '已完成',
    canceled: '已取消'
  },
  engineer: {
    treating: '已受理',
    treated: '已处理',
    finished: '已完成'
  },
  engineermanager: {
    untreated: '待审核',
    timeout: '已超时'
  },
  manager: {
    untreated: '待受理',
    treating: '已分配',
    treated: '已处理',
    finished: '已完成',
    canceled: '已取消'
  }
}
let repair = {
  counts ({ role }) {
    let opt = {
      Act: 'RepairGetStatistics',
      Data: JSON.stringify(
        {
          role
        }
      )
    }
    return api.fetch(opt)
  },
  list1 ({ role, state, searchkey = '', projectid = '', stageid = '', startdate = '', enddate = '', pageindex = 1, pagesize = 10, building = '', unit = '', houseno = '', name = '' } = {}) {
    let opt = {
      Act: 'RepairGetList',
      Data: JSON.stringify(
        {
          role,
          state,
          searchkey,
          projectid,
          stageid,
          startdate,
          enddate,
          pagesize,
          pageindex,
          building,
          unit,
          houseno,
          name
        }
      )
    }
    return api.fetch(opt)
  },
  list (role, state, pageindex = 1, pagesize = 10, building = '', unit = '', houseno = '', name = '') {
    let opt = {
      Act: 'RepairGetList',
      Data: JSON.stringify(
        {
          role: ROLE[role],
          state: STATE[role][state],
          pagesize,
          pageindex,
          building,
          unit,
          houseno,
          name
        }
      )
    }
    return api.globalQuery(opt)
  },
  detail (ID) {
    let opt = {
      Act: 'RepairGetInfo',
      Data: JSON.stringify(
        {
          ID
        }
      )
    }
    return api.globalQuery(opt)
  },
  user: {
    // 获取部位
    parts () {
      let opt = {
        Act: 'RepairPartGetList'
      }
      return api.globalQuery(opt)
    },
    // 提交报修单
    submit ({HouseID, Name, Tel, TroubleID, Content, Images}) {
      let opt = {
        Act: 'RepairSave',
        Data: JSON.stringify(
          {
            HouseID,
            Name,
            Tel,
            TroubleID,
            Content,
            Images
          }
        )
      }
      return api.globalQuery(opt)
    },
    // 评分
    evaluate (opts) {
      let opt = {
        Act: 'RepairEvaluate',
        Data: JSON.stringify(opts)
      }
      return api.globalQuery(opt)
    }
  },
  engineer: {
    // 拒单
    refuse (ID, RefuseReason) {
      let opt = {
        Act: 'RepairBuilderRefuse',
        Data: JSON.stringify({
          ID,
          RefuseReason
        })
      }
      return api.globalQuery(opt)
    },
    // 完成报修
    finishOrder (RepairID, Images, Desc) {
      let opt = {
        Act: 'RepairDeal',
        Data: JSON.stringify({
          RepairID,
          Images,
          Desc
        })
      }
      return api.globalQuery(opt)
    }
  },
  engineermanager: {
    agree (ID, RefuseReason) {
      let opt = {
        Act: 'RepairManagerCancel',
        Data: JSON.stringify({
          ID,
          RefuseReason
        })
      }
      return api.globalQuery(opt)
    },
    refuse (ID, ReturnMsg) {
      let opt = {
        Act: 'RepairManagerReturn',
        Data: JSON.stringify({
          ID,
          ReturnMsg
        })
      }
      return api.globalQuery(opt)
    },
    change (ID, ReturnMsg) {
      let opt = {
        Act: 'RepairManagerReturnToEdit',
        Data: JSON.stringify({
          ID,
          ReturnMsg
        })
      }
      return api.globalQuery(opt)
    }
  },
  manager: {
    info () {
      let opt = {
        Act: 'RepairGetManager'
      }
      return api.globalQuery(opt)
    },
    getEngineers (ID) {
      let opt = {
        Act: 'RepairGetBuilder',
        Data: JSON.stringify({
          ID
        })
      }
      return api.globalQuery(opt)
    },
    allot (ID, BuilderID, AllotMsg) {
      let opt = {
        Act: 'RepairAllot',
        Data: JSON.stringify({
          ID,
          BuilderID,
          AllotMsg
        })
      }
      return api.globalQuery(opt)
    },
    reWrite (ID, TroubleID) {
      let opt = {
        Act: 'RepairChangeTrouble',
        Data: JSON.stringify({
          ID,
          TroubleID
        })
      }
      return api.globalQuery(opt)
    },
    refuse (ID, RefuseReason) {
      let opt = {
        Act: 'RepairRefuse',
        Data: JSON.stringify({
          ID,
          RefuseReason
        })
      }
      return api.globalQuery(opt)
    },
    submit (ID, AdminID) {
      let opt = {
        Act: 'RepairChooseEngineer',
        Data: JSON.stringify({
          ID,
          AdminID
        })
      }
      return api.globalQuery(opt)
    },
    passTreated (ID) {
      let opt = {
        Act: 'RepairDealPass',
        Data: JSON.stringify({
          ID
        })
      }
      return api.globalQuery(opt)
    },
    refuseTreated (ID, ReturnMsg) {
      let opt = {
        Act: 'RepairDealRefuse',
        Data: JSON.stringify({
          ID,
          ReturnMsg
        })
      }
      return api.globalQuery(opt)
    }
  }
}
export default repair
