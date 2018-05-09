<template>
  <div class="overview-panel">
    <!--车辆-->
    <div data-type="VEHICLE" class="overview-card" @click="showDetails">
      <span class="vehicle-trapezoidal trapezoidal"></span>
      <svg class="label-icon" style="transform: rotate(-90deg)">
        <use xlink:href="#icon-bus-vehicle"></use>
      </svg>
      <span class='current-count'>{{vehicleCount}}</span>
    </div>

    <!--人员-->
    <div data-type="STAFF" class="overview-card" @click="showDetails">
      <span class="staff-trapezoidal trapezoidal"></span>
      <svg class="label-icon">
        <use xlink:href="#icon-person"></use>
      </svg>
      <span class='current-count'>{{staffCount}}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {OD, ST} from '../../js/def/odef.js'
export default {
  data () {
    return {
      icon: {
        vehicle: '#icon-bus-vehicle',
        person: '#icon-person'
      }
    }
  },
  computed: {
    ...mapState({
      vehicleCount: state => state.cardStore.vstate.sum ? state.cardStore.vstate.sum : 0,
      staffCount: state => state.cardStore.sstate.sum ? state.cardStore.sstate.sum : 0
    })
  },
  methods: {
    showDetails (evt) {
      let target = evt.currentTarget
      let type = target.getAttribute('data-type')
      type = type === 'VEHICLE' ? OD.VEHICLE : OD.STAFF
      let msg = {
        type: 'card',
        subTypeID: type,
        statType: ST.SUM,
        composeType: 'type'
      }
      this.$store.commit('stateStore/changeShowDetailDialog', msg)
    }
  }
}
</script>

<style lang="sass" scoped>
@import ../../style/defs.sass
.overview-panel
  position: absolute
  display: flex
  top: .5rem
  left: -0.5rem
  @include wh(22.5rem, 4rem)
  z-index: 10
  cursor: pointer
  .overview-card
    width: 50%
    background: $font-white
    position: relative
    &:nth-child(2)
      margin-left: 10px
    .label-icon
      @include wh(3rem, 3rem)
      position: absolute
      left: .5rem
      top: .5rem
      fill: $label-icon-color
    .current-count
      position: absolute
      font-size: $fontsize-xxl
      right: 2rem
      top: 1rem
      color: $main-color
</style>
