const Home = r => require.ensure([], () => r(require('pages/Home')), 'Home')
const Usercenter = r => require.ensure([], () => r(require('pages/Usercenter')), 'Usercenter')
const MyHouses = r => require.ensure([], () => r(require('pages/MyHouses')), 'MyHouses')
const HouseMember = r => require.ensure([], () => r(require('pages/HouseMember')), 'HouseMember')

const MyPoints = r => require.ensure([], () => r(require('pages/MyPoints')), 'MyPoints')
const MyInfo = r => require.ensure([], () => r(require('pages/MyInfo')), 'MyInfo')

const TradeProgress = r => require.ensure([], () => r(require('pages/TradeProgress')), 'TradeProgress')
const Contract = r => require.ensure([], () => r(require('pages/tradeprogress/Contract')), 'Contract')
const Lincense = r => require.ensure([], () => r(require('pages/tradeprogress/Lincense')), 'Lincense')

const ThirdServiceProgress = r => require.ensure([], () => r(require('pages/ThirdServiceProgress')), 'ThirdServiceProgress')
const Open = r => require.ensure([], () => r(require('pages/thirdserviceprogress/Open')), 'Open')
const Deliver = r => require.ensure([], () => r(require('pages/thirdserviceprogress/Deliver')), 'Deliver')

const Regist = r => require.ensure([], () => r(require('pages/Regist')), 'Regist')
const Bind = r => require.ensure([], () => r(require('pages/Bind')), 'Bind')
const BindOwner = r => require.ensure([], () => r(require('pages/bind/BindOwner')), 'BindOwner')
const BindRelative = r => require.ensure([], () => r(require('pages/bind/BindRelative')), 'BindRelative')
const BindRenter = r => require.ensure([], () => r(require('pages/bind/BindRenter')), 'BindRenter')
const BindSecond = r => require.ensure([], () => r(require('pages/bind/BindSecond')), 'BindSecond')
const BindOwnerConfirm = r => require.ensure([], () => r(require('pages/bind/BindOwnerConfirm')), 'BindOwnerConfirm')

const ActivityList = r => require.ensure([], () => r(require('pages/ActivityList')), 'ActivityList')
const ActivityDetail = r => require.ensure([], () => r(require('pages/ActivityDetail')), 'ActivityDetail')
const QRCodeCheck = r => require.ensure([], () => r(require('pages/QRCodeCheck')), 'QRCodeCheck')

const RepairUser = r => require.ensure([], () => r(require('pages/RepairUser')), 'RepairUser')
const RepairEngineer = r => require.ensure([], () => r(require('pages/RepairEngineer')), 'RepairEngineer')
const RepairOrderAllot = r => require.ensure([], () => r(require('pages/RepairOrderAllot')), 'RepairOrderAllot')
const RepairUserDetail = r => require.ensure([], () => r(require('pages/RepairUserDetail')), 'RepairUserDetail')
const RepairEngineerDetail = r => require.ensure([], () => r(require('pages/RepairEngineerDetail')), 'RepairEngineerDetail')
const RepairEngineerManager = r => require.ensure([], () => r(require('pages/RepairEngineerManager')), 'RepairEngineerManager')
const RepairEngineerManagerDetail = r => require.ensure([], () => r(require('pages/RepairEngineerManagerDetail')), 'RepairEngineerManagerDetail')
const RepairManager = r => require.ensure([], () => r(require('pages/RepairManager')), 'RepairManager')
const RepairManagerDetail = r => require.ensure([], () => r(require('pages/RepairManagerDetail')), 'RepairManagerDetail')
const RepairSubmit = r => require.ensure([], () => r(require('pages/RepairSubmit')), 'RepairSubmit')

