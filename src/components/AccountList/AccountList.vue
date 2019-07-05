<template>
  <div class="account-wrapper">
    <el-table
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="isAdmin"
        label="是否为管理员">
        <template slot-scope="scope">
          {{scope.row.isAdmin?`是`:`否`}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期">
        <template slot-scope="scope">
          {{scope.row.createTime|date-format}}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" class="personAvatar">
        </template>
      </el-table-column>
      <el-table-column
        prop="isFreeze"
        label="是否已冻结">
        <template slot-scope="scope">
          {{scope.row.isFreeze?`是`:`否`}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button @click="handleToDelUser(scope.row)" type="danger" size="small">删除</el-button>
          <el-button type="danger" size="small" @click="handleToFreeze(scope.row)">冻结操作</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page-helper style="margin-top: 30px" :total-count="this.totalCount" :page-number="pageNumber" @jumpPage="jumpPage" :page-size-array="pageSizeArray"></page-helper>
    <alert-tip :md-show="mdShow" @closeModal="closeModal">
      <p slot="message">{{alertText}}</p>
<!--      <button slot="btnGroup" @click="handleToCancel" ref="btnGroup" v-if="isOperation">{{btnText[1]}}</button>
      <button slot="btnGroup" @click="handleToConfirm" ref="btnGroup">{{btnText[0]}}</button>-->
      <div slot="btnGroup">
        <button class="btn btn--m" href="javascript:;" @click="closeModal">取消</button>
        <button class="btn btn--m btn--red" href="javascript:;" @click="handleToConfirm">确认</button>
      </div>
    </alert-tip>
  </div>
</template>

<script>
import PageHelper from '../../components/PageHelper/PageHelper'
import { _throttle } from '../../utils/throttle'
import AlertTip from '../../components/AlterTip/AlertTip'
export default {
  methods: {
    handleClick (row) {
      console.log(row)
    },

    fetch () {
      this.axios.get(`/api/admin/getUser?page=${this.currentPage}&limit=${this.currentSize}`).then(res => {
        var status = res.data.status
        if (status === 0) {
          this.userList = res.data.data.userList
          this.totalCount = res.data.data.totalCount
        } else {
          this.showAlert(res.data.msg)
        }
      })
    },

    // 点击按钮组文字控制模态框
    handleToConfirm () {
      // 删除情况处理
      this.isOperation = true
      this.closeModal()
    },
    // 模态框弹出控制
    showAlert (alertText) {
      this.mdShow = true
      this.alertText = alertText
    },

    // 关闭模态框
    closeModal () {
      this.mdShow = false
      this.alertText = ''
    },

    // 冻结操作
    handleToFreeze: _throttle(function (row) {
      this.$confirm('确定要执行操作吗?', '冻结用户操作', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.axios.put(`/api/admin/freeze`, {
            id: row._id,
            isFreeze: !row.isFreeze
          }).then(res => {
            var status = res.data.status
            if (status === 0) {
              this.$message({
                type: 'success',
                message: '冻结操作成功'
              })
              this.fetch()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
        .catch(action => {
          console.log('cancel')
        })
    }, 1000),

    // 删除用户操作
    handleToDelUser (row) {
      this.$confirm('确定要删除吗?', '删除用户', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.axios.delete(`/api/admin/delete/${row._id}`).then(res => {
            var status = res.data.status
            if (status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.fetch()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
        .catch(action => {
          console.log('cancel')
        })
    },

    // 从分页处获取信息
    jumpPage ({ currentPage, currentSize }) {
      this.currentPage = currentPage
      this.currentSize = currentSize
      this.fetch()
    }
  },

  data () {
    return {
      userList: [], // 用户列表数组
      mdShow: false, // 模态框显示
      btnText: ['确定', '取消'], // 按钮文字数组
      alertText: '', // 提示框文字
      totalCount: 0, // 总数量
      pageNumber: 1, // 初始页
      currentPage: 1, // 当前页
      currentSize: 6, // 当前页数量
      pageSizeArray: [6, 8, 10, 20],
      isOperation: false
    }
  },

  mounted () {
    this.fetch()
  },

  components: {
    AlertTip,
    PageHelper
  }
}
</script>
<style scoped>
.personAvatar{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
