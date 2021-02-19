import { createStore, createLogger } from 'vuex'
export default createStore({
  state() {
    return {
      menuEnabled: true,
      //modalStructure: false,
      stageLoaded: false,
      sidebarEnabled: false,
      legendEnabled: false, 

      
      legendContent: {},

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
    },
    SIDEBAR_STATUS(state, status) {
      state.sidebarEnabled = status
    },
    LEGEND_STATUS(state, status) {
      state.legendEnabled = status
    },
    LEGEND_UPDATE(state, legend) {
      state.legendContent = legend
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
    },
    sidebarStatus(context, status) {
      context.commit('SIDEBAR_STATUS', status)
    },
    legendStatus(context, status) {
      context.commit('LEGEND_STATUS', status)
    },
    updateLegend(context, legend) {
      context.commit('LEGEND_UPDATE', legend)
    }
  },
  modules: {
  },
  plugins: [ /*createLogger()*/ ]
})
