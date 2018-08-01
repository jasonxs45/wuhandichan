<template>
  <div class="repair-card">
    <span class="date">{{order.date}}</span>
    <h3 class="title">{{order.title}}</h3>
    <p class="desc">{{order.desc}}</p>
    <p
      v-if="order.descDetail"
      class="desc-detail"
    >
      {{order.descDetail}}
    </p>
    <flexbox
      v-if="order.ownerPhoto&&order.ownerPhoto.length>0"
      class="owner-photo"
      justify="justify"
    >
      <flexbox-item
        v-for="(item, index) in order.ownerPhoto"
        :key="'ownerPhoto-'+ order.id + index "
        class="img-wrapper"
      >
        <Fitimg
          :src="item"
          @on-click="previewImg"
        />
      </flexbox-item>
    </flexbox>
    <Split
      v-if="order.engineer"
      type="line"
    />
    <p
      v-if="order.engineer"
      class="engineer"
    >
      <span class="name">工程师：{{order.engineer.name}}</span>
      <a class="tel" :href="`tel:${order.engineer.tel}`">{{order.engineer.tel}}</a>
    </p>
    <div
      v-if="order.progress"
      class="progress"
    >
      <flexbox
        v-for="(item, index) in order.progress"
        :key="`prog-${order.id}-${index}`"
        class="info"
      >
        <flexbox-item class="text">{{item.text}}</flexbox-item>
        <flexbox-item class="date">{{item.date}}</flexbox-item>
      </flexbox>
    </div>
    <flexbox
      v-if="order.repairPhoto&&order.repairPhoto.length>0"
      class="repair-photo"
      justify="justify"
    >
      <flexbox-item
        v-for="(item, index) in order.repairPhoto"
        :key="'repairPhoto-'+ order.id + index "
        class="img-wrapper"
      >
        <Fitimg :src="item" @on-click="previewImg"/>
      </flexbox-item>
    </flexbox>
    <Btn
      v-if="order.state>1&&order.state<3&&order.rate<0"
     class="go-evaluate"
     type="primary"
     text="我要评价"
     size="lar"
    />
    <div
      v-if="order.rate"
      class="evaluation"
    >
      <p class="text">本次维修评分</p>
      <Star
        :score="order.rate"
        :size="24"
        readOnly
        @on-rate="showRate"
      />
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem
} from 'components/flexbox'
import Split from 'components/split'
import Btn from 'components/btn'
import Star from 'components/star'
import Fitimg from 'components/fitimg'
export default {
  name: 'RepairCard',
  components: {
    Flexbox,
    FlexboxItem,
    Split,
    Btn,
    Star,
    Fitimg
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    previewImg (src) {
      console.log('showImage')
    },
    showRate (val) {
      console.log('score is ' + val)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
 .repair-card{
   position: relative;
   width:100%;
  //  min-height: p2r(300);
   background:#fff;
   border-radius: 4px;
   padding:p2r(20) p2r($base-padding);
   margin:p2r(20) 0;
   &:first-child{
     margin-top: 0;
   }
   &>.date{
     display: inline-block;
     position: absolute;
     top:p2r(20);
     right: p2r($base-padding);
     line-height: p2r(28);
     font-weight: 200;
     color:$thr-color;
   }
   .title{
     font-size: p2r(28);
     color:$primary-color;
   }
   .desc{
     margin-top: p2r(20);
     padding:p2r(15) p2r(30);
     color:#fff;
     font-size: p2r(26);
     background: $primary-color;
     border-radius: 4px;
     font-weight: 200;
   }
   .desc-detail{
     font-size: p2r(24);
     color:$text-color;
     line-height: 1.4;
     margin-top: p2r(20);
   }
   .img-wrapper{
     flex:0 0 p2r(120);
     height: p2r(120);
     background: $background-color;
     border-radius: 4px;
   }
   .owner-photo,.repair-photo{
     margin-top: p2r(30);
   }
   .split{
     margin-top:p2r(40);
   }
   .engineer{
     margin-top: p2r(40);
     color:$text-sub-color;
     font-size: 0;
     &:after{
       content: '';
       display: block;
       clear: both;
     }
     .name{
       font-size: p2r(26);
       display: block;
       float: left;
     }
     .tel{
       font-size: p2r(26);
       display: block;
       float: right;
       text-align: right;
     }
   }
   .progress{
     padding:p2r($base-padding);
     font-size: p2r(24);
     background: $background-color;
     border-radius: 4px;
     color:$text-sub-color;
     margin-top: p2r(20);
     .info{
       margin:p2r(15) 0;
       &:first-child{
         margin-top: 0;
       }
       &:last-child{
         margin-bottom: 0;
       }
        .text,.date{
            font-weight: 200;
        }
        .date{
          flex:0 0 p2r(140);
          text-align: right;
        }
     }
   }
   .go-evaluate{
     margin-top: p2r(40);
   }
   .evaluation{
     margin:p2r(40) 0;
     .text{
       font-size: p2r(24);
       font-weight: 200;
       color:$text-color;
       display: inline-block;
     }
     .star{
       float: right;
     }
   }
 }
</style>
