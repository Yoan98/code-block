<template>
    <div class="edit-wrap">
      <div class="layui-form-item layui-form-text">
        <div class="layui-input-block">
          <div class="layui-unselect fly-edit" ref="wrap">
            <span @click="choose('face')" title="表情">
              <i class="iconfont icon-yxj-expression" ></i>
            </span>
            <span @click="choose('img')" title="图片">
              <i class="iconfont icon-tupian"></i>
            </span>
            <span @click="choose('link')" title="链接">
              <i class="iconfont icon-lianjie"></i>
            </span >
            <span class="quote" @click="choose('quote')" title="引入">
              ''
            </span>
            <!-- <span @click="choose('code')" title="代码片段">
              <i class="iconfont icon-emwdaima"></i>
            </span> -->
            <span @click="addHr()" title="换行">
              hr
            </span>
            <span @click="choose('preview')" title="预览">
              <i class="iconfont icon-yulan1" ></i>
            </span>
          </div>
          <textarea
          class="layui-textarea fly-editor"
          id='editor'
          name="content"
          v-model="contents"
          @blur="blurEvent()"
          ref="textarea"
          ></textarea>
        </div>
      </div>
      <div ref="model">
      <Face
      :isShow="status.face"
      @closeEvent="() => {status.face = false}"
      @addEvent="addFace"
      ></Face>
      <upload-img
      :isShow="status.img"
      @closeEvent="() => {status.img = false}"
      @addEvent="addImg"
      ></upload-img>
      <link-add
      :isShow="status.link"
      @closeEvent="() => {status.link = false}"
      @addEvent="addLink"
      ></link-add>
      <Quote
      :isShow="status.quote"
      @closeEvent="() => {status.quote = false}"
      @addEvent="addQuote"
      >
      </Quote>
      <!-- <code-insert
      :isShow="status.code"
      @closeEvent="() => {status.code = false}"
      @addEvent="addCode"
      >
      </code-insert> -->
      <Preview
      :isShow="status.preview"
      :contents="contents"
      @closeEvent="() => {status.preview = false}"
      ref="preview"
      ></Preview>
      </div>
    </div>
</template>

<script>
import Face from './face'
import UploadImg from './uploadImg'
import LinkAdd from './linkAdd'
import Quote from './quote'
// import CodeInsert from './codeInsert'
import Preview from './preview'
import { cleanActive } from '@/utils/common'

export default {
  name: 'editor',
  props: ['initContent'],
  data () {
    return {
      status: {
        face: false,
        img: false,
        link: false,
        quote: false,
        code: false,
        preview: false
      },
      contents: '',
      cursorPos: 0
    }
  },
  watch: {
    initContent () {
      this.contents = this.initContent
    }
  },
  updated () {
    this.$emit('addContents', this.contents)
  },
  components: {
    Face,
    UploadImg,
    LinkAdd,
    Quote,
    // CodeInsert,
    Preview
  },
  mounted () {
    this.$nextTick(() => {
      document.querySelector('body').addEventListener('click', this.handleClose)
    })
  },
  methods: {
    handleClose (e) {
      e.stopPropagation()
      if (!this.$refs.wrap.contains(e.target) && !this.$refs.model.contains(e.target)) {
        cleanActive(this.status)
      }
    },
    // 添加表情
    addFace (item) {
      const insertContent = `face${item}`
      this.insert(insertContent)
      this.cursorPos += insertContent.length
    },
    addImg (item) {
      const insertContent = `img[${item}]`
      this.insert(insertContent)
      this.cursorPos += insertContent.length
    },
    addLink (item) {
      const insertContent = `a(${item})[${item}]`
      this.insert(insertContent)
      this.cursorPos += insertContent.length
    },
    addQuote (item) {
      const insertContent = `\n[quote]\n${item}\n[/quote]`
      this.insert(insertContent)
      this.cursorPos += insertContent.length
    },
    addCode (item) {
      const insertContent = `\n[code]\n[${item}]\n[/code]`
      this.insert(insertContent)
      this.cursorPos += insertContent.length
    },
    addHr () {
      this.insert('\n[hr]')
      this.cursorPos += 5
    },
    // 添加表情等到文本域中
    insert (item) {
      const tmpArr = this.contents.split('')
      tmpArr.splice(this.cursorPos, '0', item)
      this.contents = tmpArr.join('')
    },
    blurEvent () {
      this.cursorPos = this.getCursorPos()
    },
    // 获取光标在文本域中的位置
    getCursorPos () {
      return this.$refs.textarea.selectionStart
    },
    choose (item) {
      cleanActive(this.status)
      this.status[item] = true
    }
  },
  beforeDestroy () {
    document.querySelector('body').removeEventListener('click', this.handleClose)
  }
}

</script>
<style lang='scss' scoped>
.fly-editor{
  height: 260px;
}

.edit-wrap{
  position: relative;
}
.edit-content{
  position: absolute;
  z-index: 1;
  top: 45px;
  left: 0;
}
</style>