const AdviseUser = r => require.ensure([], () => r(require('pages/AdviseUser')), 'AdviseUser')
const AdviseManager = r => require.ensure([], () => r(require('pages/AdviseManager')), 'AdviseManager')
const AdviseDetail = r => require.ensure([], () => r(require('pages/AdviseDetail')), 'AdviseDetail')
const AdviseManagerDetail = r => require.ensure([], () => r(require('pages/AdviseManagerDetail')), 'AdviseManagerDetail')
const AdviseSubmit = r => require.ensure([], () => r(require('pages/AdviseSubmit')), 'AdviseSubmit')

const NewsCenter = r => require.ensure([], () => r(require('pages/NewsCenter')), 'NewsCenter')
const NewsDetail = r => require.ensure([], () => r(require('pages/NewsDetail')), 'NewsDetail')

const Magazine = r => require.ensure([], () => r(require('pages/Magazine')), 'Magazine')
const MagazineInner = r => require.ensure([], () => r(require('pages/MagazineInner')), 'MagazineInner')
const MagazineDetail = r => require.ensure([], () => r(require('pages/MagazineDetail')), 'MagazineDetail')

const ProjectProgress = r => require.ensure([], () => r(require('pages/ProjectProgress')), 'ProjectProgress')
const MonthlyProgress = r => require.ensure([], () => r(require('pages/MonthlyProgress')), 'MonthlyProgress')
const ProgressDetail = r => require.ensure([], () => r(require('pages/ProgressDetail')), 'ProgressDetail')

const Investigate = r => require.ensure([], () => r(require('pages/Investigate')), 'Investigate')

const MessageCenter = r => require.ensure([], () => r(require('pages/MessageCenter')), 'MessageCenter')
const ProjectMap = r => require.ensure([], () => r(require('pages/ProjectMap')), 'ProjectMap')
const ProjectIntro = r => require.ensure([], () => r(require('pages/ProjectIntro')), 'ProjectIntro')

