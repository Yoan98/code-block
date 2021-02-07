<template>
  <transition name="fade">
  <div class="layui-layer layui-layer-page layui-layer-border edit-content" v-show="isShow" ref='img'>
    <div class="layui-layer-title">插入图片</div>
    <div class="layui-layer-content">
      <ul class="layui-form layui-form-pane">
        <li class="layui-form-item">
        <label class="layui-form-label">URL</label>
        <div class="layui-input-inline">
          <input type="text" id="fileInput" v-model="name" placeholder="粘贴图片地址或者点击上传" class="layui-input">
        </div>
        <button type="button" class="layui-btn layui-btn-primary">
          <label for="uploadImg">
            <i class="layui-icon layui-icon-upload"></i>上传图片
          </label>
        </button>
        <input type="file" name="file" id="uploadImg" @change='upload' class="layui-upload-file">
        </li>
        <li class="layui-form-item">
          <button type="button" class="layui-btn" @click="submit()">确认</button>
        </li>
      </ul>
    </div>
    <span class="layui-layer-setwin" @click.stop="close()">
      <a href="javascript:;" class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
    </span>
  </div>
  </transition>
</template>

<script>
import { upload } from '@/api/content'
import config from '@/config/index'

export default {
  name: 'uploadImg',
  props: ['isShow'],
  data () {
    return {
      name: '',
      formData: ''
    }
  },
  methods: {
    close () {
      // 清空输入内容，选择的文件
      this.$emit('closeEvent')
      this.name = ''
      this.formData = ''
    },
    upload (e) {
      // 绑定文件对象到表单对象中（用于上传文件）
      let file = e.target.files
      let formData = new FormData()
      if (file.length > 0) {
        formData.append('file', file[0])
        this.formData = formData
      }
      // 上传图片
      upload(formData).then(res => {
        if (res.code === 200) {
          this.name = config.baseURL + res.data
        }
      })
      document.getElementById('uploadImg').value = ''
    },
    submit () {
      if (this.name === '') {
        document.getElementById('fileInput').focus()
        this.$pop('请输入路径', 'shake')
        return
      }
      this.$emit('addEvent', this.name)
      setTimeout(() => {
        this.close()
      }, 0)
    }
  }
}

</script>
<style lang='scss' scoped>
.layui-form-item{
  text-align: center
}
.layui-form-pane{
  margin: 20px;
}
</style>
