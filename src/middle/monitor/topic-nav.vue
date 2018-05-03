<template>
  <div class="topic-nav">
    <span class="hint--right" v-for="item in listSwitcher" :key="item.index" :id="item.name" :aria-label="item.switchItem" @click="switchPanel">
      <svg class="icon"><use :xlink:href="'#' + item.iconName"></use></svg>
    </span>
  </div>
</template>
<script>
import {TOPIC, TopicDef} from '../../js/def/topic_def.js'
export default {
  data () {
    return {
      listSwitcher: Object.values(TopicDef)
    }
  },
  methods: {
    switchPanel (evt) {
      let target = evt.currentTarget && evt.currentTarget.getAttribute('id')
      this.$store.commit('stateStore/changeMapSidePanel', target)
    }
  },
  watch: {
    '$store.state.stateStore.mapSidePanel': {
      handler: function (result) {
        console.log(result)
        let name = result.name
        
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../style/defs.sass'
.topic-nav
  @include flex-column-align-center
  flex: auto
  width: 100%
  span
    height: 3rem
    width: 100%
    @include flex-center-center
    .icon
      fill: $gray-xxl
      @include wh(1.4rem, 1.4rem)
</style>
