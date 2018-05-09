<template>
  <ul>
    <li v-for="(list, index) in lists" :key="index" @click="showStep(index, $event)">
      <svg class="icon"><use :xlink:href="list.iconname"></use></svg>
      <span>{{list.label}}</span>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'userList',
  data () {
    return {
      lists: [
        {iconname: '#icon-metadata', label: '更新配置', name: 'pullMetadata'},
        {iconname: '#icon-lock', label: '修改密码', name: 'showPwdDialog'},
        {iconname: '#icon-poweroff', label: '退出系统', name: 'logout'}
      ]
    }
  },
  methods: {
    showStep (index, evt) {
      let target = evt.target
      let name = this.lists[index].name
      switch (name) {
        case 'pullMetadata':
          this.pullMetadata()
          break
        case 'showPwdDialog':
          // this.showPwdDialog()
          break
        case 'logout':
          // this.logout()
          break
      }
    },
    pullMetadata () {
      xbus.$emit('showTips', {
        name: 'metadata'
      })
    }
  }
}
</script>
<style lang="sass" scoped>
  @import '../style/defs.sass'
  ul
    position: absolute
    @include flex-cloumn
    top: 2rem
    right: 0
    width: 6rem
    background: $gray-l
    z-index: 99
    li
      @include wh(100%, 2.5rem)
      @include flex-align-item
      color: $font-333
      font-size: $fontsize-m
      cursor: pointer
      &:hover
        background: $main-color
        .icon
          fill: $white
      .icon
        fill: $main-color
      span
        padding: 0 .5rem
</style>
