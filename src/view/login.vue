<template>
  <div class="page-login">
    <div class="logo">
      <img src="../assets/luanlogo.png" alt="">
    </div>
    <div class="login">
      <div class="login-head">
        <div>矿井北斗精准定位安全管理系统</div>
        <div>精益化生产 · 精准化管控 · 精细化操作</div>
      </div>
      <div class="login-body">
        <text-file :textObj="textObj.userObj" v-on:keydown="hidemsg"></text-file>
        <text-file :textObj="textObj.pwd" v-on:keydown="hidemsg"></text-file>
        <div class="logintips">{{message}}</div>
        <button @click="login">登录</button>
      </div>
    </div>
    <div class="comp">
      <img src="../assets/logo.png" alt="">
      <span>©2017 永安信通</span>
    </div>
  </div>
</template>
<script>
import textFile from '../components/text-file.vue'
import {mapState} from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      message: null,
      textObj: {
        'userObj': {
          type: 'text',
          icon: 'icon-account',
          holder: '请输入用户名',
          id: 'username'
        },
        'pwd': {
          type: 'password',
          icon: 'icon-lock',
          holder: '请输入密码',
          id: 'pwd'
        }
      }
    }
  },
  computed: {
    ...mapState({
      gotoMonitor: state => state.user.logined
    })
  },
  watch: {
    gotoMonitor: function () {
      if (this.$store.state.user.logined) {
        this.$router.push('/main')
      }
    }
  },
  methods: {
    login () {
      let username = this.$el.querySelector('#username').querySelector('input').value
      let pwd = this.$el.querySelector('#pwd').querySelector('input').value
      if (username && pwd) {
        this.$store.dispatch('user/users', {
          cmd: 'LOGIN',
          data: {
            user_name: username,
            user_pwd: pwd
          }
        })
      } else {
        this.message = '请输入用户名、密码，再按登录'
      }
    },
    hidemsg () {
      if (this.message) {
        this.message = null
      }
    }
  },
  components: {
    'text-file': textFile
  },
}
</script>
<style lang="sass">
  @import '../style/defs.sass'
  html, body 
    width: 100%
    height: 100%
    margin: 0
    padding: 0
    font-size: 16px
  svg
    width: 1rem
    height: 1rem
  .page-login 
    width: 100%
    height: 100%
    @include flex-cloumn
    background: url('../assets/bj@2x.jpg') scroll 50% 50% / cover border-box
  .logo
    flex: 0 0 3rem
    img
      @include wh(8rem, auto)
      padding-left: 1rem
  .login
    @include flex-center-center
    flex: auto
    .login-head
      color: $font-white
      height: 10rem
      div:nth-child(1)
        font-size: $fontsize-xxl
        margin-bottom: 1rem
      div:nth-child(2)
        font-size: $fontsize-l
        text-align: center
    .login-body
      @include flex-center-center
      padding: 2.7rem 4rem
      background: $login-background
      box-shadow: $login-shadow
      button
        @include wh(100%, 2rem)
        background: $main-color
        border: 0
        color: $white
  .comp 
    @include flex-align-item
    flex: 0 0 3rem
    color: $white
    font-size: $fontsize-s
    img
      @include wh(6rem, auto)
</style>

