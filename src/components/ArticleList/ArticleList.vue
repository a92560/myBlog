<template>
    <div class="content-wrapper">
      <el-table
        :data="articleList"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="文章标题">
        </el-table-column>
        <el-table-column
          prop="username"
          label="发表者">
          <template slot-scope="scope">
            {{scope.row.user.username}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime|date-format}}
          </template>
        </el-table-column>
        <el-table-column
          prop="views"
          label="阅读量">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="category"
          label="所属分类">
          <template slot-scope="scope">
            {{scope.row.category.name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="comments"
          label="评论数量">
          <template slot-scope="scope">
            {{scope.row.comments.length}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button @click="handleToDelArticle(scope.row)" type="danger" size="small">删除</el-button>
            <el-button type="primary" size="small" @click="handleToEditArticle(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      articleList: [] // 文章列表
    }
  },
  methods: {
    // 删除文章
    handleToDelArticle (row) {

    },
    // 编辑文章
    handleToEditArticle (row) {
      this.$router.push({ path: '/admin/article/edit', query: { id: row._id } })
    },

    // 获取文章数据
    fetch () {
      this.axios.get('/api/article/list').then(res => {
        let status = res.data.status
        if (status === 0) {
          this.articleList = res.data.data.articleList
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

</style>
