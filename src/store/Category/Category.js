const state = {
  cateId: ''
}

const actions = {

}

const mutations = {
  CATE_INFO (state, payload) {
    state.cateId = payload.cateId
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
