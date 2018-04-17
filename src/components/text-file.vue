<template>
  <div :id="items.id">
    <svg class="icon">
      <use :xlink:href="items.icon"></use>
    </svg>
    <input :type="items.type" :placeholder="items.holder" v-on:blur="judgeInput">
  </div>
</template>

<script>
export default {
  name: 'text-file',
  props: ['textObj'],
  data () {
    return {
      items: this.textObj
      // icon: `../assets/icons/icons.svg#${items.icon}`
    }
  },
  mounted () {
  },
  methods: {
    judgeInput () {
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  div
    @include flex-align-item
    height: 3rem
    .icon
      fill: $white
      margin-right: 1rem
    input
      height: 1.5rem
</style>

