<template>
  <span>
    <svg class="icon"><use :xlink:href="icon"></use></svg>
  </span>
</template>
<script>
export default {
  props: ['iconname'],
  data () {
    return {
      icon: this.iconname
    }
  }
}
</script>
