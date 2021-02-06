<template>
  <div class="main container">
    <h1>Contact Us</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel :header="contactPanel.header" class="p-shadow-2 p-mb-3" id="header-contact">
      <div class="p-grid">
        <div class="p-col">
          <div v-html="contactPanel.description"></div>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />
</template>

<script>
export default {
  components: {  },
  setup() {

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Contact', to: { name: 'Contact'}}
    ]

    const contactPanel = {
      header: " 3DRS contact",
      description: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga veniam inventore, sapiente labore pariatur deserunt! </p>`
    }

    return { contactPanel, home, breadcrumbs }
  }
}
</script>

<style>
/* inject font awesome into panel */
#header-contact .p-panel-header span.p-panel-title::before {
  font-family: 'Font Awesome 5 Free';
  content: "\f1d8";
}
</style>