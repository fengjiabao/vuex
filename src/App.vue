<template>
  <div id="app">
    <router-view/>
    <iconSvg></iconSvg>
    <iconTips></iconTips>
  </div>
</template>

<script>
import iconSvg from './components/icon-svg'
import iconTips from './components/icon-tips'
export default {
  name: 'App',
  components: {
    iconSvg,
    iconTips
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
  fill: white;
  cursor: pointer;
}
.dlg-window {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dlg-content {
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 2rem;
  align-items: center;
  width: 17rem;
}
button {
  width: 4rem;
  height: 2rem;
  border-radius: 3px;
  border: 0;
  background: #09f;
  color: white
}
button:hover {
  box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.3);
}
.btn-sure:hover {
  background: #27ca41;  
}
.btn-cancel {
  background: #ff6057;
}
.ol-overlaycontainer-stopevent {
  display: none !important
}
#app {
  width: 100%;
  height: 100%;
}
</style>
