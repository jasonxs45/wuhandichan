<template>
  <div class="bind-owner">
    <div class="bind-owner-wrapper">
      <div class="part1">
        <div  class="step1" v-if="step===1">
          <x-select
            v-model="selectedItem"
            placeholder="请选择您所在的项目"
            class="roundbar"
          >
            <x-option
              v-for="(item, index) in items"
              :key="'item-'+index+Math.random().toString(36).substr(2)"
              :label="item.label"
              :value="item.value"
            ></x-option>
          </x-select>
          <XInput
            v-model="ownerName"
            placeholder="请输入您的真实姓名"
            class="roundbar"
          />
        </div>
        <div class="step2" v-if="step===2">
          <h3 class="title">筛选用户结果</h3>
          <div class="houses">
            <nodata v-if="houseInfo.length<=0">暂无数据，<br/>请确认信息是否正确！</nodata>
            <label
              v-for="(item, index) in houseInfo"
              :key="'house-info-'+index"
              class="house-bar"
            >
              <input
                v-model="houseid"
                class="radio"
                type="radio"
                name="house"
                :disabled="item.Binded"
                :value="item.ID"
                @change="radioHandler"
              />
              <flexbox>
                <flexbox-item class="house-name">
                  <p class="text">{{item.StageName}} {{item.Building}} - {{item.Unit}}单元{{item.HouseNo}}{{item.Binded?'【已绑定】':''}}</p>
                </flexbox-item>
                <flexbox-item class="owner-name">
                  {{item.Owner}}
                </flexbox-item>
              </flexbox>
            </label>
          </div>
          <p class="title">输入身份证后四位进行验证</p>
          <div class="idnum-controller">
            <div class="cells">
              <span
                v-for="n in 4"
                :key="'input-'+n"
                class="idnum-cell"
              >{{checkStr.split('')[n-1]}}</span>
            </div>
            <input
              type="text"
              maxlength="4"
              class="input"
              v-model="checkStr"
            />
          </div>
        </div>
      </div>
      <p class="caution">业主信息须与购房合同上的业主名称、<br/>身份证号信息一致，方可绑定</p>
      <div class="part2">
        <Btn v-if="step===1" type="primary" size="lar" text="下一步" @click="goStep2"/>
        <Btn v-if="step===2" type="primary" size="lar" text="确认绑定" @click="submitHandler"/>
      </div>
    </div>
    <p class="see-rights" style="display:none">
      <span @click="toggleRights">查看业主权益</span>
    </p>
    <!-- <p class="tip">从一手房市场购买武汉地产开发的房产且已完成<br />网签手续的客户，可进行业主绑定注册！</p> -->
    <transition name="fade">
      <div v-if="showRights" class="rights" @click="toggleRights">
        <div class="rights-wrapper">
          <h3 class="title">业主权益</h3>
          <div class="details">
            <dl>
              <dd>1.及时获取武汉地产的最新资讯；</dd>
              <dd>2.了解武汉地产热销楼盘信息；</dd>
              <dd>3.可通过武汉地产微信推荐其他人购房而获取丰厚奖励；</dd>
              <dd>4.可在微信上快速报修（保修期内的楼盘业主报修，须通过武汉地产微信上的“在线报修”才可报修）；</dd>
              <dd>5.可在武汉地产微信上提交自己的投诉和建议，并可发送图片；</dd>
              <dd>6.可查询武汉地产商业、写字楼、产业园区的出租信息；</dd>
              <dd>7.可参加武汉地产举办的各种线上线下精彩活动；</dd>
              <dd>8.可在武汉地产微信上发布二手房租售信息；</dd>
              <dd>9.可通过“社区市场”发布二手物品信息。</dd>
            </dl>
          </div>
        </div>
        <Btn text="我知道了" type="base" size="lar"/>
      </div>
    </transition>
  </div>
