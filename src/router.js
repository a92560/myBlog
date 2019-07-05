import Vue from 'vue'
import Router from 'vue-router'
import Msite from './views/Msite/Msite'
import ArticleDesc from './components/ArticleDesc/ArticleDesc'
import Admin from './views/Admin/Admin'
import AccountList from './components/AccountList/AccountList'
import ArticleList from './components/ArticleList/ArticleList'
import CategoryList from './components/CategoryList/CategoryList'
import CommentList from './components/CommentList/CommentList'
import CategoryAdd from './components/CategoryAdd/CategoryAdd'
import CategoryEdit from './components/CategoryEdit/CategoryEdit'
import ArticleAdd from './components/ArticleAdd/ArticleAdd'
import ArticleEdit from './components/ArticleEdit/ArticleEdit'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/msite',
      name: 'msite',
      component: Msite,
      children: [
        {
          path: '/msite/articledesc',
          component: ArticleDesc,
          name: 'articledesc'
        },
        {
          path: '/msite/articledesc/:id',
          component: ArticleDesc,
          name: 'detail'
        },
        {
          path: '/msite/*',
          redirect: '/msite/articledesc'
        }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '/admin/account',
          component: AccountList
        },
        {
          path: '/admin/article',
          component: ArticleList
        },
        {
          path: '/admin/article/add',
          component: ArticleAdd
        },
        {
          path: '/admin/article/edit',
          component: ArticleEdit
        },

        {
          path: '/admin/category',
          component: CategoryList
        },
        {
          path: '/admin/category/add',
          component: CategoryAdd
        },
        {
          path: '/admin/category/edit',
          component: CategoryEdit
        },

        {
          path: '/admin/comment',
          component: CommentList
        },
        {
          path: '/admin*',
          redirect: '/admin/account'
        }
      ]
    },
    {
      path: '/*',
      redirect: '/msite/articledesc'
    }
  ]
})
