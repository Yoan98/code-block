<template>
  <transition name="fade">
    <div
      class="layui-layer layui-layer-page layui-layer-prompt edit-content"
      v-show="isShow"
      id="preview"
    >
      <div class="layui-layer-title">预览</div>
      <div class="layui-layer-content" v-html="replaceHtml">
      </div>
      <span class="layui-layer-setwin">
        <a
          href="javascript:;"
          class="layui-layer-ico layui-layer-close layui-layer-close1"
          @click="close()"
        ></a>
      </span>
    </div>
  </transition>
</template>
<script>
import { escapeHtml } from '@/utils/escapeHtml'
export default {
  name: 'preview',
  props: ['isShow', 'contents'],
  computed: {
    replaceHtml () {
      if (this.contents === '') return
      return escapeHtml(this.contents)
    }
  },
  methods: {
    close () {
      // 清空输入内容，选择的文件
      this.$emit('closeEvent')
    }
  }
}

</script>
<style lang='scss' scoped>
#preview{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0 ;
  left: 0;
  z-index: 30000;
}
</style>
