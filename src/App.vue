<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
#app {
  width: 100%;
  height: 100%;
}
</style>
