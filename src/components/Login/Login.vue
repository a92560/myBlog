<template>
  <div class="mainRight">
    <div v-show="!$store.state.User.username">
      <div class="rightBox" ref="loginBox" :class="{on:isLogin}">
        <div class="title"><span>登录</span></div>
        <div class="line"><span class="colDark">用户名：</span><input v-model="username" type="text" /><em></em></div>
        <div class="line"><span class="colDark">密码：</span><input v-model="password" type="password" /><em></em></div>
        <div class="line">
          <span class="colDark">验证码：</span>
          <input type="text" name="code" v-model="captcha">
          <img class="get_svg_verification" src="http://localhost:3000/api/users/svg-captcha" @click="handleGetSvg" alt="">
        </div>
        <div class="line"><span class="colDark"></span><button @click="handleToLogin">登 录</button></div>
        <p class="textRight">还没注册？<a href="javascript:;" class="colMint" @click="switchToRegister">马上注册</a></p>
        <p class="colWarning textCenter" style="font-size: 14px;"></p>
      </div>
      <div class="rightBox" ref="registerBox" :class="{on:!isLogin}">
        <div class="title"><span>注册</span></div>
        <div class="line"><span class="colDark">用户名：</span><input v-model="username" type="text" /></div>
        <div class="line"><span class="colDark">密码：</span><input v-model="password" type="password" /></div>
        <div class="line"><span class="colDark">确认密码：</span><input v-model="repassword" type="password" /></div>
        <div class="line" ref="code_line">
          <span class="colDark">手机号：</span>
          <input v-model="phone" type="text">
          <span class="get_verification" :disabled="!rightPhone"
                :class="{right_phone: rightPhone}" @click.prevent="getCode">
          {{computeTime>0 ? `已发送(${computeTime}s)` : '获取验证码'}}
        </span>
        </div>
        <div class="line"><span class="colDark">验证码：</span><input type="text" v-model="code"></div>
        <p class="textLeft">
          温馨提示：未注册的手机号，注册代表已同意
          <a href="javascript:;" style="text-decoration: none">《用户服务协议》</a>
        </p>
        <div class="line"><span class="colDark"></span><button @click="handleToRegister">注 册</button></div>
        <p class="textRight">已有账号？<a href="javascript:;" class="colMint" @click="switchToLogin">马上登录</a></p>
        <p class="colWarning textCenter"></p>
      </div>
    </div>
    <div v-show="$store.state.User.username">
      <div class="rightBox on" id="userInfo">
        <div class="title"><span>用户信息</span></div>
        <p><span class="colDark" style="margin-right: 15px">用户名：</span>{{$store.state.User.username}}</p>
        <p v-if="$store.state.User.isAdmin">
          <span class="colDanger">你好，管理员！</span>
          <router-link tag="a" to="/admin">进入管理</router-link>
        </p>
        <p><span class="colDanger">你好，欢迎光临我的博客！</span></p>
        <div class="img-wrapper">
          <a href="javascript:;" class="file">
            <i class="el-icon-folder" style="margin-right: 5px"></i>更换头像<input type="file" @change="handleToUpload">
          </a>
          <img :src="$store.state.User.avatar" alt="">
        </div>
        <p><span class="colDark"><a href="javascript:;" id="logout" @click="handleToLogout">退出</a></span></p>
      </div>
    </div>
    <div class="rightBox on">
      <div class="title"><span>社区</span></div>
      <p><a href="http://www.miaov.com" target="_blank" class="colDanger">妙味课堂</a></p>
      <p><a href="http://bbs.miaov.com" target="_blank" class="colDanger">妙味茶馆</a></p>
    </div>
    <alert-tip :md-show="mdShow" @closeModal="closeModal">
      <p slot="message">{{alertText}}</p>
      <button slot="btnGroup" @click="handleToCancel" ref="btnGroup" v-if="isLogout">{{btnText[0]}}</button>
      <button slot="btnGroup" @click="handleToConfirm" ref="btnGroup">{{btnText[1]}}</button>
    </alert-tip>
  </div>
</template>

