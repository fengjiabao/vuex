<template>
  <span class="grip-horizontal">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </span>
</template>
<style lang="sass" scoped>
@import '../style/defs.sass'
.grip-horizontal
  @include align-middle-between
  @include wh(.5rem,1rem)
  flex-flow: column nowrap
  margin: 0 .5rem 0 .2rem

  span
      @include wh(6px,1px)
      background: $grip-color
</style>
