<template>
  <div class="tips" :class="{shake: type}" v-show="isShow">
    <p>{{ msg }}</p>
  </div>
</template>

<script>

export default {
  name: 'Pop',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    }
  },
  watch: {
    isShow (newVal, oldVal) {
      if (newVal !== oldVal && newVal === true) {
        setTimeout(() => {
          this.isShow = false
        }, 1000)
      }
    }
  }
}

</script>
<style lang='scss' scoped>
@keyframes shake {
  0%, 100% {transform: translate(-0.5);}
  10%,30%,50%,70%,90%{transform: translateX(-10px);}
  20%, 40%, 60%, 80%{transform: translateX(10px);}
}
.tips {
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: rgba(0,0,0,0.5);
  transform: translate(-0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: white;
    font-size: 14px;
  }
}
.shake {
  animation-name: shake;
  animation-fill-mode: both;
  animation-duration: .5s;
}
</style>
