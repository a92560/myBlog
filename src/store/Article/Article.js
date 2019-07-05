const state = {
  articleList: []
}

const actions = {

}

const mutations = {
  ARTI_INFO (state, payload) {
    state.articleList = payload.articleList
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
