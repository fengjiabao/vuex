<template>
  <div class="head">
    <img src="../assets/luanlogo.png" alt="">
    <main-nav></main-nav>
    <!-- <fuzzy-search></fuzzy-search>
    <shortcut-operation></shortcut-operation>
    <user-bar></user-bar> -->
  </div>
</template>
<script>
import mainNav from './main-nav'
export default {
  components: {
    'main-nav': mainNav
  }
}
</script>
