<template>
  <div class="main container">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-launch">
      <template #header>
          <i class="fas fa-rocket"></i> <div class="p-panel-title">{{ launchPanel.header }}</div>
      </template>
      <div v-html="launchPanel.description"></div>

      <TabView>

        <TabPanel :header="tabPanel.pdb.header">
            <TabPanelPDB :texts="tabPanel.pdb" />
        </TabPanel>

        <TabPanel :header="tabPanel.file.header">
            <TabPanelFile :texts="tabPanel.file" />
        </TabPanel>
        
      </TabView>

    </Panel>
  </div>
  <Footer />
</template>

<script>
import TabPanelPDB from '@/components/launch/TabPanelPDB'
import TabPanelFile from '@/components/launch/TabPanelFile'
export default {
  components: { TabPanelPDB, TabPanelFile },
  /*data() {
		return {
      home : { icon: 'pi pi-home', to: { name: 'About'} },
      breadcrumbs : [
          { label: 'Launch', to: { name: 'Launch'}}
      ],
      selectedStructures: [],
      filteredStructures: null,
      formDisabled: true,
      launchPanel: {
        header: " Launch new 3DRS project",
        description: `<p>Please start uploading one or more structure files from your computer or with a Protein Data Bank ID and the structure will be atomatically uploaded to our server:</p>`
      }
		}
  },
	methods: {
    selectItem() {
      if(this.selectedStructures.length) this.formDisabled = false
    },
    unselectItem() {
      if(!this.selectedStructures.length) this.formDisabled = true
    },
    searchStructure(event) {
      fetch(process.env.VUE_APP_API_LOCATION + 'pdb/' + event.query.toLowerCase())
          .then(res => res.json())
          .then(data => this.filteredStructures = data)
          .catch(err => console.log(err.message))
    },
    submitPDB() {
      console.log(this.selectedStructures)
    },
    onUpload() {
      // muntar la api o una api mock per tractar tot aquest tema
      console.log('uploaded!!!!')
    }
  }*/
  setup() {

    const header = "Launch Project"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
          { label: 'Launch', to: { name: 'Launch'}}  
      ]

    const launchPanel = {
      header: " Launch new 3DRS project",
      description: `<p>Please start uploading one or more structure files from your computer or with a Protein Data Bank ID and the structure will be atomatically uploaded to our server:</p>`
    }

    const tabPanel = {
        pdb: {
            header: "Launch from PDB",
            desc: "Please type the PDB ID you want to use and a list of options will be shown:",
            label: "Insert here the PDB ID"
        }, 
        file: {
            header: "Upload your own structure",
            desc: "Please click or drag and drop files:",
            int_desc: "Click <strong>Select button</strong> above or drag and drop files to here to upload."
        }
      }

    return { header, home, breadcrumbs, launchPanel, tabPanel }
  }
}
</script>

<style>


</style>
