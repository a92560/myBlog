<template>
  <div class="form-wrapper">
    <el-form :model="article" ref="article" label-width="100px" class="articleForm">
      <el-form-item label="文章名称" prop="title" label-width="50">
        <el-input v-model="article.title" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="文章描述" prop="description" label-width="50">
        <el-input v-model="article.description" style="width: 700px"></el-input>
      </el-form-item>
      <el-form-item label="文章内容" prop="content" label-width="50">
        <el-input v-model="article.content" style="width: 700px;font-size: 16px" type="textarea" rows="4"></el-input>
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
        <el-button type="primary" @click.prevent="confirmSubmit">立即创建</el-button>
        <el-button @click.prevent="cancelSubmit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ArticleAdd',
  data () {
    return {
      article: {
        title: '', // 文章标题
        description: '', // 文章描述
        content: '', // 文章内容
        category: '' // 所属分类
      },
      categoryList: [] // 分类下拉选择框
    }
  },
  methods: {
    cancelSubmit () {
      console.log(this.article.category)
      this.article.title = ''
      this.article.description = ''
      this.article.content = ''
      this.article.category = ''
      this.$router.push('/admin/article')
    },

    confirmSubmit () {
      this.axios.post(`/api/article/add`, {
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
            message: '保存成功'
          })
          this.$router.push('/admin/article')
        } else {
          this.$alert(res.data.msg, {
            confirmButtonText: '确定',
            callback: action => {
              this.article.title = ''
              this.article.description = ''
              this.article.content = ''
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
