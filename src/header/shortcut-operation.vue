<template>
  <div class="short">
    <span v-for="item in badgeItems" :key="item.index" class="shortcut-item hint--bottom-left" :aria-label="item.label">
      <icon-badge :iconobj="item" :id="item.name" :iconname="item.iconName" ></icon-badge>
    </span>
    <span v-for="item in shortcut" :id="item.name" :key="item.index" class="shortcut-item hint--bottom-left" :aria-label="item.label" @click="switchItem">
      <svg class="icon"><use :xlink:href="item.iconName"></use></svg>
    </span>
    <span id="fullScreen" class="shortcut-item hint--bottom-left" aria-label="全屏" @click="switchItem">
      <svg class="icon"><use :xlink:href="isFullScreen ? '#icon-shrink' : '#icon-enlarge'"></use></svg>
    </span>
  </div>
</template>
<script>
import shortcutItems from './js/shortcut_def.js'
import iconBadge from '../components/icon-badge.vue'
import {requestFullScreen, exitFullScreen} from '../js/utils/utils.js'
export default {
  name: 'shortOper',
  data () {
    return {
      badgeItems: shortcutItems.slice(0, 2),
      shortcut: shortcutItems.slice(2),
      isFullScreen: false
    }
  },
  components: {
    'icon-badge': iconBadge
  },
  methods: {
    switchItem (evt) {
      let target = evt.currentTarget
      let tagName = target.getAttribute('id')
      switch (tagName) {
        case 'callList':
        case 'leave':
        case 'rule':
          this.$store.commit('stateStore/changeShowIconTips', tagName)
          break
        case 'sendcall':
          this.$store.commit('stateStore/changeShowCallCards')
          break
        case 'fullScreen': 
          this.fullScreen()
          break
      }
    },
    fullScreen () {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen || window.document.body.clientHeight !== window.screen.height) {
        requestFullScreen(document.documentElement)
      } else {
        exitFullScreen()
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  .short
    display: flex
    border-right: 1px solid $border-color
    .shortcut-item
      margin: 0 .3rem
</style>

