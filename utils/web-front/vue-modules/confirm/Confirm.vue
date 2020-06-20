<template>
  <div v-show="isShow">
    <div class="confirm">
      <div class="msg">{{ msg }}</div>
      <div class="btnBlock">
      <button type="button" class="layui-btn " @click="confirm()">确认</button>
      <button type="button" class="layui-btn layui-btn-primary" @click="cancel()">取消</button>
      </div>
    </div>
    <div class="shadow" @click="close()"></div>
  </div>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    msg: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    fn1: Function,
    fn2: Function
  },
  methods: {
    close () {
      this.isShow = false
    },
    confirm () {
      this.fn1()
      this.close()
    },
    cancel () {
      this.fn2()
      this.close()
    }
  }

}
</script>
<style lang="scss" scoped>
.confirm {
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

  .btnBlock {
    width: 60%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .msg{
    flex: 1;
    display: flex;
    text-align: center;
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
