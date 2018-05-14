<template>
  <svg class="icon icon-close"><use :xlink:href="iconname"></use></svg>
</template>
<script>
export default {
  props: ['icon'],
  data () {
    return {
      iconname: this.icon
    }
  }
}
</script>
