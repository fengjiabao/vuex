<template>
  <div class="card-opbar">
    <b class="circle-b" v-if="!specialornot">
      <i class="circle"></i>
      <img :id="card" :class="isLocating ? 'activated icon opicon' : 'icon opicon'" :src="isLocating ? 'static/image/locating.png' : 'static/image/location.png'" title="定位" @click="toggleLocate"/>
    </b>
    <b class="circle-b" v-if="!specialornot">
      <i class="circle"></i>
      <img :id="card" :class="isTracking ? 'activated icon opicon ' : 'icon opicon '" :src="isTracking ? 'static/image/earthing.png' : 'static/image/earth.png'" title="跟踪" @click="toggleTrack"/>
    </b>
    <b v-if="cardtype === 1" class="circle-b">
      <i class="circle"></i>
      <img :id="card" class="icon opicon" src="static/image/call.png" title="呼叫"/>
    </b>
    <b class="circle-b">
      <i class="circle"></i>
      <img :id="card" class="icon opicon" src="static/image/track.png" title="历史轨迹"/>
    </b>
    <b class="circle-b">
      <i class="circle"></i>
      <img :id="card" class="icon opicon hide-on-mb" src="static/image/checkwork.png" title="考勤">
    </b>
  </div>
</template>
<script>
import {getLastState} from '@/js/utils/cardStoreDep.js'
import {CARD} from '@/js/def/state.js'
const areaTypeID = 1000 // 非覆盖区域
export default {
  props: ['cardid', 'cardtypeid', 'isspecial', 'needhide'],
  data () {
    return {
      card: this.cardid,
      cardtype: this.cardtypeid,
      specialornot: this.isspecial,
      isLocating: window.xdata.state.locateStore.locates.get(this.cardid),
      isTracking: window.xdata.state.trackStore.tracks.get(this.cardid)
    }
  },
  methods: {
    toggleLocate (evt) {
      let target = evt.currentTarget
      let id = target.getAttribute('id')
      let card = getLastState(id)
      let mapID = card[CARD.map_id]
      let areaID = card[CARD.area_id]
      let areaTypeID = window.xdata.state.metaStore.data.area && window.xdata.state.metaStore.data.area.get(areaID) && window.xdata.state.metaStore.data.area.get(areaID).area_type_id
      window.triggerLocating({ cards: [id] })
      this.isLocating = !this.isLocating
    },
    toggleTrack (evt) {
      let target = evt.currentTarget
      let id = target.getAttribute('id')
      let card = getLastState(id)
      window.trackToggle({ cards: [id] })
      this.isTracking = !this.isTracking
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../style/defs.sass'
.card-opbar
  display: flex
  justify-content: space-around
</style>
