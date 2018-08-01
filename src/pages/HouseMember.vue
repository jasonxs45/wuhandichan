<template>
  <div class="house-member">
    <div class="house-member-wrapper">
      <div class="house-info">
        <Fitimg v-if="house.StageImg" :src="house.StageImg" class="bg"/>
        <div class="wrapper">
          <div class="top">
            <div class="project">
              <span class="name">{{house.ProjectName}}</span>
            </div>
            <p class="stage">{{house.StageName}} {{house.Building}} - {{house.Unit}}单元{{house.HouseNo}}</p>
          </div>
        </div>
      </div>
      <div class="memberlist">
        <template
          v-for="(item, index) in list"
        >
          <Split :key="'split-'+index+Math.random().toString(36).substr(2)"/>
          <div
            :key="'member-'+index+Math.random().toString(36).substr(2)"
            :class="item.classType"
            :data-id="item.ID"
            class="member-item"
          >
            <div class="member">
              <Avatar :src="item.HeadImgUrl"/>
              <span class="name">{{item.Name}}</span>
              <span class="tag" :class="item.classType">{{item.OwnerType}}</span>
              <Btn v-if="house.BindType === 3 || house.BindType === item.BindType" type="base" text="房源解绑" @click.stop="unBind(house.BindType, item.BindType, item.ID)"/>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Split,
  Btn,
  Avatar,
  Fitimg
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
import { mapActions } from 'vuex'
const OWNER_TYPE = 3
const RELA_TYPE = 2
const RENT_TYPE = 1
export default {
  name: 'HouseMember',
  components: {
    Split,
    Btn,
    Avatar,
    Fitimg
  },
  data () {
    return {
      id: null,
      memberList: [],
      house: {}
    }
  },
  computed: {
    list () {
      this.memberList.forEach((item) => {
        item.classType = item.BindType === OWNER_TYPE || item.BindType === 4
                         ? 'owner'
                         : item.BindType === RELA_TYPE
                         ? 'rela'
                         : item.BindType === RENT_TYPE
                         ? 'rent'
                         : ''
        item.SignTime = formatDate(new Date(item.SignTime), 'yyyy/MM/dd')
        item.Warranty = formatDate(new Date(item.Warranty), 'yyyy/MM/dd')
      })
      return this.memberList
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = parseInt(to.params.id)
      this.getMembers()
    }
  },
  created () {
    this.id = parseInt(this.$route.params.id)
    this.getMembers()
  },
  methods: {
    ...mapActions([
      'getInfoAsync'
    ]),
    getMembers () {
      api.myHouse.member(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.memberList = res.data.Data.MemberList
          this.house = res.data.Data.House
          this.house.SignTime = formatDate(new Date(this.house.SignTime), 'yyyy/MM/dd')
          this.house.Warranty = formatDate(new Date(this.house.Warranty), 'yyyy/MM/dd')
          this.house.StageImg = webRoot + this.house.StageImg
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    unBind (type1, type2, memberid) {
      let _self = this
      api.myHouse.unBind(this.house.ID, memberid)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.memberList.splice(
            this.memberList.findIndex(item => item.ID === memberid),
            1
          )
          // this.getInfoAsync()
          let idx = window.$alert({
            content: '解绑成功',
            yes () {
              window.$close(idx)
              if (type1 === type2) {
                _self.$router.push({
                  name: 'usercenter'
                })
              }
            }
          })
        } else {
          let idx = window.$alert({
            content: res.data.Message,
            yes () {
              window.$close(idx)
              _self.$router.push({
                name: 'usercenter'
              })
            }
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.house-member{
  .house-member-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(150);
    .house-info{
      width:100%;
      height: p2r(240);
      text-align: center;
      background: $primary-color;
      position: relative;
      overflow: hidden;
      .bg{
        position: absolute;
        width:100%;
        height: 100%;
        position: absolute;
        top:0;
        left:0;
        z-index:0;
        filter: blur(10px);
      }
      .wrapper{
        z-index:1;
        position: relative;
        background: rgba(0,0,0,.2);
        width:100%;
        height:100%;
        padding: p2r($base-padding)  p2r($base-padding) 0;
        backdrop-filter: blur(10px);
        .top{
          .project{
            padding-top: p2r(40);
            font-size: 0;
            .name{
              font-size: p2r(48);
              font-weight: 600;
              color:#fff;
            }
          }
          .stage{
            font-size: p2r(28);
            color:#fff;
            margin-top: p2r(20);
            font-weight: 200;
          }
        }
        .bottom{
          color:#fff;
          margin-top: p2r(40);
          padding: 0 p2r(30);
          font-size: 0;
          .sign-time,
          .repair-time{
            display: inline-block;
            vertical-align: top;
            font-size: p2r(24);
            font-weight: 200;
            width:50%;
            text-align: left;
          }
          .repair-time{
            text-align: right;
          }
        }
      }

    }
    .memberlist{
      .member-item{
        position: relative;
        padding:0 p2r($base-padding);
        height: p2r(200);
        @include _1px();
        &:before{
          content: '';
          display: block;
          width:4px;
          height: 100%;
          position: absolute;
          left:0;
          top:0;
          background: #ccc;
        }
        &.owner{
          &:before{
            background: $warning-color
          }
        }
        &.rela{
          &:before{
            background: $success-color
          }
        }
        &.rent{
          &:before{
            background: $link-color
          }
        }
        .member{
          font-size: 0;
          .avatar,
          .name,
          .tag,
          .btn{
            display: inline-block;
            vertical-align: middle;
            line-height: p2r(200);
          }
          .name{
            color: $text-color;
            font-size: p2r(36);
            font-weight: 600;
            margin-left: p2r(20);
          }
          .tag{
            font-size: p2r(20);
            padding:0 .3rem;
            height: p2r(36);
            line-height: p2r(36);
            background: #333;
            border-radius:25px;
            color:#fff;
            font-weight: 200;
            display: inline-block;
            vertical-align: middle;
            margin-left: p2r(10);
            &.owner{
              background: $warning-color
            }
            &.rela{
              background: $success-color
            }
            &.rent{
              background: $link-color
            }
          }
          .btn{
            width: p2r(140);
            font-size: p2r(24);
            border:1px solid #ddd;
            height: p2r(60);
            line-height: p2r(60);
            padding:0;
            border-radius: 4px;
            color:$thr-color;
            float:right;
            margin-top: p2r(70);
          }
        }
      }
    }
  }
  .decrator{
    width:p2r(420);
    display: block;
    margin: p2r(-100) auto 0;
  }
}
</style>
