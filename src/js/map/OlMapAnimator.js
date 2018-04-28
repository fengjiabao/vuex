import TWEEN from '@tweenjs/tween.js'
import {getStartPosition, stopAnimationLoop, moveto} from './mapUtils/animatorDep.js'
export default {
  namespaced: true,
  state: {},
  actions: {
    animate ({state, dispatch}, data) {
      let obj = data.msg
      let pObj = data.positionLay
      let x = data.x
      let y = -data.y
      let duration = data.duration
      if (!obj) {
        console.log('Animate object is NULL')
        return
      }
      let startPosition = getStartPosition(obj, pObj)
      if (!startPosition) return
      if (x === startPosition[0] && y === startPosition[1]) {
        // Not change the position, NO need animation
        return
      }
      let targetPosition = [x, y]
      let tween = new TWEEN.Tween(startPosition).to(targetPosition, duration)
      tween.onUpdate(function () {
        moveto(obj, pObj, startPosition)
      })
      tween.onComplete(function () {
        // 如果是调用 tween.stop() 中断动画, 则不会触发 tween.onCompplete()
        stopAnimationLoop(obj)
      })
      tween.start()

      // Start the animation loop.
      let animationFrameID = requestAnimationFrame(doAnimate)
      if (obj && obj.getProperties()) {
        obj.getProperties().rafId = animationFrameID
      }
      // obj.set('rafId', animationFrameID)
      obj.set('xpos', targetPosition)
      obj.set('xtween', tween) // save tween object for stopping it later.

      function doAnimate () {
      // 注意：每次rAF调用，都会生成一个新的 rAF ID，所以这里每次都需要更新这个ID
        animationFrameID = requestAnimationFrame(doAnimate)
        // TODO: 如何缩减掉这一步操作？？？
        // 方案：
        // 1. 如果需要中断当前动画，则设置一个标识，在目标对象的下一次动画帧启动之前，判断是否需要中断动画，如果需要，则把对象移动到目标位置，且不再启动新的动画帧，
        // 2. 让本次动画完成，然后再 tween.onComplete 中启动下一次动画（如果有的话）；
        // obj && obj.set('rafId', animationFrameID)
        if (obj && obj.getProperties()) {
          obj.getProperties().rafId = animationFrameID
        }

        TWEEN.update()
      }
    }
  }
}
