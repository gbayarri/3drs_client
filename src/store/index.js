import { createStore, createLogger } from 'vuex'

export default createStore({
  state: {
    //return {
      menuEnabled: true,
      modalTrajectory: false
    //}
  },
  mutations: {
    MENU_STATUS(state, status) {
      state.menuEnabled = status
    },
    MODAL_TRAJ(state, status) {
      state.modalTrajectory = status
    }
  },
  actions: {
    menuStatus(context, status) {
      context.commit('MENU_STATUS', status)
    },
    displayModalTrajectory(context, status) {
      context.commit('MODAL_TRAJ', status)
    }
  },
  modules: {
  },
  plugins: [ createLogger() ]
})
