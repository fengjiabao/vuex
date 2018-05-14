<template>
  <div>
    <span>
      <svgicon :icon="iconName"></svgicon>
    </span>
    <span> {{message}} </span>
  </div>
</template>
<script>
import svgicon from './svgicon.vue'
export default {
  props: ['icon', 'blankMsg'],
  data () {
    return {
      iconName: this.icon || '#icon-direction-1',
      message: this.blankMsg || '没有相关数据，请确认后再试。'
    }
  },
  components: {
    svgicon
  }
}
</script>
<style lang="sass" scoped>
@import '../style/defs.sass'
div
  @include flex-center-center
  height: 100%
  color: $color-999
  .icon
    fill: $color-999
    padding: 1rem
    @include wh(4rem, 4rem)
  span
    padding: 1rem
    font-size: $fontsize-m
</style>
