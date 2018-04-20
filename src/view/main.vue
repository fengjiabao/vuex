<template>
  <div class="main">
    <head-view></head-view>
    <middle-view></middle-view>
    <foot-view></foot-view>
  </div>
</template>
<script>
import head from '../header/head'
import middle from '../middle/monitor/sp_monitor'
import foot from '../foot/foot'
export default {
  components: {
    'head-view': head,
    'middle-view': middle,
    'foot-view': foot
  }
}
</script>
<style lang="sass">
  @import '../style/defs.sass'
  .main
    display: flex
    @include wh(100%, 100%)
    flex-direction: column
</style>

