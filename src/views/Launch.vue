<template>
  <div class="main">
    <!--<img alt="Vue logo" class="main-logo" src="../assets/img/logo.png">-->
    <Panel :header="welcomePanel.header" class="p-shadow-2 p-mb-3" id="header-launch">
      <div v-html="welcomePanel.description"></div>

      <TabView>
        <TabPanel header="Launch from PDB">
          <p>Please type the PDB ID you want to use and a list of options will be shown:</p>
          <form class="send-pdb" @submit.prevent="submitPDB">
            <div class="p-fluid p-formgrid p-grid">
              <div class="p-field p-col-12 p-md-6">
                  <label for="pdbid">Insert here the PDB ID</label>
                  <AutoComplete v-model="selectedCountry" :suggestions="filteredCountries" @complete="searchCountry" field="name" />
              </div>
            </div>
            <hr />
            <Button type="submit" label="Submit" icon="pi pi-check" class="p-button"  />
          </form>
        </TabPanel>

        <TabPanel header="Upload your own structure">
          <p>Please click or drag and drop files:</p>
          <FileUpload name="demo[]" url="./upload.php" @upload="onUpload" :multiple="true" accept=".pdb,.ent,.xtc,.dcd" :maxFileSize="1000000">
              <template #empty>
                  <p>Drag and drop files to here to upload.</p>
              </template>
          </FileUpload>
        </TabPanel>
      </TabView>

    </Panel>

    <Footer />
  </div>
</template>

<script>
import { ref, reactive } from "vue";
export default {
  components: { },
  data() {
		return {
      //countries : [ 'Andorra', 'Albania', 'Catalunya', 'Putaspanya' ],
      countries : [ 
        { name: 'Andorra' }, 
        { name: 'Albania' }, 
        { name: 'Catalunya' }, 
        { name: 'Putaspanya' } ],
			selectedCountry: null,
      filteredCountries: null,
      welcomePanel: {
        header: " Launch new 3DRS project",
        description: `<p>Please start uploading one or more structure files from your computer or with a Protein Data Bank ID and the structure will be atomatically uploaded to our server:</p>`
      }
		}
	},
	methods: {
    searchCountry(event) {
      // cridar aquí per cada click?
      // refer perquè retorni un JSON
      // validar form i enviar!!!
      // https://mmb.irbbarcelona.org/webdev/slim/3dRS/public/search/pdb/3e
      //console.log(event)
      //setTimeout(() => {
          if (!event.query.trim().length) {
              this.filteredCountries = [...this.countries];
          }
          else {
              this.filteredCountries = this.countries.filter((country) => {
                  return country.name.toLowerCase().startsWith(event.query.toLowerCase());
              });
          }
          //console.log(this.filteredCountries)
      //}, 250);
    },
    submitPDB() {
      console.log(this.selectedCountry.name)
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
