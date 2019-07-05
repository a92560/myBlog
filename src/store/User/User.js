const state = {
  username : window.localStorage.getItem('username')|| '',
  isAdmin : window.localStorage.getItem('isAdmin')|| false,
  avatar : window.localStorage.getItem('avatar') || '',
  id : window.localStorage.getItem('id') || ''
}

const actions = {

}

const mutations = {
  USER_INFO(state,payload){
    state.username = payload.username
    state.isAdmin = payload.isAdmin
    state.avatar = payload.avatar
    state.id  = payload.id
  }
}

export default  {
  namespaced : true,
  state,
  actions,
  mutations
}
