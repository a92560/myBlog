<template>
  <div>
    <nav class="nav">
      <div class="menu" ref="menu">
        <a href="javascript:;" v-for="(category,index) in categoryList"
           :key="index" @click="toDetail(category._id,index)" :class="{focus:category._id===$store.state.Category.cateId}">
          {{category.name}}
          <input type="hidden" :value="category._id">
        </a>
      </div>
    </nav>

  </div>
</template>

<script>
export default {
  name: 'ArticleHeader',
  data () {
    return {
      categoryList: [], // 列表数组
      id: '', // 分类ID
      articleList: [] // 文章列表
    }
  },
  methods: {
    fetch () {
      this.axios.get('/api/category/list').then(res => {
        let status = res.data.status
        if (status === 0) {
          this.categoryList = res.data.data.categoryList
          // console.log(this.categoryList[0]._id)
          // let cateId = this.categoryList[0]._id
          this.$store.commit('Category/CATE_INFO', { cateId: this.categoryList[0]._id })
          this.$router.push(`/msite/articledesc/${this.categoryList[0]._id}`)
          // window.localStorage.setItem('cateId',cateId)
          // console.log(cateId)
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    fetchArticle () {
      // 如果还没有categoryId return
      // console.log(1)
      // 获取单分类下的所有文章
      this.axios.get(`/api/article/list/category`, {
        params: {
          user: window.localStorage.getItem('id')
        }
      }).then(res => {
        let status = res.data.status
        if (status === 0) {
          this.articleList = res.data.data.articleList
          this.$store.commit('Article/ARTI_INFO', { articleList: this.articleList })
        } else {
          this.$message({
            type: 'error',
            message: 'res.data.msg'
          })
        }
      })
    },
    toDetail (cateId, index) {
      /* let aList = this.$refs.menu.getElementsByTagName('a')
        Array.prototype.slice.call(aList).forEach((a) =>{
          a.classList.remove('focus')
        }) */
      // console.log(1)
      this.$store.commit('Category/CATE_INFO', { cateId })
      // console.log(cateId)
      this.$router.push(`/msite/articledesc/${cateId}`)
      // 为当前分类增加一个点击量
      /* this.axios.post('/api/category/click', {
        id: cateId
      }).then(res => {
        let status = res.data.status
        if (status === 0) {
          console.log('clicked')
          console.log(cateId)
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      }) */
    }
  },
  mounted () {
    this.fetch()
    this.fetchArticle()
  }
}
</script>

<style scoped>
  main .mailLeft .listBox span{
    margin: 0 6px;
  }
  main .mainLeft.on{
    display: block;
  }
  main .mainLeft{
    display: none;
  }
</style>
