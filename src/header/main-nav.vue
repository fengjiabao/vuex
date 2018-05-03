<template>
  <ul>
    <li v-for="(item,index) in list" :key="index" :id="item.id" :ref="item.name" :class = "{ active: active === index }" @click="changeTitle(index)"> 
      <router-link :to="item.routerPath">
        {{item.label}}
      </router-link>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'mainNav',
  props: ['nav'],
  data () {
    return {
      list: this.nav,
      active: 0
    }
  },
  methods: {
    changeTitle: function(index){
      this.active = index
    }
  }
}
</script>
<style lang="sass">
  ul
    display: flex
    margin-left: 5rem
    flex: 1
    height: 100%
    li
      width: 3rem
      cursor: pointer
      text-align: center
      line-height: 2.6rem
      height: 100%
      &.active
        border-top: 2px solid #fff
      a
        text-decoration: none
        color: white
        display: inline-block
        width: 100%
        height: 100%
</style>

