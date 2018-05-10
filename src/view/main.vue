<template>
  <div class="main">
    <head-view></head-view>
    <!-- <middle-view></middle-view> -->
    <router-view/>
    <foot-view></foot-view>
  </div>
</template>
<script>
import headView from '@/header/head'
import footView from '@/foot/foot'
export default {
  components: {
    headView,
    footView
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