<script>
import { _throttle } from '../../utils/throttle'
import AlertTip from '../../components/AlterTip/AlertTip'
export default {
  name: 'Login',
  data () {
    return {
      isLogin: true, // 是否为登录状态
      computeTime: 0, // 倒计时时间
      username: '', // 用户名
      password: '', // 密码
      repassword: '', // 重复密码
      phone: '', // 手机号
      captcha: '', // 图形验证码
      code: '', // 手机验证码
      mdShow: false, // 是否显示模态框
      alertText: '登录失败', // 模态框文本提示
      btnText: ['取消', '确定'], // 按钮内容提示
      isLogout: false,
      upLoadAvatarUrl: 'http://localhost:3000/api/users/updateAvatar'
    }
  },
  methods: {
    // _debounce是延迟执行
    // _throttle
    handleGetSvg: _throttle(function (event) {
      // 节流
      event.target.src = `http://localhost:3000/api/users/svg-captcha?date=${Date.now()}`
    }, 1000),

    // 处理登录
    handleToLogin () {
      this.tipMessage('')
      if (!this.username) {
        this.showAlert('用户名不能为空')
      } else if (!this.password) {
        this.showAlert('密码不能为空')
      } else if (!this.captcha) {
        this.showAlert('验证码不能为空')
      } else {
        this.axios.post('/api/users/login', {
          username: this.username,
          password: this.password,
          captcha: this.captcha.toLowerCase()
        }).then(res => {
          let status = res.data.status
          if (status === 0) {
            this.tipMessage(res.data.msg)
            setTimeout(() => {
              this.username = ''
              this.password = ''
              this.captcha = ''
              this.tipMessage('')
              let username = res.data.data.username
              let isAdmin = res.data.data.isAdmin
              let avatar = res.data.data.avatar
              let id = res.data.data.id
              window.localStorage.setItem('username', username)
              window.localStorage.setItem('isAdmin', isAdmin)
              window.localStorage.setItem('avatar', avatar)
              window.localStorage.setItem('id', id)
              this.$store.commit('User/USER_INFO', { username, isAdmin, avatar, id })
            }, 1000)
          } else {
            this.tipMessage(res.data.msg)
            let target = this.$refs.loginBox.getElementsByClassName('get_svg_verification')[0]
            target.src = `http://localhost:3000/api/users/svg-captcha?date=${Date.now()}`
          }
        })
      }
    },

    handleToConfirm (e) {
      // 确定退出
      if (this.isLogout) {
        this.axios.get('/api/users/logout').then(res => {
          var status = res.data.status
          if (status === 0) {
            this.$store.commit('User/USER_INFO', {})
            window.localStorage.removeItem('username')
            window.localStorage.removeItem('isAdmin')
            window.localStorage.removeItem('avatar')
            window.localStorage.removeItem('id')
          } else {
            this.tipMessage('服务器错误')
          }
        })
        this.handleToCancel()
      } else {
        this.mdShow = false
        this.alertText = ''
      }
    },

    handleToLogout () {
      this.isLogout = true
      this.showAlert('确定要退出吗')
    },

    // 提示信息
    tipMessage (message) {
      let colWarning = this.$refs.loginBox.getElementsByClassName('colWarning')[0]
      colWarning.innerHTML = message
    },

    // 处理模态框
    closeModal () {
      this.mdShow = false
      this.alertText = ''
    },

    // 处理点击按钮组事件逻辑
    handleToCancel () {
      this.mdShow = false
      this.alertText = ''
    },

    // 点击发送验证码后的倒计时效果
    getCode () {
      let codeSpan = this.$refs.code_line.getElementsByClassName('get_verification')[0]
      let isDisabled = codeSpan.attributes.disabled
      if (this.computeTime || isDisabled) {
        return false
      } else {
        this.axios.get(`/api/users/sendcode`, {
          params: {
            phone: this.phone
          }
        }).then((res) => {
          var status = res.data.status
          if (status === 0) {
            this.computeTime = 30
            this.intervalId = setInterval(() => {
              this.computeTime--
              if (this.computeTime <= 0) {
                this.computeTime = 0
                clearInterval(this.intervalId)
              }
            }, 1000)
          } else {
            this.showAlert(res.data.msg)
          }
        })
      }
    },

    handleToUpload (event) {
      var file = event.target.files[0]
      var param = new FormData()
      // console.log(file)
      param.append('file', file, file.name)
      var config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.axios.post('/api/users/updateAvatar', param, config).then(res => {
        var status = res.data.status
        if (status === 0) {
          this.fetch()
        } else {
          this.showAlert(res.data.msg)
        }
      })
    },

    showAlert (alertText) {
      this.mdShow = true
      this.alertText = alertText
    },

    handleToRegister () {
      if (!this.username) {
        this.showAlert('用户名不能为空')
      } else if (!this.password) {
        this.showAlert('密码不能为空')
      } else if (!this.repassword) {
        this.showAlert('确认密码不能为空')
      } else if (this.password !== this.repassword) {
        this.showAlert('两次输入密码不一致')
      } else if (!this.phone) {
        this.showAlert('手机号不能为空')
      } else if (!this.code) {
        this.showAlert('验证码不能为空')
      } else {
        this.axios.post(`/api/users/register`, {
          username: this.username,
          password: this.password,
          phone: this.phone,
          code: this.code,
          createTime: Date.now()
        }).then(res => {
          var status = res.data.status
          if (status === 0) {
            // 提示文字
            let colWarning = this.$refs.registerBox.getElementsByClassName('colWarning')[0]
            colWarning.innerText = res.data.msg
            // 显示登录框
            setTimeout(() => {
              this.username = ''
              this.password = ''
              this.isLogin = true
            }, 1000)
          } else {
            this.showAlert(res.data.msg)
          }
        })
      }
    },

    fetch () {
      if (window.localStorage.getItem('id') || window.localStorage.getItem('username') || window.localStorage.getItem('avatar') || window.localStorage.getItem('isAdmin')) {

      } else {
        this.axios.get('/api/users/getUser').then(res => {
          var status = res.data.status
          if (status === 0) {
            let username = res.data.data.username
            let isAdmin = res.data.data.isAdmin
            let avatar = res.data.data.avatar + '?' + Math.random()
            let id = res.data.data.id
            // console.log(avatar)
            window.localStorage.setItem('username', username)
            window.localStorage.setItem('isAdmin', isAdmin)
            window.localStorage.setItem('avatar', avatar)
            window.localStorage.setItem('avatar', id)
            this.$store.commit('User/USER_INFO', { username, isAdmin, avatar, id })
          } else {
            // this.tipMessage(res.data.msg)
            console.log('fail')
          }
        })
      }
    },

    // 从登录框切换到注册框
    switchToRegister () {
      this.isLogin = false
      this.username = ''
      this.password = ''
      this.captcha = ''
    },

    // 从注册框切换登录按钮框
    switchToLogin () {
      this.isLogin = true
      this.username = ''
      this.password = ''
      this.repassword = ''
      this.phone = ''
      this.code = ''
    }
  },
  computed: {
    rightPhone () {
      return /^1\d{10}$/.test(this.phone)
    }
  },
  components: {
    AlertTip
  },
  mounted () {
    this.fetch()
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .mainRight .rightBox .img-wrapper .file {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
  }
  .mainRight .rightBox .img-wrapper .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .mainRight .rightBox .img-wrapper .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }

  .chooseFile{
    background: #e67e22;
    height: 34px;
    cursor: pointer;
    border-radius: 3px;
    color: #fff;
    font-size: 12px;
    font-family: '微软雅黑';
    border-color: #e67e22;
  }

  .img-wrapper img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-top: 10px;
    margin-left: 8px;
  }

  .rightBox{
    display: none;
  }
  main .mainRight .registerBox button{

  }

  .rightBox.on{
    display: block;
  }

  main
    .mainRight
      .rightBox
        .line
          .get_svg_verification
            position absolute
            top 50%
            right 0
            transform translateY(-50%)
            border 0
            color #ccc
            font-size 12px
            background transparent
            vertical-align middle
          .get_verification
            position absolute
            top 50%
            right 13px
            transform translateY(-50%)
            border 0
            color #ccc
            font-size 12px
            background transparent
            cursor pointer
            &.right_phone
              color black
</style>
