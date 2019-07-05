<template>
  <div>
    <header>
      <div class="backimg"><img src="../../../public/images/IMG_0293.jpg"/></div>
      <div class="logo"><span></span><img src="../../../public/images/00002637.png"/></div>
    </header>
    <main class="clear">
        <article-header/>
        <router-view :key="$route.fullPath"></router-view>
        <login/>
    </main>
    <nav-footer/>
  </div>
</template>

<script>
import Login from '../../components/Login/Login'
import ArticleHeader from '../../components/ArticleHeader/ArticleHeader'
import NavFooter from '../../components/Footer/Footer'
export default {
  name: 'Msite',
  data () {
    return {
      isLogin: false // 是否已经登录
    }
  },
  components: {
    Login,
    ArticleHeader,
    NavFooter
  },
  watch: {
    /* $route: () => {
      console.log(1)
    } */
  }
}
</script>

<style scoped>

</style>
