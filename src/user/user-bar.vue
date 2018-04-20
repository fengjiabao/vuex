<template>
<div class="user-bar">
  <span class="usertitle" @click="showList">
    <svg class="icon user-icon">
      <use id="MenuButton" xlink:href="#icon-user-person"></use>
    </svg>
    <span>{{ username }}</span>
  </span>
  <user-list v-show="isShowList"></user-list>
</div>
</template>
<script>
import {mapState} from 'vuex'
import userList from './user-list'
export default {
  name: 'userBar',
  data () {
    return {
      isShowList: false
    }
  },
  computed: {
    ...mapState({
      username: state => state.user.username
    })
  },
  methods: {
    showList () {
      this.isShowList = !this.isShowList
    }
  },
  components: {
    'user-list': userList
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  .user-bar
    flex: 0 0 4rem
    padding: 0 1rem
    position: relative
    @include flex-space-between
    .usertitle
      width: 100%
      cursor: pointer
</style>
