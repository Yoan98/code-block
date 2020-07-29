<template>
  <transition name="fade">
    <div
      class="layui-layer layui-layer-page layui-layer-prompt edit-content"
      v-show="isShow"
    >
      <div class="layui-layer-title">请输入合法链接</div>
      <div class="layui-layer-content">
        <input
          type="text"
          class="layui-layer-input"
          id="linkInput"
          v-model="link"
        />
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
  name: 'linkAdd',
  data () {
    return {
      link: ''
    }
  },
  props: ['isShow'],
  methods: {
    close () {
      // 清空输入内容，选择的文件
      this.$emit('closeEvent')
      this.link = ''
    },
    submit () {
      if (this.link === '') {
        document.getElementById('linkInput').focus()
        this.$pop('请输入内容', 'shake')
        return
      }
      this.$emit('addEvent', this.link)
      setTimeout(() => {
        this.close()
      }, 0)
    }
  }
}
</script>
<style lang="" scoped></style>
