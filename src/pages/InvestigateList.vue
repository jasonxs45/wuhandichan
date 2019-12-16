<template>
  <div class='investigate-manager-list'>
    <div v-for='(item, index) in list' :key='"item-" + index' class='investigate-item' @click='goDetail(item.ID)'>
      <div class='content'>
        <h4 class='title'>{{item.Title}}</h4>
        <p class='desc' style='-webkit-box-orient: vertical;'>{{item.Desc}}</p>
      </div>
    </div>
    <div v-if='list.length <= 0' class='holder'>
      <Nodata />
      <p class='text'>暂无内容</p>
    </div>
  </div>
</template>
<script>
import api from 'common/api'
import {
  Nodata
} from 'components'
export default {
  name: 'InvestigateList',
  components: {
    Nodata
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    getlist () {
      api.investigate.invesList()
        .then(res => {
          const { IsSuccess, Message, Data: list } = res.res.data
          if (IsSuccess) {
            console.log(Message)
            this.list = list
          } else {
            window.$alert(Message)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    goDetail (id) {
      this.$router.push(`/investigate/${id}`)
    },
    pass (res, id) {
      event.stopPropagation()
      api.investigate.pass(res, id)
        .then(res => {
          const { IsSuccess, Message } = res.res.data
          if (IsSuccess) {
            this.getlist()
          } else {
            window.$alert(Message)
          }
          let index = window.$alert({
            content: Message,
            yes () {
              window.$close(index)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    this.getlist()
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
@import "~common/scss/iconfont.scss";
.investigate-item{
  margin: p2r(30);
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, .1);
  background: #fff;
  display: flex;
  border-radius: p2r(8);
}
.content{
  flex: 1;
  padding: p2r(15);
  .title{
    font-size: p2r(30);
    line-height: 1.5;
    color:$primary-color;
  }
  .desc{
    line-height: 1.5;
    color: #999;
    display: -webkit-box;
    flex-direction: column;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 8px;
  }
}
.btn{
  flex: 0 0 p2r(120);
  width: p2r(120);
  text-align: center;
  position: relative;
  &.yes{
    background:lighten($success-color, 2%);
    color: #fff;
    border-radius: 0 p2r(8) p2r(8) 0;
  }
  &.no{
    background: #f2f2f2;
    color: #666;
  }
  .txt{
    position: absolute;
    width: 100%;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: p2r(28);
  }
}
.holder{
  padding: 100px 30px 0;
  text-align: center;
  .text{
    font-size: 14px;
    color: #ccc;
  }
}
</style>
