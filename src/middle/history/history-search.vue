<template>
    <div class="whfill history-search">
        <nav>
            <img src='static/image/historyLogo.png'>
            <h4>历史查询</h4>
        </nav>
        <div class="search-content">
            <ul>
                <li  v-for="(item,index) in changeList" :key="index" :class="item.class">
                    <span>{{ item.label }}</span>
                </li>
            </ul>
            <div class="search-change">
                <svg class="icon active" name="cardtypeid" ref="cardtypeid" value="2">
                    <use href='#icon-vehicle-big'></use>
                </svg>
                <span>|</span>
                <svg class="icon" name="cardtypeid" ref="cardtypeid" value="1">
                    <use href='#icon-staff-big'></use>
                </svg>
            </div>
            <div class="search-input">
                <!-- todo: independence a common component -->
                <input class="whfill" placeholder="请输入车牌号..."/>
            </div>
            <div class="search-img">
                <img src="static/image/serachWhite.png">
            </div>
        </div>
    </div>
</template>
<script>
export default{
  data () {
    return {
      changeList: [{ name: 'queryTrack', class: 'queryTrack', label: '历史轨迹' }, { name: 'querySence', class: 'hide querySence', label: '场景重现' }]
    }
  }
}
</script>
<style lang="sass" scoped>
    @import '../../style/defs.sass'
    .history-search
        padding: 7% 25% 2% 25%
        background: #fff
        display: flex
        flex-direction: column
        box-sizing: border-box
        nav
            flex: 0.21
            @include flex-center
        .search-content
            @include flex-center
            flex: 0.12
            display: flex
            ul
                height: 2.6rem
                margin: 0
                display: flex
                flex-direction: column
                flex: .9
                li
                    width: 100%
                    background: #eeeeee
                    &.hide
                        display: none
            .search-change
                height: 2.5rem
                flex: .6
                @include flex-center
                justify-content: space-evenly
                border: 1px solid #ccc
                border-right: none
                span
                    color: #ccc
                .icon
                    fill: #ccc
            .search-input
                height: 2.5rem
                flex: 1.8
                border: 1px solid #ccc
                border-left: none
                input
                    border: none
                    padding-left: .5rem
            .search-img
                height: 2.6rem
                flex: .7
                background: #09f
                display: flex
                align-items: center
                justify-content: space-around
                img
                    @include wh(auto,1.8rem)
</style>