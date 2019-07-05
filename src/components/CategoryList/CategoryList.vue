<template>
    <div class="category-wrapper">
      <el-table
        :data="categoryList"
        border
        style="width: 100%">
        <el-table-column
          prop="_id"
          label="id">
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="clickCount"
          label="点击量">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | date-format}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="editCategory(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small" @click="delCategory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  export default {
    name: 'CategoryList',
    data(){
      return{
        categoryList : [] , //分类列表数组
      }
    },
    mounted () {
      this.fetch()
    },
    methods:{
      fetch(){
        this.axios.get('/api/category/list').then(res =>{
          let status = res.data.status
          if(status === 0){
            this.categoryList = res.data.data.categoryList
          }else{
            this.$message({
              type: 'error',
              msg: res.data.msg
            })
          }
        })
      },

      //删除分类
      delCategory(row){
        this.$confirm('确定要删除吗?', '删除分类操作', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() =>{
          this.axios.delete(`/api/category/delete/${row._id}`).then(res =>{
            let status = res.data.status
            if(status === 0){
              this.fetch()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        }).catch(action => {
          console.log('cancel')
        });

      },

      //编辑分类
      editCategory(row){
        this.$router.push({path:`/admin/category/edit`,query:{id:row._id}})
      }
    }
  }
</script>

<style scoped>

</style>
