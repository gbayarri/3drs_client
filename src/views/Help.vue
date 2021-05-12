<template>
  <div class="main container">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-contact">
      <template #header>
          <i class="fas fa-question-circle"></i> <div class="p-panel-title">{{ helpPanel.header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-col">
          <p>help content</p>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />
</template>

<script>
import globals from '@/globals'
export default {
  components: {  },
  setup() {

    const header = "Help"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Help', to: { name: 'Help'}}
    ]

    const helpPanel = {
      header: globals.shortName + " help",
      longName: globals.longName
    }

    return { header, helpPanel, home, breadcrumbs }
  }
}
</script>

<style>

</style>