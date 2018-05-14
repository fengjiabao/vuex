<template>
    <div class="pagination-bar" v-if="totalpage>1">
        <div class="page-tag-group">
            <b class="page-tag-jump circle-b" data-value="FirstPage" title="首页" @click="pageJump">
                <i class="circle"></i>
                <svg class="icon black-icon opicon">
                    <use xlink:href="#icon-first_page"></use>
                </svg>
            </b>
            <b class="page-tag-jump circle-b" data-value="PreviewPage" title="上一页" @click="pageJump">
                <i class="circle"></i>
                <svg class="icon black-icon opicon">
                    <use xlink:href="#icon-navigate_before"></use>
                </svg>
            </b>
        </div>
        <div class="page-tag-group">
            <span v-if="needPreviewEllipsis"> ... </span>
            <b v-for="(item,index) in pageTags" class="page-tag-jump circle-b" :key="index" :data-value="item" @click="
                pageJump">
                <i class="circle"></i>
                <span>{{item}}</span>
            </b>
            <span v-if="needNextEllipsis"> ... </span>
        </div>
        <div class="page-tag-group">
            <b class="page-tag-jump circle-b" data-value="NextPage" title="下一页" @click="pageJump">
                <i class="circle"></i>
                <svg class="icon black-icon opicon">
                    <use xlink:href="#icon-navigate_next"></use>
                </svg>
            </b>
            <b class="page-tag-jump circle-b" data-value="LastPage" title="末页" @click="pageJump">
                <i class="circle"></i>
                <svg class="icon black-icon opicon">
                    <use xlink:href="#icon-last_page"></use>
                </svg>
            </b>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      maxTagCount: 5, // 最多显示 5 个页码
      pageTags: null,
      needPreviewEllipsis: false,
      needNextEllipsis: false
    }
  },
  computed: {
    maxLeftTags: function () {
      return Math.floor(this.maxTagCount / 2)
    },
    pageTag: function () {
      return this.pageindex + 1
    }
  },
  props: ['totalpage', 'pageindex', 'name'],
  created () {
    let maxTag = Math.min(this.totalpage, this.maxTagCount)

    if (this.totalPage > this.maxTagCount) {
      let startIndex = -1
      let endIndex = -1

      startIndex = this.pageindex - this.maxLeftTags
      if (startIndex <= 0) {
        startIndex = 0
      }
      endIndex = startIndex + this.maxTagCount

      if (endIndex > this.totalPage - 1) {
        endIndex = this.totalPage - 1
        startIndex = endIndex - this.maxTagCount + 1
      }

      this.pageTags = Array.from({ length: maxTag }, (v, k) => startIndex + k + 1)  // the last tag is this.pages, so: maxTag - 1
      this.needPreviewEllipsis = (startIndex > 0)
      this.needNextEllipsis = (endIndex < this.totalPage - 1)
    } else {
      this.needPreviewEllipsis = false
      this.needNextEllipsis = false
      this.pageTags = Array.from({ length: maxTag }, (v, k) => k + 1)  // the last tag is this.pages, so: maxTag - 1
    }
    console.log('pageTags', this.pageTags)
  },
  methods: {
    pageJump: function () {

    }
  }
}
</script>
<style lang="sass" scoped>
    .pagination-bar
        display: flex
        justify-content: space-evenly
        padding: 1rem 30%
        .page-tag-group
            display: flex
            .page-tag-jump
                width: 20px
                height: 20px
                margin-right: 4px
                cursor: pointer
        .icon
            fill: #000
</style>