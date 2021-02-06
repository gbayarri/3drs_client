<template>
  <div class="main container">
    <h1>Launch Project</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel :header="welcomePanel.header" class="p-shadow-2 p-mb-3" id="header-launch">
      <div v-html="welcomePanel.description"></div>

      <TabView>
        <TabPanel header="Launch from PDB">
          <p>Please type the PDB ID you want to use and a list of options will be shown:</p>
          <form class="send-pdb" @submit.prevent="submitPDB">
            <div class="p-fluid p-formgrid p-grid">
              <div class="p-field p-col-12 p-md-6">
                  <label for="pdbid">Insert here the PDB ID</label>
                  <AutoComplete v-model="selectedCountries"
                    :multiple="true" :suggestions="filteredCountries" 
                    @complete="searchCountry" @item-select="selectItem" @item-unselect="unselectItem" 
                   />
              </div>
            </div>
            <hr />
            <Button type="submit" label="Submit" icon="pi pi-check" class="p-button" :disabled="formDisabled" />
          </form>
        </TabPanel>

        <TabPanel header="Upload your own structure">
          <p>Please click or drag and drop files:</p>
          <FileUpload name="demo[]" url="./upload.php" @upload="onUpload" :multiple="true" accept=".pdb,.ent,.xtc,.dcd" :maxFileSize="1000000">
              <template #empty>
                  <p>Click <strong>Choose button</strong> above or drag and drop files to here to upload.</p>
              </template>
          </FileUpload>
        </TabPanel>
      </TabView>

    </Panel>
  </div>
  <Footer />
</template>

<script>
//import { ref, reactive } from "vue";
export default {
  components: { },
  data() {
		return {

      // make a composable???
      // restyle!!
      home : { icon: 'pi pi-home', to: { name: 'About'} },
      breadcrumbs : [
          { label: 'Launch', to: { name: 'Launch'}}
      ],

      countries : [ 'Andorra', 'Albania', 'Catalunya', 'Putaspanya' ],
      /*countries : [ 
        { name: 'Andorra' }, 
        { name: 'Albania' }, 
        { name: 'Catalunya' }, 
        { name: 'Putaspanya' } ],*/
      selectedCountry: null,
      selectedCountries: [],
      filteredCountries: null,
      formDisabled: true,
      welcomePanel: {
        header: " Launch new 3DRS project",
        description: `<p>Please start uploading one or more structure files from your computer or with a Protein Data Bank ID and the structure will be atomatically uploaded to our server:</p>`
      }
		}
  },
	methods: {
    selectItem() {
      if(this.selectedCountries.length) this.formDisabled = false
    },
    unselectItem() {
      if(!this.selectedCountries.length) this.formDisabled = true
    },
    searchCountry(event) {
      console.log(event)
      // cridar aquí per cada click?
      // refer perquè retorni un JSON
      // https://mmb.irbbarcelona.org/webdev/slim/3dRS/public/search/pdb/3e
      //console.log(event)
      //setTimeout(() => {
          if (!event.query.trim().length) {
              this.filteredCountries = [...this.countries];
          }
          else {
              this.filteredCountries = this.countries.filter((country) => {
                  return country.toLowerCase().startsWith(event.query.toLowerCase());
              });
          }
          //console.log(this.filteredCountries)
      //}, 250);
    },
    submitPDB() {
      //console.log(this.selectedCountry.name)
      console.log(this.selectedCountries)
    },
    onUpload() {
      // muntar la api o una api mock per tractar tot aquest tema
      console.log('uploaded!!!!')
    }
  }
  /*setup() {
    const welcomePanel = {
      header: " Launch new 3DRS project",
      description: `<p>Please start uploading one or more structure files from your computer or with a Protein Data Bank ID and the structure will be atomatically uploaded to our server:</p>`
    }

    //const countries = [ 'Andorra', 'Albania', 'Catalunya', 'Putaspanya' ]
    let countries = [ 
        { name: 'Andorra' }, 
        { name: 'Albania' }, 
        { name: 'Catalunya' }, 
        { name: 'Putaspanya' } 
    ]
    let selectedCountry = ref(null)
    let filteredCountries = ref(null)

    function searchCountry(event) {
      setTimeout(() => {
        if (!event.query.trim().length) {
            filteredCountries = [...countries]
        }
        else {
            filteredCountries = countries.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase())
            })
            //console.log(filteredCountries)
        }
      }, 250);
    }

    return { welcomePanel, selectedCountry, filteredCountries, searchCountry }
  }*/
}
</script>

<style>
/* inject font awesome into panel */
#header-launch .p-panel-header span.p-panel-title::before {
  font-family: 'Font Awesome 5 Free';
  content: "\f135";
}

</style>
