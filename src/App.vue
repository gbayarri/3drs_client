<template>

    <div v-if="menuEnabled" id="top">
      <div id="nav">
        <div class="p-grid">
          <div class="p-col-fixed" id="main-logo">
            <router-link :to="{ name: 'About'}" ><img alt="Vue logo" src="@/assets/img/minilogo.png"></router-link>
          </div>
          <div class="p-col">
            <TabMenu :model="items" />
          </div>
        </div>
        <div id="logo-mobile" class="p-mb-2 p-mt-2">
          <img alt="Vue logo" src="@/assets/img/logo.png">
        </div> 
      </div>
    </div>
  <router-view/>

</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  components: {  },
  setup() {
    
    const store = useStore()
    
    let menuEnabled = computed(() => store.state.menuEnabled)

    const items = [
        { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/' },
        { label: 'Launch', icon: 'fas fa-rocket', to: '/launch' },
        { label: 'Contact', icon: 'pi pi-fw pi-envelope', class: 'tabmenu-right', to: '/contact' },
    ]
    return { menuEnabled, items }
  }
}
</script>
