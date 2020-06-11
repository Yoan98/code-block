<template>
  <div class="pagenation" v-if="pages !== 0">
    <div class="layui-box layui-laypage layui-laypage-default page-block">
      <a
        href="javascript:;"
        class="layui-laypage-prev"
        :class="{ 'layui-disabled': pageIndex === 1 }"
        @click="pageSub"
      >
        <em>←</em>
      </a>
      <a
        href="javascript:;"
        class="layui-laypage-last"
        v-if="pageIndex !== 1"
        @click="
          () => {
            pageIndex = 1
            minPage = 0
            maxPage = 6
          }
        "
        >首页</a
      >
      <div v-for="index in pages" :key="'page' + index" class="pagePoint">
        <span v-if="isOmit(index)" class="layui-laypage-spr layui-disabled">…</span>
        <span
          v-else-if="index < maxPage && index > minPage"
          :class="{ 'layui-laypage-curr': pageIndex === index }"
          @click.prevent="choose(index)"
        >
          <em class="layui-laypage-em"></em>
          <em>{{ index }}</em>
        </span>
      </div>
      <a
        href="javascript:;"
        class="layui-laypage-last"
        v-if="pageIndex !== pages"
        @click="
          () => {
            const limitPage = maxPage - minPage
            pageIndex = pages
            maxPage = pages + 1
            minPage = maxPage - limitPage
          }
        "
        >尾页</a
      >
      <a
        href="javascript:;"
        class="layui-laypage-next"
        @click="pageInc"
        :class="{ 'layui-disabled': pageIndex === pages }"
      >
        <em>→</em>
      </a>
    </div>
    <div class="skipPage page-block">
      <span @click="skip(Number(skipPage))">跳转到</span><input type="text" v-model="skipPage">页
    </div>
  </div>
</template>

<script>
export default {
  name: 'pagenation',
  data () {
    return {
      pageIndex: 1,
      maxPage: 6,
      minPage: 0,
      changePage: 2,
      skipPage: 1
    }
  },

  props: {
    // 总页数
    pages: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 监听页数的变化，控制最大页数与最小页数的范围
    pageIndex (newVal, oldVal) {
      // 改变组件内的页数
      if (this.pageIndex === this.maxPage - 1 && this.pageIndex !== this.pages) {
        this.maxPage += this.changePage
        this.minPage += this.changePage
        this.pageInitConfig()
      } else if (this.pageIndex === this.minPage + 1 && this.pageIndex !== 1) {
        this.maxPage -= this.changePage
        this.minPage -= this.changePage
        this.pageInitConfig()
      }
      // 将用户选择页数传递出去
      this.$emit('changePage', this.pageIndex)
    }
  },
  methods: {
    isOmit (index) {
      if (index === this.maxPage || index === this.minPage) {
        return true
      }
      return false
    },
    choose (index) {
      this.pageIndex = index
    },
    skip (index) {
      if (index > this.pages || index <= 0) {
        this.skipPage = 1
        this.$pop('小伙子，好好搞', 'shake')
        return
      }
      const limitPage = this.maxPage - this.minPage
      this.maxPage = index + 1
      this.minPage = this.maxPage - limitPage

      this.pageInitConfig()

      this.pageIndex = index
    },
    // 边界条件的设置
    pageInitConfig () {
      // 最大页数的边界条件
      if (this.maxPage > this.pages) {
        const limitPage = this.maxPage - this.minPage
        this.maxPage = this.pages + 1
        this.minPage = this.maxPage - limitPage
      }
      // 最小页数的边界条件
      if (this.minPage < 0) {
        const limitPage = this.maxPage - this.minPage
        this.minPage = 0
        this.maxPage = this.minPage + limitPage
      }
    },
    pageSub () {
      if (this.pageIndex === 1) return
      this.pageIndex -= 1
    },
    pageInc () {
      if (this.pageIndex === this.pages) return
      this.pageIndex += 1
    }
  }
}
</script>
<style lang="scss" scoped>
.pagenation{
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-block {
  span:hover {
    cursor: pointer;
    color: #009688;
  }
}
.pagePoint{
  display: inline;
}
.skipPage {
    font-size: 12px;
    color: #333;
    margin-left: 5px;
  input {
    width: 30px;
    height: 30px;
    border: 1px solid #e2e2e2;
    background-color: #fff;
    text-align: center;
    line-height: 30px;
    margin: 0 5px;
    border-radius: 3px;
  }
}

</style>
