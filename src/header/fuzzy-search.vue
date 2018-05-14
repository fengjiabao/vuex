<template>
  <div class="fuzzy-search">
    <div class="search-type-selector" id="typeselector" @click="showList">{{searchType.label}}</div>
    <div class="search-icon" id="selecticon"><img src="../assets/search.png"></div>
    <div v-show="isShowTypeList" class="popup-list type-panel">
      <span v-for="(stype, index) in typeDef" :key="index" class="list-item" @click="changeType($event)" :data-index="index">{{stype.label}}</span>
    </div>
    <input id="searchinput" ref="searchinput" type="search" class="search-box" size="10" :placeholder="searchType.placeholder">
  </div>
</template>
<script>
export default {
  name: 'fuzzySearch',
  data () {
    return {
      typeDef: [
        { key: 'vehicle', id: 2, label: '车辆', prefix: '002', placeholder: '车牌、车牌首字母、卡号' },
        { key: 'staff', id: 1, label: '人员', prefix: '001', placeholder: '姓名、姓名首字母、卡号' }
      ],
      searchType: { key: 'vehicle', id: 2, label: '车辆', prefix: '002', placeholder: '车牌、车牌首字母、卡号' },
      isShowTypeList: false
    }
  },
  methods: {
    showList () {
      this.isShowTypeList = !this.isShowTypeList
    },
    changeType (evt) {
      let target = evt.target
      let index = parseInt(target.getAttribute('data-index'), 10)
      this.searchType = this.typeDef[index]
      this.isShowTypeList = false
    }
  }
}
</script>
<style lang="sass">
  @import '../style/defs.sass'
  .fuzzy-search
    @include flex-column-center
    position: relative
    font-size: $fontsize-s
    input
      @include wh(12rem, 1.6rem)
      padding: 0 1.5rem 0 3rem
      border: 0
      border-radius: 1rem
      background: $white
    .search-type-selector
      position: absolute
      left: 4px
      background: $main-color
      height: 1.4rem
      line-height: 1.4rem
      border-radius: 12px 0 0 12px
      padding: 0 4px
      cursor: pointer
    .search-icon
      position: absolute
      top: -2px
      right: 4px
      img
        cursor: pointer
    .popup-list
      @include wh(5rem, 4rem)
      @include flex-center-center
      padding: 1rem
      color: $font-333
      @include trbl(1.7rem, 0, 0, 0rem)
      background: $gray-s
      z-index: 99
      span
        @include wh(100%, 2rem)
        line-height: 2rem
        cursor: pointer
        text-align: center
        &:hover
          background: $gray-m
</style>
