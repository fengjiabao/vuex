<template>
  <div class="main">
    <head-view></head-view>
    <!-- <middle></middle>
    <foot></foot> -->
  </div>
</template>
<script>
import head from '../header/head.vue'
export default {
  components: {
    'head-view': head
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

