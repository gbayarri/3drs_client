import { createStore, createLogger } from 'vuex'

export default createStore({
  state() {
    return {
      menuEnabled: true
    }
  },
  mutations: {
    MENU_STATUS(state, status) {
      state.menuEnabled = status
    }
  },
  actions: {
    menuStatus(context, status) {
      context.commit('MENU_STATUS', status)
    }
  },
  modules: {
  },
  plugins: [ createLogger() ]
})
