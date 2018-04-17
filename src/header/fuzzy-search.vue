<template>
  <div class="fuzzy-search">
    <div class="search-type-selector" id="typeselector">{{searchType.label}}</div>
    <div class="search-icon" id="selecticon"><img src="../assets/search.png"></div>
    <div v-show="isShowTypeList" class="popup-list type-panel">
      <span v-for="stype in typeDef" :key="stype.index" class="list-item" :data-index="stype.index">{{stype.label}}</span>
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
    .search-icon
      position: absolute
      top: -2px
      right: 4px
</style>
