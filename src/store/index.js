import Vue from 'vue'
import Vuex from 'vuex'
import User from './User/User'
import Category from './Category/Category'
import Article from './Article/Article'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    User,
    Category,
    Article
  }
})
