import { createStore, createLogger } from 'vuex'
import { ref } from 'vue'
export default createStore({
  state() {
    return {
      menuEnabled: true,
      modalTrajectory: false,
      stageLoaded: false,
      initialOrientation: null
    }
  },
  mutations: {
    MENU_STATUS(state, status) {
      state.menuEnabled = status
    },
    MODAL_TRAJ(state, status) {
      state.modalTrajectory = status
    },
    STAGE_LOADED(state, status) {
      state.stageLoaded = status
    },
    INIT_ORIENTATION(state, orientation) {
      state.initialOrientation = orientation
    }
  },
  actions: {
    menuStatus(context, status) {
      context.commit('MENU_STATUS', status)
    },
    displayModalTrajectory(context, status) {
      context.commit('MODAL_TRAJ', status)
    },
    stageIsLoaded(context, status) {
      context.commit('STAGE_LOADED', status)
    },
    initOrientation(context, orientation) {
      
      context.commit('INIT_ORIENTATION', orientation)
    }
  },
  modules: {
  },
  plugins: [ createLogger() ]
})
