<template>
  <div class="investigate">
    <div class="panel">
      <h2 class="title">{{title}}</h2>
      <p class="desc">{{desc}}</p>
      <Split type="line" />
      <div class="questions">
        <dl
          v-for="(item, index1) in questions.List"
          :key="'question-'+index1"
          class="question"
        >
          <dt class="tit">
            <p class="num">{{item.Number}}、</p>
            <p class="text">{{item.Question}}<span v-if="item.Type==='多选'" class="multiple-mark">【多选】</span></p>
          </dt>
          <dd class="options">
            <div v-if="item.Type==='填空'">
              <XTextarea
                v-if="!readonly"
                placeholder="说点什么吧。。。"
                :value="item.MyAnswer[0]"
                :disabled="readonly"
                :name="'ques'+item.ID"
                @input="gatherAnswer"
                @change="gatherAnswer"
              />
              <div v-if="readonly" class='showtext'>{{item.MyAnswer[0]}}</div>
            </div>
            <template v-else>
              <div
                v-for="(opt, index) in item.Answer"
                :key="'opt-'+index"
                class="option-wrapper"
              >
                <label class="radio-wrapper">
                  <input
                    :type="item.Type==='多选'?'checkbox':'radio'"
                    :name="'ques'+item.ID"
                    :value="opt"
                    :checked="item.MyAnswer.includes(opt)"
                    :disabled="readonly"
                    class="radio"
                    @input="gatherAnswer"
                    @change="gatherAnswer"
                  >
                  <p class="option">
                    <Icon class="checked" :name="item.Type==='多选'?'checkbox-checked':'radio-check'"/>
                    <Icon class="unchecked" :name="item.Type==='多选'?'checkbox':'radio'"/>
                    <span class="text">{{opt}}{{item.MyAnswer[2]}}</span>
                  </p>
                </label>
              </div>
            </template>
          </dd>
        </dl>
      </div>
    </div>
    <Btn size="lar" text="确定" @click="saveAnswer"/>
  </div>
