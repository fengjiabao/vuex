<template>
  <div id="app">
    <router-view/>
    <iconSvg></iconSvg>
  </div>
</template>

<script>
import iconSvg from './components/icon-svg'
export default {
  name: 'App',
  components: {
    iconSvg
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none
}
.icon {
  width: 1rem;
  height: 1rem;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
