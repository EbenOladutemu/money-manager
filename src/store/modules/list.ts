export default {
  state: () => ({
    list: {}
  }),
  getters: {},
  mutations: {
    SET_LIST(state: any, payload: any) {
      state.list = payload
    }
  },
  actions: {
    async saveList({ commit }: any, payload: any) {
      console.log(payload)
      commit('SET_LIST', payload)
    }
  }
}
