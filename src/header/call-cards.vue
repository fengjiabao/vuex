<template>
  <div class="dlg-window animated" v-if="isShow">
    <div class="dlg-bg call-person-dialog animated zoomIn">
      <!-- <div data-is="dialog-head" title="发起呼叫" closer="yes"></div> -->
      <dialog-head :headContent="headMsg"></dialog-head>
      <div v-if="hasdata" class="content-area">
      <div class="content-panel">
        <div class="content-block content-value">
          <p>
            <span class="content-block content-title">发起人员：</span>
            <span class="content-cont">{{ xdata.state.user.username }}</span>
          </p>
          <p>
            <span class="content-block content-title">呼叫模式：</span>
            <span class="content-cont">
              <span class="point" call-type="all" >
                  <input type="radio" name="sex" id="male" checked/>
                  <label for="male">全员</label>
              </span>
              <span class="point" call-type='special'>
                  <input type="radio" name="sex" id="female"/>
                  <label for="female">定员</label>
              </span>
            </span>
          </p>
          <p>
            <span class="content-block content-title">呼叫类型：</span>
            <span class="content-cont">
              <span class="point" call-type="callNormal">
                  <input type="radio" name="call" id="maleNor" checked/>
                  <label for="maleNor">一般</label>
              </span>
              <span class="point" call-type='callNow' >
                  <input type="radio" name="call" id="femaleUn"/>
                  <label for="femaleUn">紧急</label>
              </span>
            </span>
          </p>
          <p>
            <span class="content-block content-title">井下区域：</span>
            <span class="content-cont" v-if="callALL">{{ Array.from(xdata.state.metaStore.data.area).length }} 个</span>
            <span class="content-cont" v-if="callSpecial" id="callSpecial">
              <span v-for="i in readers" :key="i.index" class="chooseListDown">
                <span :data-type="i.areaID">{{ i.area }}</span>
                <img src="/img/close.png" alt="" class="icon" name="reader">
              </span>
              <span type="button" class="expr-builder__button" name="area">
                + 新增区域
              </span>
              <div id="call-list" class="call-list-area"></div>
            </span>
          </p>
          <p>
            <span class="content-block content-title">井下人员：</span>
            <span class="content-cont" v-if="callALL">{{ staffNumber && staffNumber.length }}人</span>
            <span class="content-cont" v-if="callSpecial" id="callSpecialStaff">
              <span v-for="i in staffs" :key="i.index" class="chooseListDown">
                <span :data-type="i.card">{{ i.cardid }}</span>
                <img src="/img/close.png" alt="" class="icon" name="staff" :data-type="i.card">
              </span>
              <span v-if="showNull" class="shownull">当前区域无人员</span>
              <span type="button" class="expr-builder__button" name="staff">
                + 新增人员
              </span>
              <div id="call-list" class="call-list-staff"></div>
            </span>
          </p>
          <p>
            <span class="content-block content-title">持续时间：</span>
            <select class="content-cont" id="calltime">
              <option selected value="5">5分钟</option>
              <option value="10">10分钟</option>
              <option value="20">20分钟</option>
              <option value="60">60分钟</option>
            </select>
          </p>
        </div>
      </div>
      <div class="dlg-foot">
        <button class="btn-sure" >确认</button>
        <button class="btn-cancel">取消</button>
      </div>
    </div>
    <blank-message :blankMsg="message" class="blank-message" v-if="!hasdata"></blank-message>
    <!-- <div data-is="blank-message" message="当前井下没有人员。" class="blank-message" if={ !hasdata }></div> -->
    </div>
  </div>
</template>
<script>
import dialogHead from '../components/dialog-head.vue'
import blankMessage from '../components/blank-message.vue'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      hasdata: false,
      headMsg: {
        title: '发起呼叫',
        closer: true
      },
      message: '当前井下没有人员。'
    }
  },
  computed: {
    ...mapState({
      isShow: state => state.stateStore.showCallCards
    })
  },
  components: {
    dialogHead,
    blankMessage
  },
  methods: {
    close () {
      this.$store.commit('stateStore/changeShowCallCards')
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../style/defs.sass'
.call-person-dialog
  @include wh(21rem, 14rem)
  background: $white
</style>
