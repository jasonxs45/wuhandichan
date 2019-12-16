<template>
  <div class="investigate">
    <div class="panel">
      <h2 class="title">{{title}}</h2>
      <p class="desc">{{desc}}</p>
      <Split type="line" />
      <div class="questions">
        <div v-show='!listShow'>
          <h4 class='tit'>请选择身份</h4>
          <div class='row'>
            <div v-for='(item, index) in identitys' :key='"identity-"+index' class='radio inline'>
              <input :checked='identityIndex === index'  class='radio-input' type='radio' name='identity' @input='onInput("identity", index)' />
              <div class='text'>{{item.Type}}</div>
            </div>
          </div>
          <div v-show='identitys[identityIndex] && identitys[identityIndex].NeedProject'>
            <h4 class='tit'>请选择项目分期</h4>
            <div class='row'>
              <div v-for='(item, index) in projects' :key='"project-"+index' class='radio inline'>
                <input :checked='projectIndex === index' class='radio-input' type='radio' name='project' @input='onInput("project", index)'/>
                <div class='text'>{{item.Name}}</div>
              </div>
            </div>
            <!-- <h4 class='tit'>请选择分期</h4>
            <div class='row'>
              <div v-for='(item, index) in states' :key='"state-"+index' class='radio inline'>
                <input :checked='stateIndex === index' class='radio-input' type='radio' name='state' @input='onInput("state", index)'/>
                <div class='text'>{{item.Name}}</div>
              </div>
            </div> -->
          </div>
          <!-- <h4 class='tit'>请选择类型</h4>
          <div class='row'>
            <div v-for='(item, index) in types' :key='"type-"+index' class='radio inline'>
              <input :checked='typeIndex === index' class='radio-input' type='radio' name='type' @input='onInput("type", index)'/>
              <div class='text'>{{item}}</div>
            </div>
          </div> -->
        </div>
        <dl
          v-show='listShow'
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
    <div>
      <Btn v-show='!listShow' size="lar" text="下一步" @click="next"/>
      <div v-show='listShow' class='btns'>
        <Btn :size="readonly?'lar':'mid'" text="上一步" @click="prev"/>
        <Btn v-if='!readonly' size="mid" text="确定" @click="saveAnswer"/>
      </div>
    </div>
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
      identitys: [],
      identityIndex: null,
      projects: [],
      projectIndex: null,
      states: [],
      stateIndex: null,
      types: [],
      typeIndex: 0,
      listShow: false,
      readonly: null,
      questions: {},
      answers: [],
      myAnswer:{}
    }
  },
  computed: {
    title () {
      if (this.questions.Info) {
        return this.questions.Info.Title
      }
    },
    identity () {
      const { identitys, identityIndex } = this
      return identitys[identityIndex]
    },
    project () {
      const { projects, projectIndex } = this
      return projects[projectIndex]
    },
    state () {
      const { states, stateIndex } = this
      return states[stateIndex] ? states[stateIndex].Name : ''
    },
    type () {
      const { types, typeIndex } = this
      return types[typeIndex]
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
    },
    identity (val) {
      if (val) {
        const { Value: Type } = val
        const { id: QuestionID } = this
        this.getProjects({ Type, QuestionID })
      }
    },
    project (val) {
      if (val) {
        const { JoinedId: ID, Joined } = val
        this.readonly = Joined
        if (Joined) {
          this.getAnswer({ ID })
        } else {
          this.questions.List = this.questions.List.map(item => {
            item.MyAnswer = ''
            return item
          })
        }
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    // this.getProjects()
    this.getInvestigate()
  },
  methods: {
    onInput (target, index) {
      this[`${target}Index`] = index
    },
    getProjects ({ Type, QuestionID }) {
      api.investigate.plist({ Type, QuestionID })
        .then(r => {
          const { data: res } = r.res
          if (res.IsSuccess) {
            this.projects = res.Data
            if (this.projects[0].ID === 0 && this.projects[0].JoinedId !== 0) {
              const ID = this.projects[0].JoinedId
              this.getAnswer({ ID })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStates (id) {
      api.investigate.slist(id)
        .then(r => {
          const { data: res } = r.res
          if (res.IsSuccess) {
            const { stateIndex } = this
            this.states = res.Data
            if (stateIndex > this.states.length - 1) {
              this.stateIndex = this.states.length - 1
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAnswer ({ ID }) {
      api.investigate.getAnswer({ ID })
        .then(r => {
          const { data: res } = r.res
          if (res.IsSuccess) {
            this.answers = res.Data
            this.readonly = true
            this.questions.List = this.questions.List.map((item, index) => {
              item.MyAnswer = this.answers[index].MyAnswer
              item.MyAnswer = item.MyAnswer.split('|')
              return item
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    prev () {
      this.listShow = false
    },
    next () {
      const { identityIndex, identitys, projectIndex } = this
      if (identityIndex === null) {
        window.$toast('请选择身份')
        return
      }
      if (identitys[identityIndex].NeedProject) {
        if (projectIndex === null) {
          window.$toast('请选择项目分期')
          return
        }
      }
      this.listShow = true
    },
    getInvestigate () {
      api.investigate.list(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let questions = res.data.Data
          console.log(questions)
          let { CanJoin: canJoin, CannotJoinMsg, BindTypeList: identitys, ResearchTypeList: types } = questions
          if (!canJoin) {
            window.$alert({
              title: CannotJoinMsg,
              yes: () => {
                this.$router.replace({name: 'investigatelist'})
              }
            })
            return
          }
          // this.readonly = questions.Joined
          questions.List.forEach(item => {
            item.Answer = item.Answer.split('|')
            // item.MyAnswer = item.MyAnswer.split('|')
          })
          this.types = types
          this.identitys = identitys
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
      if (this.readonly) {
        let index = window.$alert({
          content: '您已提交过，请勿重复提交',
          yes () {
            window.$close(index)
            _self.$router.replace({
              name: 'investigatelist'
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
      // Answer,JoinInfo
      const { identity, project } = this
      const JoinInfo = {
        BindType: identity.Value,
        Stage: project ? project.ID : 0,
        ResearchType: ''
      }
      const Answer = submitArr
      console.log(Answer, JoinInfo)
      api.investigate.save({ Answer, JoinInfo })
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: res.data.Message,
            yes () {
              window.$close(index)
              _self.$router.replace({
                name: 'investigatelist'
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
.row{
  margin-left: -7.5px;
  margin-right: -7.5px;
}
.tit{
  font-size: 14px;
  margin: 15px 0;
}
.radio{
  position: relative;
  &.inline{
    display: inline-block;
    margin: 7.5px;
  }
  &-input{
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .text{
    width: 100%;
    height: 100%;
    border: 1px solid #666;
    color: #666;
    transition: all .3s;
    padding:10px 15px;
    border-radius: 4px;
  }
  &-input:checked + .text{
    background: $primary-color;
    border-color: $primary-color;
    color: #fff;
  }
}
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
  .btns{
    display: flex;
    .btn{
      margin: p2r(30);
    }
  }
}
</style>
