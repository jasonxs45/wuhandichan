/* eslint-disable no-unused-vars */
const webRoot = process.env.NODE_ENV === 'production' ? 'https://whdc.1juke.cn' : 'https://whdc.1juke.cn'
let entries = [
  {
    name: '我的房源',
    icon: 'user',
    link: '/myhouses'
  },
  {
    name: '我的积分',
    icon: 'coin',
    link: '/mypoints'
  },
  {
    name: '个人中心',
    icon: 'user',
    link: '/usercenter'
  },
  {
    name: '合同查询',
    icon: 'graph',
    link: '/tradeprogress'
  },
  {
    name: '工程进度',
    icon: 'msg',
    link: '/projectprogress'
  },
  {
    name: '业主报修',
    icon: 'repair',
    link: '/repairsubmit'
  },
  // {
  //   name: '业主报修记录',
  //   icon: 'repair',
  //   link: '/repairuser/untreated'
  // },
  {
    name: '新闻中心',
    icon: 'news',
    link: '/newscenter'
  },
  {
    name: '投诉建议',
    icon: 'suggest',
    // link: '/adviseuser/untreated',
    link: '/advisesubmit'
  },
  {
    name: '社区活动',
    icon: 'activity',
    link: '/activitylist/activity'
  },
  {
    name: '我的活动',
    icon: 'activity',
    link: '/activitylist/mine'
  },
  {
    name: '预约保养',
    icon: 'signup',
    link: '/activitylist/signup'
  },
  {
    name: '开放交付',
    icon: 'key',
    link: '/activitylist/accept'
  },
  {
    name: '武汉地产家书',
    icon: 'books',
    link: '/magazine'
  },
  {
    name: '服务指南',
    icon: 'guide',
    link: '/guide'
  },
  {
    name: '我的资料',
    icon: 'set',
    link: '/myinfo'
  }
  // ,{
  //   name: '调查问卷',
  //   icon: 'graph',
  //   link: '/investigatelist'
  // }
]
// 提交报修的类别
let posRoom = [
  {
    'id': '240',
    'title': '入户门'
  },
  {
    'id': '241',
    'title': '客厅'
  },
  {
    'id': '242',
    'title': '餐厅'
  },
  {
    'id': '244',
    'title': '卧室'
  },
  {
    'id': '245',
    'title': '阳台'
  },
  {
    'id': '246',
    'title': '卫生间'
  },
  {
    'id': '260',
    'title': '厨房'
  },
  {
    'id': '681',
    'title': '其他'
  }
]
let posLocation = [
  {
    'id': '301',
    'title': '墙面'
  },
  {
    'id': '302',
    'title': '地面'
  },
  {
    'id': '303',
    'title': '天花'
  },
  {
    'id': '304',
    'title': '给水'
  },
  {
    'id': '305',
    'title': '管道（排水）'
  },
  {
    'id': '306',
    'title': '烟道'
  },
  {
    'id': '307',
    'title': '铝合金门窗'
  }
]
const NAME_REG = /^[\u4e00-\u9fa5]{2,6}$/i
const TEL_REG = /^1([3,4,5,7,8]{1}[0-9]{9})$/i
const ID_CHECK = (idcard) => {
  const Errors = [
    '验证通过!',
    '身份证号码位数不对!',
    '身份证号码出生日期超出范围或含有非法字符!',
    '身份证号码校验错误!',
    '身份证地区非法!'
  ]
  const area = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  let Y, JYM, S, M
  let idcardArray = idcard.split('')
  // 地区检验
  if (area[parseInt(idcard.substr(0, 2))] === null) {
    return false
  }
  // 身份号码位数及格式检验
  let ereg
  switch (idcard.length) {
    case 15:
      if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
         // 测试出生日期的合法性
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/
      } else {
         // 测试出生日期的合法性
        ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/
      }
      if (ereg.test(idcard)) {
        return true
      } else {
        return false
      }
    case 18:
      // 18位身份号码检测
      // 出生日期的合法性检查
      // 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
      // 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
      if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
        // 闰年出生日期的合法性正则表达式
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
      } else {
        // 平年出生日期的合法性正则表达式
        ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
      }
      // 测试出生日期的合法性
      if (ereg.test(idcard)) {
        // 计算校验位
        S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 +
        (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 +
        (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 +
        (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 +
        (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 +
        (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 +
        (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 +
        parseInt(idcardArray[7]) * 1 +
        parseInt(idcardArray[8]) * 6 +
        parseInt(idcardArray[9]) * 3
        Y = S % 11
        M = 'F'
        JYM = '10x98765432'
        // 判断校验位
        M = JYM.substr(Y, 1)
        if (M === idcardArray[17].toLocaleLowerCase()) {
          // 检测ID的校验位
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    default:
      return false
  }
}
const ID_REG = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/i
const LAST_FOUR_REG = /\d{3}[0-9Xx]/i
export {
  webRoot,
  entries,
  posRoom,
  posLocation,
  NAME_REG,
  TEL_REG,
  ID_CHECK,
  LAST_FOUR_REG
}
