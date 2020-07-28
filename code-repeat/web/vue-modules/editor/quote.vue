<template>
  <transition name="fade">
    <div
      class="layui-layer layui-layer-page layui-layer-prompt edit-content"
      v-show="isShow"
    >
      <div class="layui-layer-title">请输入引用内容</div>
      <div class="layui-layer-content">
        <textarea
          class="layui-textarea"
          id="quoteInput"
          v-model="quote"
          placeholder="请输入"
        >
        </textarea>
      </div>
      <span class="layui-layer-setwin">
        <a
          href="javascript:;"
          class="layui-layer-ico layui-layer-close layui-layer-close1"
          @click="close()"
        ></a>
      </span>
      <div class="layui-layer-btn">
        <a href="javascript:;" class="layui-layer-btn0" @click="submit()"
          >确定</a
        >
        <a href="javascript:;" class="layui-layer-btn" @click="close()">取消</a>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'quote',
  data () {
    return {
      quote: ''
    }
  },
  props: ['isShow'],
  methods: {
    close () {
      // 清空输入内容，选择的文件
      this.$emit('closeEvent')
      this.quote = ''
    },
    submit () {
      if (this.quote === '') {
        document.getElementById('quoteInput').focus()
        this.$pop('请输入内容', 'shake')
        return
      }
      this.$emit('addEvent', this.quote)
      setTimeout(() => {
        this.close()
      }, 0)
    }
  }
}

</script>
<style lang='scss' scoped>
#quoteInput {
  width: 400px;
}
</style>
