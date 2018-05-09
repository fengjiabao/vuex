<template>
  <div class="topic-nav">
    <!-- router-link绑定事件，需要用.native -->
    <router-link :class="item.class" v-for="item in listSwitcher" :key="item.index" :id="item.name" :aria-label="item.switchItem" @click.native="switchPanel" :ref="item.name" :to="item.path">
      <svg class="icon"><use :xlink:href="'#' + item.iconName"></use></svg>
    </router-link>
  </div>
</template>
<script>
import {TOPIC, TopicDef} from '../../js/def/topic_def.js'
export default {
  data () {
    return {
      listSwitcher: Object.values(TopicDef),
      currentList: TopicDef[TOPIC.VEHICLE_BY_AREA]
    }
  },
  methods: {
    switchPanel (evt) {
      let target = evt.currentTarget && evt.currentTarget.getAttribute('id')
      this.$store.commit('stateStore/changeMapSidePanel', target)
    },
    setActiveItem (currentList) {
      this.$el.querySelector(`#${currentList.name}`).classList.toggle('active')
    }
  },
  watch: {
    '$store.state.stateStore.mapSidePanel': {
      handler: function (result) {
        let name = result.name
        this.setActiveItem(this.currentList)
        this.currentList = TopicDef[name]
        this.setActiveItem(this.currentList)
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
  a
    height: 3rem
    width: 100%
    @include flex-center-center
    &.active
      border-left: 3px solid $main-color
      .icon
        fill: $main-color
    .icon
      fill: $gray-xxl
      @include wh(1.4rem, 1.4rem)
</style>
