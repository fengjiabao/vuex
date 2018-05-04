<template>
  <div class="map-sidebar map-sidebar-full">
    <div class="nav-bar">
      <span class="panel-switcher" @click="switchPanel">
        <svg class="icon">
          <use :xlink:href="isShowPanel ? '#icon-caret-left' : '#icon-caret-right'"></use>
        </svg>
      </span>
      <topic-nav></topic-nav>
    </div>
    <div class="topic-main" ref="topic-main" name="topic-main">
      <div class="topic-title" ref="topictitle">{{ activeTopic ? activeTopic.label : '' }}</div>
      <router-view/>
    </div>
  </div>
</template>
<script>
import topicNav from './topic-nav'
import topicPanel from './topic-panel'
import { TOPIC, TopicDef } from '../../js/def/topic_def.js'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      isShowPanel: true
    }
  },
  methods: {
    switchPanel () {
      this.isShowPanel = !this.isShowPanel
      let cl = this.$el.classList
      if (this.isShowPanel) {
        cl.remove('map-sidebar-narrow')
        cl.add('map-sidebar-full')
      } else {
        cl.remove('map-sidebar-full')
        cl.add('map-sidebar-narrow')
      }
    }
  },
  components: {
    topicNav,
    topicPanel
  },
  computed: {
    ...mapState({
      activeTopic: state => state.stateStore.mapSidePanel
    })
  }
}
</script>
<style lang="sass">
  @import '../../style/defs.sass'
  .map-sidebar
    margin-top: 5rem
    display: flex
    flex-flow: row nowrap
    overflow: hidden
    font-size: $fontsize-m
    .nav-bar
      background: $gray-l
      @include flex-center-center
      flex: 0 0 3rem
      .panel-switcher
        @include flex-center-center
        flex: 0 0 2.4rem
        width: 100%
      .icon
        fill: $font-333
    .topic-main
      flex: auto
      @include flex-cloumn
      .topic-title
        @include flex-center-center
        flex: 0 0 2.4rem
        background: $gray-l
        font-weight: 1000
      .topic-panel
        flex: auto
        background: $white
  .map-sidebar-full
    flex: 0 0 22rem
  .map-sidebar-narrow
    flex: 0 0 3rem
</style>
