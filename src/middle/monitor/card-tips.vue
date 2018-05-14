<template>
  <div class="card-tips" v-if="isShow">
    <div name="draggeTitle" class="tips-title" ref="tipstitle">
      <span class="tips-title-text">{{ title }}</span>
      <span class="dlg-closer" @click="close">
        <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
      </span>
    </div>
    <div class="content-body">
      <div class="title-block">
        <span>基本信息</span>
      </div>
      <div class="content-block" id="infoTips" v-if="info && cardtype==='vehicle'">
        <div>
          <p><span class="tlabel">卡号：</span><span>{{info.card_id}}</span></p>
          <p><span class="tlabel">车牌：</span><span>{{info.name}}</span></p>
          <p><span class="tlabel">类型：</span><span>{{info.vehicle_type_id}}</span></p>
          <p><span class="tlabel">部门：</span><span>{{info.dept_id}}</span></p>
        </div>
        <div class="pic-container">
          <img :src="info.pic" class="card-pic">
        </div>
        <div>
          <p><span class="tlabel">班组：</span><span>{{info.group_id}}</span></p>
        </div>
      </div>
      <div class="content-block" id="infoTips" v-if="info && cardtype==='staff'">
        <div>
          <p><span class="tlabel">卡号：</span><span>{{info.card_id}}</span></p>
          <p><span class="tlabel">工号：</span><span>{{info.staff_id}}</span></p>
          <p><span class="tlabel">姓名：</span><span>{{info.name}}</span></p>
          <p><span class="tlabel">性别：</span><span>{{info.sex_id}}</span></p>
        </div>
        <div class="pic-container">
          <img :src="info.pic" class="card-pic">
        </div>
        <div>
          <p><span class="tlabel">部门：</span><span>{{info.dept_id}}</span></p>
          <p><span class="tlabel">工种：</span><span>{{info.worktype_id}}</span></p>
        </div>
        <div>
          <p><span class="tlabel">班组：</span><span>{{info.group_id}}</span></p>
          <p><span class="tlabel">职务：</span><span>{{info.occupation_id}}</span></p>
        </div>
      </div>

      <div class="title-block">
        <span>当前状态</span>
      </div>
      <div class="content-block" id="infoTips" v-if="state && cardtype==='vehicle'">
        <div>
          <p><span class="tlabel">出车：</span><span>{{state[5]}}</span></p>
          <p><span class="tlabel">司机：</span><span>{{ state[17] }}</span>
            <span>(
              <img src="../../assets/tel.png" alt="">
              <span>{{ state[18] }}</span>)
            </span>
          </p>
          <p><span class="tlabel">电量：</span><span>{{ state[12] }}</span></p>
          <p><span class="tlabel">时间：</span><span>{{state[7]}}</span></p>
          <p v-if="curTitleType ==='MONITOR'"><span class="tlabel">东经：</span><span>{{state[4]}}</span></p>
        </div>
        <div>
          <p><span class="tlabel">时长：</span><span>{{state[8]}}</span></p>
          <p><span class="tlabel">速度：</span><span>{{state[15]}} (km/h)</span></p>
          <p><span class="tlabel">状态：</span><span>{{state[13]}}</span></p>
          <p><span class="tlabel">位置：</span><img class="ticon" src="../../assets/location.png">{{state[16]}}</p>
          <p v-if="curTitleType ==='MONITOR'"><span class="tlabel">北纬：</span><span>{{state[3]}}</span></p>
        </div>
        <!-- <div class="current-pos">
          <p><span class="tlabel">位置：</span><img class="ticon" src="../img/location.png">{state[16]}</p>
        </div> -->
      </div>
      <div class="content-block" id="infoTips" v-if="state && cardtype==='staff'">
        <div>
          <p  v-if="curTitleType ==='MONITOR'"><span class="tlabel">下井：</span><span>{{state[5]}}</span></p>
          <p><span class="tlabel">电量：</span><span>{{state[12]}}</span></p>
          <p><span class="tlabel">时间：</span><span>{{state[7]}}</span></p>
          <p v-if="curTitleType ==='MONITOR'"><span class="tlabel">东经：</span><span>{{state[4]}}</span></p>
        </div>
        <div>
          <p><span class="tlabel">时长：</span><span>{{state[8]}}</span></p>
          <p><span class="tlabel">状态：</span><span>{{state[13]}}</span></p>
          <p><span class="tlabel">位置：</span><img class="ticon" src="../../assets/location.png">{{state[16]}}</p>
          <p v-if="curTitleType ==='MONITOR'"><span class="tlabel">北纬：</span><span>{{state[3]}}</span></p>
        </div>
        <!-- <div class="current-pos">
          <p><span class="tlabel">位置：</span><img class="ticon" src="../img/location.png">{state[16]}</p>
        </div> -->
      </div>
      <div class="title-block" v-if="personOnCar">
          <span>车上人员</span>
      </div>
      <div class="person-onCar" v-if="personOnCar"> 
        <span v-for="item in personList" :key="item.index">{{ xdata.metaStore.getCardNameByID(item) }}</span>
      </div>

      <div class="tipsop-panel" v-if="info && curTitleType ==='MONITOR'">
        <card-opbar :cardid="id" :cardtypeid="cardTypeID" :isspecial="isspecial" :needhide="1"></card-opbar>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {formatRecord, formatStateArray, getVehicleDriver} from '../../js/utils/metaStoreDep.js'