const Guide = r => require.ensure([], () => r(require('pages/Guide')), 'Guide')
const GuideDetail = r => require.ensure([], () => r(require('pages/GuideDetail')), 'GuideDetail')
const PageNotFound = r => require.ensure([], () => r(require('pages/PageNotFound')), 'PageNotFound')
const Wait = r => require.ensure([], () => r(require('pages/Wait')), 'Wait')
const Menu = r => require.ensure([], () => r(require('pages/Menu')), 'Menu')
const OnlineCustomerService = r => require.ensure([], () => r(require('pages/OnlineCustomerService')), 'OnlineCustomerService')
export default [
  // 主页
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  // 404
  {
    path: '*',
    name: 'pagenotfound',
    component: PageNotFound
  },
  // 建设中
  {
    path: '/wait',
    name: 'wait',
    component: Wait
  },
  // 个人中心
  {
    path: '/usercenter',
    name: 'usercenter',
    component: Usercenter,
    meta: {
      title: '个人中心'
    }
  },
  // 我的房源
  {
    path: '/myhouses',
    name: 'myhouses',
    component: MyHouses,
    meta: {
      title: '我的房源'
    }
  },
  // 房源成员列表
  {
    path: '/housemember/:id',
    name: 'housemember',
    component: HouseMember,
    meta: {
      title: '成员列表'
    }
  },
  // 我的积分
  {
    path: '/mypoints',
    name: 'mypoints',
    component: MyPoints,
    meta: {
      title: '我的积分'
    }
  },
  // 我的资料
  {
    path: '/myinfo',
    name: 'myinfo',
    component: MyInfo,
    meta: {
      title: '修改资料'
    }
  },
  // 购房进度
  {
    path: '/tradeprogress',
    name: 'tradeprogress',
    component: TradeProgress,
    meta: {
      title: '合同/产证'
    },
    redirect: '/tradeprogress/contract',
    children: [
      {
        path: 'contract',
        name: 'contract',
        component: Contract,
        meta: {
          title: '合同进度'
        }
      },
      {
        path: 'lincense',
        name: 'lincense',
        component: Lincense,
        meta: {
          title: '产证进度'
        }
      }
    ]
  },
  // 工地开放 集中交付
  {
    path: '/thirdserviceprogress',
    name: 'thirdserviceprogress',
    component: ThirdServiceProgress,
    meta: {
      title: ''
    },
    redirect: '/tradeprogress/open',
    children: [
      {
        path: 'open',
        name: 'open',
        component: Open,
        meta: {
          title: '工地开放验房查询'
        }
      },
      {
        path: 'deliver',
        name: 'deliver',
        component: Deliver,
        meta: {
          title: '集中交付验房查询'
        }
      }
    ]
  },
  {
    path: '/regist',
    name: 'regist',
    component: Regist,
    meta: {
      title: '会员注册'
    }
  },
  // 绑定入口
  {
    path: '/bind',
    name: 'bind',
    component: Bind,
    meta: {
      title: '用户绑定'
    }
  },
  // 业主绑定
  {
    path: '/bind/bindowner',
    name: 'bindowner',
    component: BindOwner,
    meta: {
      title: '业主绑定'
    }
  },
  // 家属绑定
  {
    path: '/bind/bindrelative',
    name: 'bindrelative',
    component: BindRelative,
    meta: {
      title: '家属绑定'
    }
  },
  // 租户绑定
  {
    path: '/bind/bindrenter',
    name: 'bindrenter',
    component: BindRenter,
    meta: {
      title: '租户绑定'
    }
  },
  // 二手业主
  {
    path: '/bind/bindsecond',
    name: 'bindsecond',
    component: BindSecond,
    meta: {
      title: '二手业主绑定'
    }
  },
  // 业主审核
  {
    path: '/bind/bindownerconfirm/type/:typeid/member/:memberid',
    name: 'bindownerconfirm',
    component: BindOwnerConfirm,
    meta: {
      title: '业主审核'
    }
  },
  // 活动 交付  收房列表
  {
    path: '/activitylist/:classtype',
    name: 'activitylist',
    component: ActivityList,
    meta: {
      title: '会员活动'
    }
  },
  // 活动报名二维码
  {
    path: '/qrcodecheck/:id',
    name: 'qrcodecheck',
    component: QRCodeCheck,
    meta: {
      title: '活动签到'
    }
  },
  // 活动详情
  {
    path: '/activitydetail/:id',
    name: 'activitydetail',
    component: ActivityDetail,
    meta: {
      title: '详情'
    }
  },
  // 报修用户
  {
    path: '/repairuser/:state',
    name: 'repairuser',
    component: RepairUser,
    meta: {
      title: '业主报修'
    }
  },
  // 报修提交
  {
    path: '/repairsubmit',
    name: 'repairsubmit',
    component: RepairSubmit,
    meta: {
      title: '提交报修'
    }
  },
  // 报修工程师
  {
    path: '/repairengineer/:state',
    name: 'repairengineer',
    component: RepairEngineer,
    meta: {
      title: '业主报修'
    }
  },
  // 报修工程师主管
  {
    path: '/repairengineermanager/:state',
    name: 'repairengineermanager',
    component: RepairEngineerManager,
    meta: {
      title: '业主报修'
    }
  },
  // 报修管理员
  {
    path: '/repairmanager/:state',
    name: 'repairmanager',
    component: RepairManager,
    meta: {
      title: '业主报修'
    }
  },
  // 报修单详情-----用户
  {
    path: '/repairuserdetail/:id',
    name: 'repairuserdetail',
    component: RepairUserDetail,
    meta: {
      title: '详情'
    }
  },
  // 报修单详情-----工程师
  {
    path: '/repairengineerdetail/:id',
    name: 'repairengineerdetail',
    component: RepairEngineerDetail,
    meta: {
      title: '详情'
    }
  },
  // 报修单详情-----工程师管理员
  {
    path: '/repairengineermanagerdetail/:id',
    name: 'repairengineermanagerdetail',
    component: RepairEngineerManagerDetail,
    meta: {
      title: '详情'
    }
  },
  // 报修单详情-----客服
  {
    path: '/repairmanagerdetail/:id',
    name: 'repairmanagerdetail',
    component: RepairManagerDetail,
    meta: {
      title: '详情'
    }
  },
  // 派发
  {
    path: '/repairorderallot/:id',
    name: 'repairorderallot',
    component: RepairOrderAllot,
    meta: {
      title: '报修分类'
    }
  },
  // 投诉建议用户列表
  {
    path: '/adviseuser/:state',
    name: 'adviseuser',
    component: AdviseUser,
    meta: {
      title: '投诉建议'
    }
  },
  // 投诉建议详情
  {
    path: '/advisedetail/:role/:id',
    name: 'advisedetail',
    component: AdviseDetail,
    meta: {
      title: '详情'
    }
  },
  // 投诉建议管理员
  {
    path: '/advisemanager/:state',
    name: 'advisemanager',
    component: AdviseManager
  },
  // 投诉建议详情
  {
    path: '/advisemanagerdetail/:id',
    name: 'advisemanagerdetail',
    component: AdviseManagerDetail,
    meta: {
      title: '详情'
    }
  },
  // 投诉建议提交
  {
    path: '/advisesubmit',
    name: 'advisesubmit',
    component: AdviseSubmit,
    meta: {
      title: '提交投诉建议'
    }
  },
  // 新闻中心
  {
    path: '/newscenter',
    name: 'newscenter',
    component: NewsCenter,
    meta: {
      title: '新闻资讯'
    }
  },
  // 新闻详情
  {
    path: '/newsdetail/:id',
    name: 'newsdetail',
    component: NewsDetail,
    meta: {
      title: '详情'
    }
  },
  // 武汉地产家书列表
  {
    path: '/magazine',
    name: 'magazine',
    component: Magazine,
    meta: {
      title: '武汉地产家书'
    }
  },
  // 武汉地产家书内页
  {
    path: '/magazineinner/:id',
    name: 'magazineinner',
    component: MagazineInner,
    meta: {
      title: '列表'
    }
  },
  // 武汉地产家书详情页
  {
    path: '/magazinedetail/:id',
    name: 'magazinedetail',
    component: MagazineDetail,
    meta: {
      title: '详情'
    }
  },
  // 工程进度项目列表
  {
    path: '/projectprogress',
    name: 'projectprogress',
    component: ProjectProgress,
    meta: {
      title: '工程进度'
    }
  },
  // 工程进度月度列表
  {
    path: '/monthlyprogress/:id',
    name: 'monthlyprogress',
    component: MonthlyProgress,
    meta: {
      title: '工程进度'
    }
  },
  // 工程进度详情
  {
    path: '/progressdetail/:id',
    name: 'progressdetail',
    component: ProgressDetail,
    meta: {
      title: '详情'
    }
  },
  // 问卷调查
  {
    path: '/investigate/:id',
    name: 'investigate',
    component: Investigate,
    meta: {
      title: '问卷调查'
    }
  },
  // 消息中心
  {
    path: '/messagecenter',
    name: 'messagecenter',
    component: MessageCenter,
    meta: {
      title: '消息中心'
    }
  },
  // 项目地图
  {
    path: '/projectmap',
    name: 'projectmap',
    component: ProjectMap,
    meta: {
      title: '在售项目'
    }
  },
  // 项目介绍
  {
    path: '/projectintro/:name',
    name: 'projectintro',
    component: ProjectIntro,
    meta: {
      title: '项目介绍'
    }
  },
  // 服务指南列表
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    meta: {
      title: '服务指南'
    }
  },
  // 服务指南详情
  {
    path: '/guidedetail/:id',
    name: 'guidedetail',
    component: GuideDetail,
    meta: {
      title: '服务指南'
    }
  },
  // 在线客服
  {
    path: '/onlinecustomerservice',
    name: 'onlinecustomerservice',
    component: OnlineCustomerService,
    meta: {
      title: '在线客服'
    }
  },
  {
    path: '/menu',
    name: 'menu',
    component: Menu,
    meta: {
      title: '菜单'
    }
  }
]