</template>
<script>
import {
  Split,
  Btn,
  Flexbox,
  FlexboxItem,
  Icon,
  XTextarea
} from 'components'
import api from 'common/api'
let $ = str => {
  return document.querySelector(str)
}
let $$ = str => {
  return document.querySelectorAll(str)
}
export default {
  name: 'Investigate',
  components: {
    Split,
    Btn,
    Flexbox,
    FlexboxItem,
    Icon,
    XTextarea
  },
  data () {
    return {
      id: null,
      readonly: null,
      questions: {},
      myAnswer:{}
    }
  },
  computed: {
    title () {
      if (this.questions.Info) {
        return this.questions.Info.Title
      }
    },
    desc () {
      if (this.questions.Info) {
        return this.questions.Info.Desc
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getInvestigate()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getInvestigate()
  },
  methods: {
    getInvestigate () {
      api.investigate.list(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let questions = res.data.Data
          this.readonly = questions.Joined
          questions.List.forEach(item => {
            item.Answer = item.Answer.split('|')
            item.MyAnswer = item.MyAnswer.split('|')
          })
          this.questions = questions
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    gatherAnswer (e) {
      if (e === event) {
        let questionID = e.target.name.replace('ques', '')
        if (e.target.type === 'radio') {
          this.myAnswer[questionID] = $(`input[name=${e.target.name}]:checked`).value
        }
        if (e.target.type === 'checkbox') {
          this.myAnswer[questionID] = Array.from($$(`input[name=${e.target.name}]:checked`)).map(item => item.value).join('|')
        }
      } else {
        let questionID = event.target.name.replace('ques', '')
        this.myAnswer[questionID] = e
      }
    },
    saveAnswer () {
      let _self = this
      if (this.questions.Joined) {
        let index = window.$alert({
          content: '您已提交过，请勿重复提交',
          yes () {
            window.$close(index)
            _self.$router.push({
              name: 'usercenter'
            })
          }
        })
        return
      }
      if (Object.keys(this.myAnswer).length < 1) {
        window.$alert('请填写问卷')
        return
      }
      let entries = Object.entries(this.myAnswer)
      let ids = entries.map(item => item[0])
      let submitArr = []
      let missArr = []
      for (let i = 0; i < this.questions.List.length; i++) {
        let obj = this.questions.List[i]
        if (ids.includes('' + obj.ID)) {
          submitArr.push({
            QuestionID: obj.ID,
            Result: entries.find(item => item[0] === '' + obj.ID)[1]
          })
        } else {
          submitArr.push({
            QuestionID: obj.ID,
            Result: ''
          })
          if (obj.Type !== '填空') {
            missArr.push({
              sort: i,
              num: obj.Number
            })
          }
        }
      }
      if (missArr.length) {
        let { num } = missArr[0]
        // let type = this.questions.List[sort].Type
        window.$alert(`请对第${num}题进行作答`)
        return
      }
      api.investigate.save(submitArr)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '提交成功',
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
@import "~common/scss/iconfont.scss";
.investigate{
  width:100vw;
  height: 100vh;
  overflow: hidden;
  background:lighten($primary-color, 2%);
  position: relative;
  padding:p2r($base-padding*2) p2r($base-padding) p2r($base-padding);
  .panel{
    width:100%;
    height:calc(100% - 2.5rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    border-radius: 4px;
    padding:p2r($base-padding);
    .title{
      font-size: p2r(28);
      color:$primary-color;
      text-align: center;
      margin-top: p2r(50);
    }
    .desc{
      font-size: p2r(24);
      font-weight: 200;
      color:$text-color;
      margin-top: p2r(40);
      line-height: 1.4;
    }
    .split{
      margin-top: p2r(60);
    }
    .questions{
      padding: {
        top:p2r(20);
      };
      .question{
        margin: {
          top: p2r(60);
        }
        .tit{
          color:$text-color;
          line-height: 1.4;
          font-size: 0;
          .num{
            font-size: p2r(28);
            display: inline-block;
            width: p2r(50);
            vertical-align: top;
          }
          .text{
            display: inline-block;
            font-size: p2r(28);
            width: calc(100% - 1.1rem);
            vertical-align: top;
          }
          .multiple-mark{
            color:$primary-color;
          }
          &:after{
            content: '';
            display: block;
            clear: both;
          }
        }
        .options{
          .option-wrapper{
            margin-top: p2r(30);
            .radio-wrapper{
              display: inline-block;
              .radio{
                display: block;
                width:100%;
                height: 100%;
                top:0;
                left:0;
                opacity: 0;
                &:checked + .option{
                  color: $text-sub-color !important;
                  .iconfont{
                    color:$primary-color;
                    &.unchecked{
                      display: none;
                    }
                    &.checked{
                      display: inline-block;
                    }
                  }
                }
                &:disabled + .option{
                  color:$btn-disable-color;
                }
              }
              .option{
                position: relative;
                font-size: 0;
                color:$text-sub-color;
                line-height: 1.4;
                .iconfont{
                  display: inline-block;
                  width: p2r(40);
                  font-size: p2r(28);
                  &.checked{
                    display: none;
                  }
                  &.ubchecked{
                    display: inline-block;
                  }
                }
                .text{
                  font-size: p2r(28);
                }
              }
            }
          }
          .textarea-wrapper{
            width:100%;
            margin-top: p2r(30);
          }
        }
      }
    }
    .showtext{
      border-radius: 4px;
      width:100%;
      min-height: p2r(200);
      display: inline-block;
      background: lighten($primary-color, 68%);
      padding:p2r(20);
      margin: p2r(30) 0;
      font-size: p2r(24);
      color:$text-color;
    }
  }
  .btn{
    margin-top: p2r(30);
  }
}
</style>
