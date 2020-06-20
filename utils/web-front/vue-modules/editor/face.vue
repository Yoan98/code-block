<template>
  <transition name="fade">
  <div class="layui-layer layui-layer-tips layui-edit-face edit-content" v-show="isShow">
    <div class="layui-layer-content">
      <ul class="layui-clear">
        <li v-for="(value, key) in lists" :key="'face' + key" @click="addEvent(key)">
          <img :src="value" alt="">
        </li>
      </ul>
    </div>
  </div>
  </transition>
</template>

<script>
import faces from '@/assets/js/face'

export default {
  name: 'face',
  data () {
    return {
      lists: faces
    }
  },
  props: ['isShow'],
  methods: {
    addEvent (item) {
      this.$emit('addEvent', item)
      this.$emit('closeEvent')
    }
  }
}

</script>
<style lang='scss' scoped>

</style>
