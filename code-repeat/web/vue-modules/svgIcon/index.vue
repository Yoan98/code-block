<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="symbolName"></use>
  </svg>
</template>

<script>
// 导入所有的svg图片
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
  name: 'svg-icon',
  props: {
    icon: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    symbolName () {
      return '#icon-' + this.icon
    }
  }
}

</script>
<style lang='scss' scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
