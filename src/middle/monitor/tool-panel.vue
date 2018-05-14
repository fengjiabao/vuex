<template>
  <div class="tool-panel">
      <ul class="toolTitle">
          <li v-for="(item,index) in ToolItems" :key="index" @click="showToolList($event)" :name="item.name">
            <svg class = "icon">
                <use :xlink:href="item.iconName"></use>
            </svg>
          </li>
      </ul>
      <ul class="toolList" ref='toolList' v-if="showPanelList" :style="leftPosition">
        <li class="triangle"></li>
        <li v-for="(item,index) in toolListData" :key="index">
            <svg class = "icon">
                <use :xlink:href="item.iconName"></use>
            </svg>
            <span>{{item.cont}}</span>
        </li>
      </ul>
  </div>
</template>
<script>
import {ToolItems} from '../../js/def/tool_panel_def.js'
import { ToolList } from '../../js/def/tool_list_def.js'
export default {
  data () {
    return {
      ToolItems: ToolItems,
      ToolListdef: ToolList,
      showPanelList: false,
      toolListData: null,
      containsListName: ['layer', 'search', 'measure'],
      leftPosition: 'left: 0px'
    }
  },
  watch: {
    '$store.state.olMapCardLayer.hideAllPopup': {
      handler: function (result) {
        this.showPanelList = false
      }
    }
  },
  methods: {
    showToolList: function (evt) {
      let name = evt.currentTarget.getAttribute('name')
      this.showPanelList = !!this.containsListName.includes(name)
      if (this.showPanelList) {
        this.toolListData = this.ToolListdef[name]
        this.leftPosition = 'left: ' + String(evt.clientX - this.$el.getBoundingClientRect().left - 100) + 'px'
      }
    }
  }
}
</script>
<style lang="sass" scoped>
@import '../../style/defs.sass'
.tool-panel
    @include absolute-right(1rem,1rem)
    @include wh(20rem,4rem)
    border: 1px solid #e3e3e3
    background: #f5f5f5
    .icon
        fill: #ccc
    .toolTitle,li,.toolList
        margin: 0
    .toolTitle
        li
            @include align-middle-between
            justify-content: space-around
    .toolList
        @include wh(auto,auto)
        display: flex
        flex-direction: column
        height: auto
        padding: 0.5rem
        background: #FFF
        min-width: 100px
        position: absolute
        top: 5.4rem
        li
            @include wh(100%,1.75rem)
            font-size: 12px
            display: flex
            align-items: center 
            span
                margin-left: .75rem
        .triangle
            width: 1px
            @include absolute-left(-2.7rem,60%)
            border-bottom: 16px solid #fff
            border-left: 10px solid transparent
            border-right: 9px solid transparent
</style>

