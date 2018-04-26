<template>
  <ul>
    <li v-for="item in list" :key="item.index" :id="item.id" :ref="item.name"> 
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
      list: this.nav
    }
  },
  methods: {

  }
}
</script>
<style lang="sass">
  ul
    display: flex
    margin-left: 5rem
    flex: 1
    li
      width: 3rem
      cursor: pointer
</style>

