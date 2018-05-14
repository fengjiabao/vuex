<template>
  <div v-if="isShow" class="dlg-window">
    <div class="dlg-bg">
      <dialog-head :headContent="headMsg"></dialog-head>
      <div class="modify-body modify-form" v-if="mode === 'REQUEST'">
        <div>
          <label for="oldpwd">当前密码：</label>
          <text-file :textObj="textObj.oldpwd"></text-file>
        </div>
        <div>
          <label for="newpwd">新密码：</label>
          <text-file :textObj="textObj.newpwd"></text-file>
        </div>
        <div>
          <label for="newpwd2">重复新密码：</label>
          <text-file :textObj="textObj.newpwd2"></text-file>
        </div>
        <div :class="hint ? 'error-message' : 'error-message node-hide'">{{ hint }}</div>
      </div>
      <div class="modify-body modify-result" v-if="mode === 'RESPONSE'">
        <span>{{ resMessage }}</span>
      </div>
      <div class="op-panel">
        <button class="modify-button" @click="comfirm">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import textFile from '../components/text-file'
import dialogHead from '../components/dialog-head'
export default {
  data () {
    return {
      mode: 'REQUEST',
      headMsg: {
        title: '修改密码',
        closer: true
      },
      textObj: {
        'oldpwd': {
          type: 'text',
          // icon: '#icon-account',
          holder: '请输入您当前的密码',
          id: 'oldpwd'
        },
        'newpwd': {
          type: 'password',
          holder: '请输入新密码',
          id: 'newpwd'
        },
        'newpwd2': {
          type: 'password',
          holder: '请重复输入新密码',
          id: 'newpwd2'
        }
      },
      hint: null,
      code: null,
      resMessage: null
    }
  },
  components: {
    textFile,
    dialogHead
  },
  computed: {
    ...mapState({
      isShow: state => state.stateStore.showPwd
      // resMessage: state => state.user.changePwd.msg
      // hint: state => state.stateStore.pwdHint
    })
  },
  watch: {
    '$store.state.user.changePwd.code': {
      handler: function (code) {
        this.mode = 'RESPONSE'
        if (code === 0) {
          this.resCode = code
          this.resMessage = code === 0 ? '您的密码已修改，将在下次登录时启用，请牢记。' : this.$store.state.user.changePwd.msg
        }
      },
      deep: true
    }
  },
  methods: {
    close () {
      this.$store.commit('stateStore/changePwd')
    },
    comfirm () {
      if (this.mode === 'REQUEST') {
        this.modifyPWD()
      } else {
        if (this.resCode === 0) {
          this.$store.commit('stateStore/changePwd')
        } else {
          this.goback()
        }
      }
    },
    modifyPWD () {
      this.hint = null
      if (!this.checkIsMatch()) {
        return
      }
      let oldpwd = this.$el.querySelector('#oldpwd').querySelector('input').value.trim()
      let newpwd = this.$el.querySelector('#newpwd').querySelector('input').value.trim()
      let username = this.$store.state.user.username
      if (username !== '' && newpwd !== '') {
        this.$store.dispatch('user/users', {
          cmd: 'MODIFY_PWD',
          data: {
            username: username,
            oldpwd: oldpwd,
            newpwd: newpwd
          }
        })
      }
    },
    checkIsMatch () {
      let ret = false
      if (this.$el.querySelector('#newpwd').querySelector('input').value && this.$el.querySelector('#newpwd2').querySelector('input').value) {
        let newpwd = this.$el.querySelector('#newpwd').querySelector('input').value.trim()
        let newpwd2 = this.$el.querySelector('#newpwd2').querySelector('input').value.trim()
        ret = newpwd2 === newpwd
        if (!ret) {
          this.hint = '您两次输入的密码不匹配，请重新输入。'
        }
      } else {
        this.hint = '请先输入您的新旧密码，再点 “确定”。'
      }
      return ret
    },
    goback () {
      this.mode = 'REQUEST'
      this.hint = null
    }
  },
  mounted () {
    this.mode = 'REQUEST'
    this.resMessage = null
  }
}
</script>
<style lang="sass">
@import '../style/defs.sass'
.modify-body
  @include flex-column-align-center
  padding: 1rem
  font-size: $fontsize-m
  div
    margin: .3rem 0
    .icon
      position: absolute
      right: 0
.op-panel
  @include flex-row-center
  button
    width: 12rem
    margin-bottom: 1rem
</style>
