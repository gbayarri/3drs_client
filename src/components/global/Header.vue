<template>
    <header v-if="menuEnabled" id="top">
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
    </header>
</template>

<script>
import { computed } from 'vue'
import useFlags from '@/modules/common/useFlags'
export default {
    setup() {
    const { flags } = useFlags()

    const menuEnabled = computed(() => flags.menuEnabled)

    const items = [
        { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/' },
        { label: 'Launch', icon: 'fas fa-rocket', to: '/launch' },
        { label: 'Help', icon: 'pi pi-fw pi-question-circle', to: '/help' },
        { label: 'Gallery', icon: 'pi pi-fw pi-images', to: '/gallery' },
        { label: 'Contact', icon: 'pi pi-fw pi-envelope', class: 'tabmenu-right', to: '/contact' },
    ]
    return { menuEnabled, items }
  }
}
</script>

<style>

</style>