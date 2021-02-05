<template>
  <div class="main">
    <Panel :header="contactPanel.header" class="p-shadow-2 p-mb-3" id="header-contact">
      <div class="p-grid">
        <div class="p-col">
          <div v-html="contactPanel.description"></div>
        </div>
      </div>
    </Panel>

    <Footer />

  </div>
</template>

<script>
export default {
  components: {  },
  setup() {
    const contactPanel = {
      header: " 3DRS contact",
      description: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga veniam inventore, sapiente labore pariatur deserunt! </p>`
    }

    return { contactPanel }
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