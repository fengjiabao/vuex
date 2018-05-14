<template>
  <div class="sp-history"> 
    <history-search></history-search>
    <history-player v-if="showPlayer"></history-player>
  </div>
</template>
<script>
import historySearch from './history-search.vue'
import historyPlayer from './history-player.vue'
export default {
  name: 'HistoryIndex',
  data () {
    return {
      showPlayer: false
    }
  },
  components: {
    historySearch,
    historyPlayer
  }
}
</script>
<style lang="sass" scoped>
  .sp-history
    height: calc(100% - 5.5rem)
</style>
