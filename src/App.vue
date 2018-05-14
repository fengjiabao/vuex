<template>
  <div id="app">
    <router-view/>
    <icon-svg></icon-svg>
    <icon-tips></icon-tips>
    <detail-dialog></detail-dialog>
    <call-cards></call-cards>
    <modify-pwd></modify-pwd>
    <card-tips></card-tips>
  </div>
</template>

<script>
import iconSvg from './components/icon-svg'
import iconTips from './components/icon-tips'
import detailDialog from './components/detail-dialog'
import callCards from './header/call-cards'
import modifyPwd from './user/modify-pwd'
import cardTips from '@/middle/monitor/card-tips'
export default {
  name: 'App',
  components: {
    iconSvg,
    iconTips,
    detailDialog,
    callCards,
    modifyPwd,
    cardTips
  }
}
</script>

<style lang="sass">
@import './style/hint.min.css'
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
  @include flex-center-center

.dlg-bg
  @include flex-cloumn
  background: $white
  min-width: 18rem

.dlg-head
  background: $main-color
  padding: 0 1rem 0 .5rem
  flex: 0 0 2.6rem
  color: $font-eee
  // width: auto
  @include flex-column-center

.dlg-content 
  display: flex
  flex-direction: column
  background: #f5f5f5
  padding: 2rem
  align-items: center
  width: 25rem

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

// .ol-overlaycontainer-stopevent 
//   display: none !important

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
.whfill
  @include wh(100%,100%)

.ol-compass
  position: absolute
  @include wh(1.5rem, 1.5rem)
  bottom: 14rem
  border: 1px solid $gray-s
  border-radius: 100px
  padding: .2rem

.circle-b
  @include flex-center-center
  @include wh(20px,20px)
  position: relative
  .circle
      @include wh(40px,40px)
      background: rgba(0,0,0,0.2)
      position: absolute
      border-radius: 100%
      transform: scale(0)
      transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms
  &:hover
      .circle
          transform: scale(1)
      .opicon
          transform: scale(1.2)
          transition: all 1s ease

#css_animation, #css_animation_alarm
  @include wh(50px,50px)
  border-radius: 25px
  transform: scale(0)
  animation: myfirst 3s
  animation-iteration-count: infinite

#css_animation
    background: rgba(255, 255, 255, 0.9)
#css_animation_alarm
    background: rgba(255, 0, 0, 0.9)
@keyframes myfirst
    to
        transform: scale(2)
        background: rgba(0, 0, 0, 0)
</style>
