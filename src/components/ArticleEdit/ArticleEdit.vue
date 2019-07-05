<template>
  <div class="form-wrapper">
    <el-form :model="article" ref="articleForm" label-width="100px" class="articleForm">
      <el-form-item label="文章标题" prop="name" label-width="50">
        <el-input v-model="article.title" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="文章描述" prop="name" label-width="50">
        <el-input v-model="article.description" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="name" label-width="50">
        <el-input v-model="article.content" style="width: 400px" type="textarea" :autosize={minRows:5,maxRows:10}></el-input>
      </el-form-item>
      <el-form-item label="请选择分类" style="margin-left: -31px">
        <el-select v-model="article.category" placeholder="请选择所属分类">
          <el-option
            v-for="(category,index) in categoryList"
            :key="index"
            :label="category.name"
            :value="category._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: -35px">
        <el-button type="primary" @click.prevent="confirmSubmit">保存修改</el-button>
        <el-button @click.prevent="cancelSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ArticleEdit',
  data () {
    return {
      article: {
        title: '',
        description: '',
        content: '',
        category: ''
      },
      categoryList: [] // 列表数组
    }
  },
  methods: {
    cancelSubmit () {
      this.article.title = ''
      this.article.description = ''
      this.article.content = ''
      this.article.category = ''
      this.$router.push('/admin/article')
    },

    confirmSubmit () {
      this.axios.put(`/api/article/edit`, {
        id: this.$route.query.id,
        title: this.article.title,
        description: this.article.description,
        content: this.article.content,
        category: this.article.category,
        user: window.localStorage.getItem('id'),
        createTime: new Date()
      }).then(res => {
        var status = res.data.status
        if (status === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.push('/admin/article')
        } else {
          this.$alert(res.data.msg, {
            confirmButtonText: '确定',
            callback: action => {
              this.article.title = ''
              this.article.description = ''
              this.article.content = ''
              this.article.category = ''
            }
          })
        }
      })
    },

    fetch () {
      // 获取分类列表
      this.axios.get('/api/category/list').then(res => {
        let status = res.data.status
        if (status === 0) {
          this.categoryList = res.data.data.categoryList
          // console.log(this.categoryList)
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    }
  },
  created () {
    this.axios.get(`/api/article/detail/${this.$route.query.id}`).then(res => {
      let status = res.data.status
      if (status === 0) {
        this.article = res.data.data.article
      } else {
        this.$message({
          type: 'error',
          message: res.data.msg
        })
      }
    })
    this.fetch()
  }

}
</script>

<style scoped>
.articleForm{
  margin-top: 60px;
  margin-left: 30px;
}
</style>
