<template>
  <div class="page-footer">
    <div class="footer-manage">
      <span>
        <svg class = "icon">
           <use xlink:href="#icon-leader-staff"></use>
        </svg>
      </span>
    </div>
    <div class="status-area">
      <span>
        <img :src= "collectorStatus ? 'static/image/link.png' : 'static/image/unlink.png' "/>
        <span class="lastPushTime">{{ lastPushTime }}</span>
      </span>
      <span>
         <svg :class = "netWorkStatus ? 'connected icon' : 'disconnected icon'">
           <use xlink:href="#icon-network"></use>
         </svg>
        <span class="lastPushTime">{{ netLastChangeTime }}</span>
      </span>
     </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      collectorStatus: state => state.collectorStore.collectorStatus,
      lastPushTime: state => state.collectorStore.lastPushTime,
      netWorkStatus: state => state.collectorStore.netWorkStatus,
      netLastChangeTime: state => state.collectorStore.netLastChangeTime
    })
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  .page-footer
    font-size: .8rem
    flex: 0 0 3rem
    background: #f5f5f5
    border-top: 1px solid #e3e3e3
    padding: 0 1rem
    @include align-middle-between
    .status-area
      display: flex
      span,img,.lastPushTime,svg
          height: 1rem
          @include align-middle-between
          line-height: 1rem
          margin-right: .5rem
          .connected
            fill: #27CA41
          .disconnected
            fill: red
    .footer-manage
      .icon
        fill: #09f
</style>