import {CARD} from '../../js/def/state.js'
import cardOpbar from './card-opbar'
export default {
  data () {
    return {
      title: null,
      info: null,
      state: [],
      id: null,
      cardtype: null,
      curTitleType: null,
      stateDef: null,
      personOnCar: false,
      msg: null,
      isspecial: false
    }
  },
  computed: {
    ...mapState({
      isShow: state => state.mapService.showCardTips
    })
  },
  watch: {
    '$store.state.mapService.showCardTipsID': {
      handler: function (id) {
        this.showTips()
      }
    }
  },
  methods: {
    showTips () {
      let msg = this.$store.state.mapService.cardTips
      this.msg = msg
      let curTitleType = msg.curTitleType
      this.id = msg.id
      this.cardtype = msg.cardtype // CARD: staff, vehicle, ...

      this.title = this.cardtype === 'vehicle' ? '车辆信息' : '人员信息' 

      // set the info data
      this.infoDef = msg.info.def
      let infoData = msg.info.rec
      this.info = formatRecord(this.infoDef, infoData, null)
      // 设置照片路径
      if (this.info) {
        let pic = this.info && this.info.pic
        this.info.pic = pic ? '/resource/' + this.cardtype + '/' + this.info.pic : '/img/pic' + this.cardtype + '.png'
      }
      let stateData = null
      if (curTitleType === 'HISTORY') { // 历史轨迹点击图标弹出label
        this.curTitleType = 'HISTORY'
        stateData = this.hisPosData
      } else {
        this.curTitleType = 'MONITOR'
        stateData = msg.state.rec
      }
      // 卡类型 ID
      this.cardTypeID = stateData && stateData[1]
      // set the state data
      this.stateDef = msg.state.def
      
      this.state = formatStateArray(this.stateDef, stateData, null) // convert the display
      if(this.state[3] && this.state[4]){
        let geoCoordinate = this.horizontalToGeographic(this.state[3],this.state[4])
        this.state[3] = geoCoordinate[0]
        this.state[4] = geoCoordinate[1]
      }
      // add driver name
      let vehicleNumber = stateData[CARD.object_id]
      let driver = getVehicleDriver(vehicleNumber)
      let driverName = driver ? driver.name : ''
      let tel = driver ? this.getTel(driver) : ''
      this.state && this.state.push(driverName)
      this.state && this.state.push(tel)
      // this.getPersonOnCar()
    },
    horizontalToGeographic (x, y) {
      let xcoord = (36.15072107 + 1.93 * Math.pow(10,-8) * (x - 4677)).toFixed(8)  
      let ycoord = (112.99159417 - 1.97 * Math.pow(10,-8) * (y + 194)).toFixed(8)
      return [xcoord, ycoord]
    },
    getTel (driver) {
      let driverID = driver.staff_id
      let staff = window.xdata.state.metaStore.data.staff && window.xdata.state.metaStore.data.staff.get(driverID)
      let tel = staff && staff.telephone
      return tel
    },
    getPersonOnCar () {
      this.personList = this.info && xdata.PersonOnCarStore.personOnCarDetail.get(this.info.card_id)
      this.personOnCar = this.personList && this.personList.length > 0 && true
    },
    getShowPoint (evt) {
      let tt = this.$el
      let tbox = tt.getBoundingClientRect()  // tips 视区
      let tboxX = tt.offsetWidth,tboxY = tt.offsetHeight
      let mbox = tt.parentElement.getBoundingClientRect()  // 地图视区
      const pageHeader = 40//这里暂不使用document获取该高度

      let px = 0
      let py = 0
      let ex, ey
      // 点击事件在地图视窗中的坐标(ex, ey)
      if (evt.pixel) {
        ex = evt.pixel[0]
        ey = evt.pixel[1]
      } else {
        ex = evt.clientX
        ey = evt.clientY
      }
    
      let offset = 5

      if (mbox.width - ex > tboxX) { // 当点击点右边空间足够时，显示在点击点的右边
        px = ex + offset
      } else if (ex > tboxX) { // 当点击点左边空间足够时，显示在点击点的左边
        px = ex - tboxX - offset
      } else { // 居中显示
        px = (mbox.width - tboxX) / 2
      }

      if (mbox.height - ey > tboxY) { // 当点击点下边空间足够时，显示在点击点的下边
        py = ey + pageHeader + offset 
      } else if (ey > tboxY) { // 当点击点上边空间足够时，显示在点击点的上边
        py = ey + pageHeader - tboxY - offset 
      } else {  // 居中显示
        py = (mbox.height - tboxY) / 2
      }

      return { x: px, y: py }
    },
    draggable () {
      let target = this.$el
      let handle = this.$el.querySelector('.tips-title')
      window.setDraggable({
        target: target,
        handle: handle
      })
    },
    close () {
      this.$store.commit('mapService/hideCardTips')
    }
  },
  updated () { // 在updated后，组件被实例化了，产生了实体dom
    if (this.$store.state.mapService.showCardTips) { // false时，组件被卸载
      let point = this.getShowPoint(this.msg.event)
      this.$el.style.left = `${point.x}px`
      this.$el.style.top = `${point.y}px`
      this.draggable()
    }
  },
  components: {
    cardOpbar
  }
  // beforeUpdate(){}, 在beforUpdate的时候，首次点击时，组件没有被实例化
  // mounted(){} 在mounted的时候，由于v-if，组件并没有被实例化
}
</script>

<style lang="sass" scoped>
@import '../../style/defs.sass'
.card-tips
  position: absolute
  z-index: 999
  width: 32rem
  background: $color-eb
  .tips-title
    @include align-middle-between
    background: $main-color
    padding: 5px 1rem
    cursor: move
    color: $white
    height: 1.5rem
  .content-body
    padding: 1rem
    font-size: $fontsize-m
    .title-block
      height: 2rem
      line-height: 2rem
      border-bottom: 1px solid $color-ddd
      font-weight: bold
    .content-block
      display: flex
      flex-flow: row wrap
      &:nth-child(2)
        div:nth-child(1),div:nth-child(3)
          width: 50%
        div:nth-child(2)
          display: flex
          justify-content: center
      &:nth-child(4)
        div:nth-child(1),div:nth-child(2)
          width: 50%
      p
        height: 1.5rem
        line-height: 1.5rem
        white-space: nowrap
    img
      @include wh(1rem, 1rem)
.tipsop-panel
  border-top: 1px solid $color-ddd
  margin-top: .5rem
  padding: .8rem 0 .2rem 0
</style>