</template>
<script>
import api from 'common/api'
import {
  Flexbox,
  FlexboxItem,
  Btn,
  Icon,
  XSelect,
  XOption,
  XInput,
  Nodata
} from 'components'
import {
  NAME_REG,
  LAST_FOUR_REG
} from 'common/data'
export default {
  name: 'BindOwner',
  components: {
    Flexbox,
    FlexboxItem,
    Btn,
    Icon,
    XSelect,
    XOption,
    XInput,
    Nodata
  },
  data () {
    return {
      step: 1,
      checkNums: ['', '', '', ''],
      checkStr: '',
      items: null,
      selectedItem:'',
      ownerName:'',
      houses: null,
      houseid: null,
      showRights: false
    }
  },
  computed: {
    houseInfo () {
      return this.houses
    }
  },
  created () {
    this.getItem()
  },
  methods: {
    getUserInfo () {
      return this.$store.dispatch('getInfoAsync')
    },
    getItem () {
      api.bind.getProjectList()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let [...items] = res.data.Data
          this.items = items.map(item => {
            return {
              label: item.Name,
              value: item.ID
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getHouses () {
      api.bind.getOwnerHouseList(this.selectedItem.value, this.ownerName)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let [...houses] = res.data.Data
          this.houses = houses
          if (this.houses.length <= 0) {
            window.$alert('暂无数据，<br/>请确认信息是否正确！')
          } else {
            this.step = 2
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    radioHandler (e) {
      console.log(e.target.value)
    },
    goStep2 () {
      if (!this.selectedItem.value) {
        window.$alert('项目不能为空')
        return
      }
      if (!this.ownerName) {
        window.$alert('姓名不能为空')
        return
      }
      if (!this.ownerName.match(NAME_REG)) {
        window.$alert('请填写正确格式的姓名')
        return
      }
      this.getHouses()
    },
    submitHandler () {
      let _self = this
      if (!this.houseid) {
        window.$alert('请选择房源')
        return
      }
      if (!this.checkStr.match(LAST_FOUR_REG)) {
        window.$alert('请正确填写身份证后四位')
        return
      }
      api.bind.houseOwerBind(this.houseid, this.ownerName, this.checkStr)
      .then(({res, index}) => {
        window.$close(index)
        if (res.data.IsSuccess) {
          this.getUserInfo()
          let index = window.$alert({
            title: '恭喜您！',
            content: '绑定成功！',
            yes () {
              window.$close(index)
              _self.$router.push({
                name: 'usercenter'
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toggleRights () {
      this.showRights = !this.showRights
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.bind-owner {
  width: 100vw;
  height: 100vh;
  background: url("../../../static/images/bg.png") center/cover no-repeat;
  padding: p2r(30);
  .bind-owner-wrapper {
    width: 100%;
    // height: 88%;
    border-radius: 4px;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
    padding-top: p2r(40);
    padding-bottom: p2r(40);
    background: #fff;
    .caution{
      font-size: p2r(24);
      color:lighten($text-color, 22%);
      text-align: center;
      line-height: 1.5;
      padding:0 p2r($base-padding);
    }
    .part1 {
      height: p2r(700);
      .title {
        font-size: p2r(28);
        color: $text-color;
        text-align: center;
      }
      .houses {
        width: p2r(594);
        height: p2r(400);
        margin: p2r(30) auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .house-bar {
          display: block;
          margin-top: p2r(20);
          &:first-child {
            margin-top: 0;
          }
          .radio {
            display: block;
            width: 0;
            height: 0;
            &:checked + .flexbox {
              color: #fff;
              background: $primary-color;
            }
          }
          .flexbox {
            height: p2r(88);
            border-radius: 4px;
            padding: 0 p2r(20);
            color: $thr-color;
            background: lighten($thr-color, 30%);
            transition: color, background 0.2s;
            align-items:center;
            .house-name{
              .text{
                line-height: 1.5;
              }
            }
            .owner-name {
              flex: 0 0 p2r(150);
              font-size: p2r(24);
              text-align: right;
            }
          }
        }
      }
      .idnum-controller {
        width: p2r(490);
        margin: p2r(40) auto;
        text-align: center;
        font-size: 0;
        position: relative;
        .cells {
          .idnum-cell {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: p2r(100);
            height: p2r(100);
            background: lighten($thr-color, 38%);
            margin: 0 p2r(15);
            border-radius: 4px;
            border: 1px solid lighten($thr-color, 20%);
            font-size: p2r(28);
            line-height: p2r(100);
            text-align: center;
            color: $text-color;
            &:first-child {
              margin-left: 0;
            }
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .input {
          position: absolute;
          display: block;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          font-size: p2r(28);
          -webkit-appearance: none;
          outline: none;
          z-index: 1;
        }
      }
      .step1{
        padding-top: p2r(30);
        .roundbar{
          display: block;
          width:p2r(600);
          height: p2r(100);
          margin: p2r(50) auto;
          position: relative;
          &:first-child{
            margin-top: 0;
          }
        }
      }
      .step2{
        padding-top: p2r(30);
      }
    }
    .part2 {
      padding-top: p2r(40);
    }
  }
  .tip{
    font-size: p2r(24);
    color:lighten($text-color, 22%);
    text-align: center;
    line-height: 1.5;
    padding: p2r($base-padding);
  }
  .see-rights{
    text-align: center;
    margin-top: p2r(60);
    span{
      font-size: p2r(26);
      color:lighten($primary-color, 10%);
      text-shadow: 1px 1px 2px lighten($primary-color, 15%);
    }
  }
  .rights{
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index:99;
    background: rgba(0,0,0,.7);
    padding: p2r(30);
    .rights-wrapper{
      background: #fff;
      width:100%;
      height: calc(100% - 4rem);
      border-radius: 4px;
      padding: p2r(30);
      .title{
        text-align: center;
        color:$primary-color;
        font-size: p2r(32);
        height: p2r(100);
        line-height: p2r(100);
      }
      .details{
        line-height: 2.2;
        font-size: p2r(28);
        color:$text-color;
        height: calc(100% - 3rem);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
    .btn{
      margin-top: p2r(50);
    }
  }
}
</style>
