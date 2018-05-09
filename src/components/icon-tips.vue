<template>
  <div class="dlg-window" v-if="isShow">
    <div class="dlg-content">
      <svg class="icon"><use xlink:href="#icon-exclamati"></use></svg>
      <span class="tips-title">{{tips}}</span>
      <span class="btns">
        <button class="btn-sure" @click="makesure">确认</button>
        <button class="btn-cancel" @click="cancel">取消</button>
      </span>
    </div>
  </div>
</template>
<script>
import tips from '../js/def/icon_tips_def.js'
export default {
  data () {
    return {
      isShow: false,
      tips: null,
      name: null
    }
  },
  methods: {
    cancel () {
      this.isShow = false
    },
    makesure () {
      switch (this.name) {
        case 'metadata':
          console.log('拉取元数据')
          break
      }
    },
    show (msg) {
      this.isShow = true
      this.name = msg.name
      this.tips = tips[msg.name].tip
    }
  },
  created () {
    xbus.$on('showTips', this.show)
  },
  beforeDestroy () {
    xbus.$off('showTips', this.show)
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  .icon
    fill: $alarm-color
    @include wh(3rem, 3rem)
    margin: 1rem
  .tips-title
    height: 2rem
    line-height: 2rem
  .btns
    margin-top: 1rem
    display: flex
    width: 100%
    justify-content: space-around
</style>
