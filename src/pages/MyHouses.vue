<template>
  <div class="myhouses">
    <div class="myhouses-wrapper">
      <userinfo type-class="rectangle" :tagText="(list.length<1?'绑定':'添加')+'房源'" @tagClick="goBind"></userinfo>
      <div class="content">
        <nodata v-if="list.length<1">业主绑定房源可享受更多服务</nodata>
        <template
          v-for="(item, index) in list"
        >
          <Split :key="'split-'+index+Math.random().toString(36).substr(2)"/>
          <div
            :key="'house-'+index+Math.random().toString(36).substr(2)"
            :class="item.classType"
            :data-id="item.ID"
            class="house-item"
          >
            <div class="top">
              <div class="project">
                <span class="name">{{item.ProjectName}}</span>
                <span v-if="item.OwnerType" class="tag" :class="item.classType">{{item.OwnerType}}</span>
              </div>
              <p class="stage">{{item.StageName}} {{item.Building}} - {{item.Unit}}单元{{item.HouseNo}}</p>
              <flexbox class="stage" justify="justify">
                <!-- <flexbox-item>建筑面积：{{item.BuildArea || '--'}}㎡</flexbox-item> -->
                <flexbox-item>合同交付日期：{{item.ContractDate}}</flexbox-item>
              </flexbox>
            </div>
            <Btn type="base" text="成员列表" @click.stop="goMembers(item.ID)"/>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Userinfo,
  Split,
  Nodata,
  Btn
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
const OWNER_TYPE_SECOND = 4
const OWNER_TYPE = 3
const RELA_TYPE = 2
const RENT_TYPE = 1
export default {
  name: 'MyHouses',
  components: {
    Flexbox,
    FlexboxItem,
    Userinfo,
    Split,
    Nodata,
    Btn
  },
  data () {
    return {
      houseList: []
    }
  },
  computed: {
    list () {
      this.houseList.forEach((item) => {
        item.classType = (item.BindType === OWNER_TYPE || item.BindType === OWNER_TYPE_SECOND)
                         ? 'owner'
                         : item.BindType === RELA_TYPE
                         ? 'rela'
                         : item.BindType === RENT_TYPE
                         ? 'rent'
                         : ''
        item.SignTime = formatDate(new Date(item.SignTime), 'yyyy/MM/dd')
        item.Warranty = formatDate(new Date(item.Warranty), 'yyyy/MM/dd')
        item.ContractDate = formatDate(new Date(item.ContractDate), 'yyyy/MM/dd')
      })
      return this.houseList
    }
  },
  created () {
    this.getMyHouses()
  },
  methods: {
    getMyHouses () {
      api.myHouse.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.houseList = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    goMembers (id) {
      this.$router.push({
        name: 'housemember',
        params: {
          id
        }
      })
    },
    goBind () {
      this.$router.push({
        name: 'bind'
      })
    },
    unBindMe (houseid) {
      api.myHouse.unBindMe(houseid)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert('解绑成功')
          this.houseList.splice(
            this.houseList.findIndex(item => item.ID === houseid),
            1
          )
        } else {
          window.$alert(res.data.Message)
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
.myhouses{
  .myhouses-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(150);
    .content{
      width:100%;
      position: relative;
      .nodata{
        margin-top: p2r(100);
      }
      .house-item{
        position: relative;
        min-height: p2r(30);
        padding: p2r($base-padding);
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
        .top{
          padding:0 0 p2r(20);
          .project{
            font-size: 0;
            margin-top: p2r(20);
            .name{
              font-size: p2r(30);
              font-weight: 600;
              display: inline-block;
              vertical-align: middle;
            }
            .tag{
              font-size: p2r(20);
              padding:.1rem .3rem;
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
          }
          .stage{
            font-size: p2r(24);
            color: $text-sub-color;
            margin-top: p2r(20);
          }
        }
        .bottom{
          color:$thr-color;
          font-weight: 200;
          margin-top: p2r(20);
          font-size: 0;
          .sign-time,
          .repair-time{
            display: inline-block;
            vertical-align: top;
            font-size: p2r(24);
            width:50%;
          }
          .repair-time{
            text-align: right;
          }
        }
        .btn{
          position: absolute;
          width: p2r(140);
          font-size: p2r(24);
          top:p2r($base-padding * 2);
          right:p2r($base-padding);
          border:1px solid #ddd;
          height: p2r(60);
          line-height: p2r(60);
          padding:0;
          border-radius: 4px;
          color:$thr-color;
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
