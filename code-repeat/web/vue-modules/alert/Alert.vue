<template>
  <div v-show="isShow">
    <div class="alert">
      <div class="msg">{{ msg }}</div>
      <button type="button" class="btn" @click="close()">确认</button>
    </div>
    <div class="shadow" @click="close()"></div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: {
    msg: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.isShow = false
    }
  }

}
</script>
<style lang="scss" scoped>
.alert {
  position: fixed;
  width: 300px;
  height: 150px;
  top: 50%;
  left: 50%;
  padding: 40px;
  margin-top: -75px;
  margin-left: -150px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 10px 8px rgba(0, 0, 0, 0.5);
  z-index: 3000;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .btn {
    width: 100px;
    height: 40px;
    border: none;
    border-radius: 6px;
    background-color: #009688;
    color:white;
    font-size: 16px;
  }
  .msg{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px
  }
}

.shadow{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color:rgba(0, 0, 0, 0.5);
  z-index:2000;
}
</style>
