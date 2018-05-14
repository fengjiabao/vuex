<template>
  <div class="dlg-window" v-if="isShow">
    <div class="dlg-content">
      <svg class="icon"><use xlink:href="#icon-exclamati"></use></svg>
      <span class="tips-title">{{content}}</span>
      <span class="tips-content">{{tips}}</span>
      <span class="btns">
        <button class="btn-sure" @click="makesure">确认</button>
        <button class="btn-cancel" @click="cancel">取消</button>
      </span>
    </div>
  </div>
</template>
<script>
import {tipsMessage} from '../js/def/icon_tips_def.js'
import {cancelCallCard, callCards} from '../js/utils/utils.js'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      name: null,
      tips: null,
      content: null,
      tipsMsg: tipsMessage
    }
  },
  methods: {
    cancel () {
      this.$store.commit('stateStore/changeShowIconTips', null)
    },
    makesure () {
      this.$store.commit('stateStore/changeShowIconTips', null)
      switch (this.name) {
        case 'metadata':
          console.log('拉取元数据')
          break
        case 'callList': // 一键取消呼叫
          this.callList()
          console.log('一键取消呼叫')
          break
        case 'leave': // 一键撤离，紧急呼叫2
          this.leave()
          break
      }
    },
    show () {
      let name = this.$store.state.stateStore.iconTipsMsg.name
      this.name = name
      this.content = name && this.tipsMsg[name].content
      this.tips = name && this.tipsMsg[name].tips
    },
    callList () {
      let readers = [{
        stationid: 0
      }]
      let cards = [{
        cardid: '0',
        cardtype: 1
      }] 
      let userName = this.$store.state.user.username
      let message = cancelCallCard(readers, cards, userName)
      this.$store.dispatch('socketStore/registerGlobalEventHandlers', {
        cmd: 'CALL-REMOTE',
        data: message
      })
    },
    leave () {
      let userName = this.$store.state.user.username
      let message = callCards(2, null, userName)
      this.$store.dispatch('socketStore/registerGlobalEventHandlers', {
        cmd: 'CALL-CARD-START',
        data: message
      })
    }
  },
  watch: {
    '$store.state.stateStore.showIconTips': {
      handler: function (result) {
        this.show()
        this.isShow = result
      }
    }
  }
  // created () { // 如果用事件触发，要在创建之后监听
  //   xbus.$on('showTips', this.show)
  // },
  // beforeDestroy () { // 一定要在销毁组件时，off该事件
  //   xbus.$off('showTips', this.show)
  // }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  .icon
    fill: $alarm-color
    @include wh(3rem, 3rem)
    margin: 1rem
  .tips-title, .tips-content
    height: 2rem
    line-height: 2rem
  .tips-content
    font-size: $fontsize-m
  .btns
    margin-top: 1rem
    display: flex
    width: 100%
    justify-content: space-around
</style>
