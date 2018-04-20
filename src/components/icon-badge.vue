<template>
  <div class="badge-container">
    <svg class="icon"><use :xlink:href="icons.iconName"></use></svg>
    <span class="badge-mark-container" v-if="icons.mark">
      <span class="badge-mark">{{mark}}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'iconBadge',
  props: ['iconobj'],
  data () {
    return {
      icons: this.iconobj
    }
  }
 }
</script>
