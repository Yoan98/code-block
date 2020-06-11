<template>
  <transition name="fade">
    <div
      class="layui-layer layui-layer-page layui-layer-prompt edit-content"
      v-show="isShow"
    >
      <div class="layui-layer-title">请贴入代码或任意文本</div>
      <div class="layui-layer-content">
        <textarea
          class="layui-textarea"
          id="codeInput"
          v-model="code"
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
  name: 'codeInsert',
  data () {
    return {
      code: ''
    }
  },
  props: ['isShow'],
  methods: {
    close () {
      // 清空输入内容，选择的文件
      this.$emit('closeEvent')
      this.code = ''
    },
    submit () {
      if (this.code === '') {
        document.getElementById('codeInput').focus()
        this.$pop('请输入内容', 'shake')
        return
      }
      this.$emit('addEvent', this.code)
      setTimeout(() => {
        this.close()
      }, 0)
    }
  }
}

</script>
<style lang='scss' scoped>
#codeInput {
  width: 500px;
  height: 200px;
}
</style>
