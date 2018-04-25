import TWEEN from '@tweenjs/tween.js'
export default {
  namespaced: true,
  state: {},
  actions: {
    async animate ({state, dispatch}, data) {
      let obj = data.msg
      let x = data.x
      let y = -data.y
      let duration = data.duration
      if (!obj) {
        console.log('Animate object is NULL')
        return
      }
      let startPosition = await dispatch('getStartPosition', obj)
      if (!startPosition) return
      if (x === startPosition[0] && y === startPosition[1]) {
        // Not change the position, NO need animation
        return
      }
      let targetPosition = [x, y]
      let tween = new TWEEN.Tween(startPosition).to(targetPosition, duration)
      tween.onUpdate(function () {
        dispatch('moveto', {
          obj: obj,
          startPosition: startPosition
        })
      })
      tween.onComplete(function () {
        // 如果是调用 tween.stop() 中断动画, 则不会触发 tween.onCompplete()
        dispatch('stopAnimationLoop', obj)
      })
      tween.start()

      // Start the animation loop.
      let animationFrameID = requestAnimationFrame(doAnimate)
      obj.set('rafId', animationFrameID)
      obj.set('xpos', targetPosition)
      obj.set('xtween', tween) // save tween object for stopping it later.

      function doAnimate () {
      // 注意：每次rAF调用，都会生成一个新的 rAF ID，所以这里每次都需要更新这个ID
        animationFrameID = requestAnimationFrame(doAnimate)
        // TODO: 如何缩减掉这一步操作？？？
        // 方案：
        // 1. 如果需要中断当前动画，则设置一个标识，在目标对象的下一次动画帧启动之前，判断是否需要中断动画，如果需要，则把对象移动到目标位置，且不再启动新的动画帧，
        // 2. 让本次动画完成，然后再 tween.onComplete 中启动下一次动画（如果有的话）；
        obj && obj.set('rafId', animationFrameID)

        TWEEN.update()
      }
    },
    async getStartPosition ({state, dispatch}, obj) {
      let startPosition = await dispatch('stopPreviewAnimation', obj)
      if (!startPosition) {
        let geometry = obj.getGeometry()
        startPosition = geometry && geometry.getCoordinates()
      }

      return startPosition
    },
    async stopPreviewAnimation ({dispatch}, obj) {
      let ret = null
      let isStopped = await dispatch('stopAnimationLoop', obj)
      if (isStopped) {
      // 注意：中断动画时，需要同时停掉 tween，否则会触发 tween.onComplete()
        dispatch('stopTween', obj)

        // 如果是主动中断的动画，需要把坐标移动到目标位置
        ret = obj.get('xpos')
        dispatch('moveto', {
          obj: obj,
          ret: ret
        })
      }

      return ret
    },
    stopAnimationLoop ({dispatch}, obj) {
      let ret = false
      let preRaf = obj && obj.get('rafId')
      if (preRaf && parseInt(preRaf, 10) > 0) {
      // 取消队列中的 animation frame，就不会执行 doAnimate()，相当于中断了 animation loop。
        cancelAnimationFrame(preRaf)
        obj.set('rafId', null)

        ret = true
      }

      return ret
    },
    stopTween ({state}, obj) {
      let tween = obj.get('xtween')
      if (tween) {
        tween.stop()
        obj.set('xtween', null)
      }
    },
    moveto ({state, dispatch}, data) {
      let obj = data.obj
      let pos = data.startPosition
      let geometry = obj && obj.getGeometry()
      geometry && geometry.setCoordinates(pos)
    }
  }
}
