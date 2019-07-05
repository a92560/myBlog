<template>
  <div class="form-wrapper">
    <el-form :model="category" ref="categoryForm" label-width="100px" class="categoryForm">
      <el-form-item label="分类名称" prop="name" label-width="50">
        <el-input v-model="category.name" style="width: 400px"></el-input>
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
    name: 'CategoryEdit',
    data() {
      return {
        category: {
          name: '',
        },
      }
    },
    methods: {
      cancelSubmit(){
        this.category.name = ''
        this.$router.push('/admin/category')
      },

      confirmSubmit(){
        this.axios.put(`/api/category/edit`,{
          id:this.$route.query.id,
          name : this.category.name,
          createTime: new Date()
        }).then(res =>{
          var status = res.data.status
          if(status === 0){
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$router.push('/admin/category')
          }else{
            this.$alert(res.data.msg,  {
              confirmButtonText: '确定',
              callback: action => {
                this.category.name = ''
              }
            });
          }
        })
      },
    },
    created () {
      this.axios.get(`/api/category/detail/${this.$route.query.id}`).then(res =>{
        var status = res.data.status
        if(status === 0){
          this.category = res.data.data.category
        }else{
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    }

  }
</script>

<style scoped>
.categoryForm{
  margin-top: 60px;
  margin-left: 30px;
}
</style>
