import { createStore, createLogger } from 'vuex'
export default createStore({
  state() {
    return {
      menuEnabled: true,
      modalStructure: false,
      stageLoaded: false,
      initialOrientation: null
    }
  },
  mutations: {
    MENU_STATUS(state, status) {
      state.menuEnabled = status
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
    stageIsLoaded(context, status) {
      context.commit('STAGE_LOADED', status)
    },
    initOrientation(context, orientation) {
      context.commit('INIT_ORIENTATION', orientation)
    }
  },
  modules: {
  },
  plugins: [ /*createLogger()*/ ]
})
