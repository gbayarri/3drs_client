<template>
  <div class="main container">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-help">
      <template #header>
          <i class="fas fa-question-circle"></i> <div class="p-panel-title">{{ helpPanel.header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-col">

          <h2>The project</h2>

          <p>The <strong>{{ helpPanel.longName }} ({{ helpPanel.shortName }})</strong> web application has been built with the aim of <strong>sharing visualizations of 3D biological structures</strong> through the web. In these visualizations, users will be able to draw several representations with different selections of the structure(s) previously <strong>uploaded to the application</strong>.</p>

          <p>Our <strong>philosophy for this project</strong> is to make it accessible to everybody, so there is no private area and once a project is shared <strong>everybody with the link can access it</strong> with no restrictions.</p>

          <p>For the sake of simplicity and to <strong>improve the user experience</strong> of the users, <strong>this application has no <em>Save</em> button</strong>. Each change performed over the stage or the panels will be <strong>automatically saved</strong> to the database, so anytime a user can close the browser and then come back to keep working on the edition at the same point it was.</p>

          <p><strong>{{ helpPanel.shortName }}</strong> has been built on top of <a href="https://nglviewer.org/" target="_blank">NGL Viewer</a> (a collection of tools for web-based molecular graphics that uses <strong>WebGL</strong> to display molecules like proteins and DNA/RNA with a variety of representations). <a href="http://nglviewer.org/mdsrv/" target="_blank">MDsrv</a> (a Molecular Dynamics streaming web server) has been used as well for <strong>representing the trajectories</strong>.</p>

          <h2>Documentation</h2>

          <p>In order to help users with the <strong>creation of new representations</strong>, our team has written a <strong>broad documentation</strong> available in Read The Docs format:</p>

          <p><Button type="button" :label="helpPanel.labelBtnDocs" icon="pi pi-book" @click="openDocs" /></p>

          <h2>Gallery</h2>

          <p>Please visit <strong>our gallery</strong> to get an idea of what is possible to be built with <strong>{{ helpPanel.shortName }}</strong> web application:</p>

          <p><Button type="button" :label="helpPanel.labelBtnGal" icon="pi pi-fw pi-images" @click="openGallery" /></p>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />
</template>

<script>
import globals from '@/globals'
import { inject } from 'vue'
export default {
  components: {  },
  setup() {

    const $router = inject('$router')

    const header = "Help"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Help', to: { name: 'Help'}}
    ]

    const helpPanel = {
      header: globals.shortName + " help",
      longName: globals.longName,
      shortName: globals.shortName,
      labelBtnDocs: 'Open documentation',
      labelBtnGal: 'Open gallery'
    }

    const openDocs = () => {
      window.open(process.env.VUE_APP_HELP_URL, '_blank')
    }

    const openGallery = () => {
     $router.push({ name: 'Gallery' })
    }

    return { header, helpPanel, home, breadcrumbs, openDocs, openGallery }
  }
}
</script>

<style>

</style>