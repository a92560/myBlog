<template>
  <div>
    <el-container>
      <el-header style="height: 150px;font-size: 26px;font-weight: 700;text-align: left;line-height: 75px">
        <router-link to="/msite/articledesc" style="float: right;position: relative;top: 30px;">返回首页</router-link>
        <h1>欢迎进入我的博客管理后台:<span style="margin-left: 20px">{{$store.state.User.username}}</span></h1>
      </el-header>
      <div class="nav-header">
        <el-menu router class="el-menu-demo" mode="horizontal">
          <el-menu-item index="/admin/account">用户管理</el-menu-item>
          <el-menu-item index="/admin/article">
            <template slot="title">文章管理</template>
          </el-menu-item>
          <el-menu-item index="/admin/category">分类管理</el-menu-item>
          <el-menu-item index="/admin/comment">评论管理</el-menu-item>
        </el-menu>
      </div>
      <div class="nav-wrapper">
        <nav-bread v-if="'/admin/account'===$route.path">
          <router-link slot="list" to="/admin/account" tag="a">用户列表</router-link>
          <router-link slot="management" to="" tag="a">用户管理</router-link>
        </nav-bread>
        <nav-bread v-if="'/admin/article'===spliceSubPath($route.path)">
          <router-link slot="list" to="/admin/article" tag="a">文章列表</router-link>
          <router-link slot="management" to="/admin/article/add" tag="a">新增文章</router-link>
        </nav-bread>
        <nav-bread v-if="'/admin/category'===spliceSubPath($route.path)">
          <router-link slot="list" to="/admin/category" tag="a">分类列表</router-link>
          <router-link slot="management" to="/admin/category/add" tag="a">新增分类</router-link>
        </nav-bread>
        <nav-bread v-if="'/admin/comment'===$route.path">
          <router-link slot="list" to="" tag="a">评论列表</router-link>
          <router-link slot="management" to="" tag="a">评论管理</router-link>
        </nav-bread>
      </div>
      <router-view/>
    </el-container>
    <nav-footer/>
  </div>

</template>

<script>
import NavFooter from '../../components/Footer/Footer'
import NavBread from '../../components/NavBread/NavBread'
export default {
  name: 'Admin',
  components: {
    NavFooter,
    NavBread
  },
  created () {
    this.axios.get('/api/users/getUser').then(res => {
      var status = res.data.status
      if (status === 0) {

      } else {
        /* this.$alert('您不是管理员,暂时无法进入该页面', '消息提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push('/msite')
            }
          }); */
      }
    })
  },

  methods: {
    // 处理子路径下的方法
    spliceSubPath (path) {
      let lastPosition = path.lastIndexOf('/')
      // console.log(lastPosition)
      if (lastPosition === 6) {
        return path
      }
      return path.slice(0, lastPosition)
    }
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .nav-header{
    color:#303133
  }

  .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .el-container {
    margin-bottom: 40px;
  }

  a{
    text-decoration: none;
    font-size: 14px;
    color: #606266;
  }
</style>
