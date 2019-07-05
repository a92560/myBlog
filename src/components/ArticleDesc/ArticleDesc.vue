<template>
  <div>
    <div class="mainLeft" :class="{on:$store.state.Article.articleList.length}">
      <div class="listBox" v-for="(article,index) in articleListFilter" :key="index">
        <h1>{{article.title}}</h1>
        <p class="colDefault">
          作者：<span class="colInfo">{{article.user.username}}</span>
          -时间：<span class="colInfo">{{article.createTime | date-format}}</span>
          -阅读：<span class="colInfo">{{article.views}}</span>
          -评论：<span class="colInfo" v-if="article.comments">{{article.comments.length}}</span>
        </p>
        <dfn><p>{{isReadAll?'介绍：':''}}{{article.description}}</p></dfn>
        <div v-show="isReadAll">
          <dfn><p style="text-indent: 30px;margin:0 50px">{{article.content}}</p></dfn>
          <div class="listBox message">
            <div class="messageList" v-if="!article.comments.length">
              <div class="messageBox"><p>还没有留言</p></div>
            </div>
            <div class="messageList" v-else>
              <div class="messageBox comment" v-for="(comment,index) in article.comments" :key="index">
                <p class="name clear"><span class="fl">{{comment.username}}</span><span class="fr">{{comment.createTime | date-format}}</span></p>
                <p class="comment-content">{{comment.content}}</p>
              </div>
            </div>
            <h3 class="textLeft"><strong>评论</strong> <span class="em">一共有 <em id="messageCount">{{article.comments.length}}</em> 条评论</span></h3>
            <!--<p class="textLeft">zmouse</p>-->
            <p class="textLeft clear" ref="commentArea">
              <textarea v-model="commentContent"></textarea>
              <input type="hidden" :value="article._id">
              <button @click.prevent="handleToPostComment(article._id)" class="submit">提交</button>
            </p>
          </div>
        </div>
        <div class="function"><a href="javascript:;" @click="toggleReadAll">{{isReadAll?'返回':'阅读全文'}}</a></div>
      </div>
    </div>
    <div class="mainLeft" :class="{on:!$store.state.Article.articleList.length}">
      <div class="listBox">
        <h1></h1>
        <p class="colDefault">
          作者：<span class="colInfo"></span> -
          时间：<span class="colInfo"></span> -
          阅读：<span class="colInfo"></span> -
          评论：<span class="colInfo"></span>
        </p>
        <dfn></dfn>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ArticleDesc',
  data () {
    return {
      // categoryList: [] , //详情分类下的所有文章
      isReadAll: false, // 是否阅读全文
      commentContent: '' // 评论内容
    }
  },
  methods: {
    // 提交评论
    handleToPostComment (id) {
      if (!window.localStorage.getItem('id') || !window.localStorage.getItem('username')) {
        this.$message({
          type: 'error',
          message: '请先登录'
        })
      } else {
        if (!this.commentContent) {
          this.$message({
            type: 'error',
            message: '请输入评论内容'
          })
        }
        this.axios.post('/api/users/comment', {
          articleId: id,
          username: window.localStorage.getItem('username'),
          content: this.commentContent,
          createTime: new Date()
        }).then(res => {
          var status = res.data.status
          if (status === 0) {
            this.commentContent = ''
            this.$message({
              type: 'success',
              message: '评论成功'
            })
            this.fetch()
            this.isReadAll = true
          } else {
            this.$message({
              type: 'error',
              msg: res.data.msg
            })
          }
        })
      }
    },

    // 阅读全文解决方案
    toggleReadAll () {
      this.isReadAll = !this.isReadAll
    }
  },
  mounted () {
    // console.log(this.$store.state.Category.cateId)
  },
  watch: {
  },
  computed: {
    articleListFilter () {
      return this.$store.state.Article.articleList.filter((item) => {
        return item.category === this.$store.state.Category.cateId
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log(2)
    // if(this.$route.query.id === this.$store.state.Category.cateId){
    //   this.fetch(this.$route.query.id)
    // }
    // this.fetch(this.$store.state.Category.cateId)
    next()
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
  main .mainLeft .messageBox .comment-content{
    font-size: 12px;
    text-indent: 20px;
  }
  main .mainLeft .messageBox.comment{
    margin: 30px 0;
    border: 1px solid #e67e22;
    box-shadow: 1px 1px 1px #e67e22;
  }
</style>
