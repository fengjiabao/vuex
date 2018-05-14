<template>
  <div class="dialog-head">
    <span class="dlg-title">
      <grip></grip>
      <span>{{headMsg.title}}</span>
    </span>
    <span @click="close" v-if="headMsg.closer">
      <svgicon :icon="iconname"></svgicon>
    </span>
  </div>
</template>
<script>
import grip from './grip.vue'
import svgicon from './svgicon.vue'
export default {
  props: ['headContent'],
  data () {
    return {
      needCloser: false,
      headMsg: this.headContent,
      iconname: '#icon-close'
    }
  },
  methods: {
    close () {
      this.$parent.close()
    }
  },
  components: {
    grip,
    svgicon
  }
}
</script>
<style lang="sass" scoped>
@import '../style/defs.sass'
.dialog-head
  @include align-middle-between
  padding: .5rem 1rem
  background: $main-color
  color: $white
  width: auto
  .dlg-title
    display: flex
</style>
