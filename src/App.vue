<template>
  <div id="app">
    <router-view/>
    <icon-svg></icon-svg>
    <icon-tips></icon-tips>
    <detail-dialog></detail-dialog>
  </div>
</template>

<script>
import iconSvg from './components/icon-svg'
import iconTips from './components/icon-tips'
import detailDialog from './components/detail-dialog'
export default {
  name: 'App',
  components: {
    iconSvg,
    iconTips,
    detailDialog
  }
}
</script>

<style lang="sass">
@import './style/defs.sass'
html, body 
  @include wh(100%, 100%)
  font-size: 16px
  font-family: 'Avenir', Helvetica, Arial, sans-serif

* 
  margin: 0
  padding: 0

li 
  list-style: none

.icon 
  @include wh(1rem, 1rem)
  fill: $font-white
  cursor: pointer

.dlg-window 
  position: absolute
  @include wh(100%, 100%)
  top: 0
  left: 0
  z-index: 999
  background: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center

.dlg-content 
  display: flex
  flex-direction: column
  background: #f5f5f5
  padding: 2rem
  align-items: center
  width: 17rem

button 
  @include wh(4rem, 2rem)
  border-radius: 3px
  border: 0
  background: #09f
  color: white

button:hover 
  box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.3)

.btn-sure:hover 
  background: #27ca41

.btn-cancel 
  background: #ff6057

.ol-overlaycontainer-stopevent 
  display: none !important

#app 
  @include wh(100%, 100%)

.trapezoidal 
  @include wh(60px, 0)
  display: inline-block
  border-top: 64px $main-color solid
  border-bottom: none
  border-left: none
  border-right: transparent 30px solid
  border-top-left-radius: 5px
  position: absolute
  left: 0

</style>
