<template>
  <div class="main container">
    <h1>{{ header }}</h1> 
    <Panel class="p-shadow-2 p-mb-3" id="header-welcome">
      <template #header>
          <i class="fas fa-info-circle"></i> <div class="p-panel-title">{{ welcomePanel.header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-lg-2 p-md-4 p-sm-12" id="about-logo">
          <p><img alt="Vue logo" class="p-mt-2" src="@/assets/img/logo.png"></p>
        </div>
        <div class="p-lg-10 p-md-8 p-sm-12">
          <div v-html="welcomePanel.description"></div>
        </div>
      </div>
    </Panel>

    <Panel class="p-shadow-2 p-mb-3" id="header-about">
      <template #header>
          <i class="fas fa-tasks"></i> <div class="p-panel-title">{{ projectsPanel.header }}</div>
      </template>
      <div v-html="projectsPanel.description"></div>
        <DataTable 
          :value="projectsList" 
          responsiveLayout="scroll"
          :scrollable="true" 
          scrollHeight="250px"
          class="p-datatable-sm p-datatable-striped">
          <Column field="name" header="Name" ></Column>
          <Column field="time" header="Date">
            <template #body="{ data }">
              {{ data.date }} <span class="projects-time">{{ data.time }}</span>
            </template>
          </Column>
          <Column header="Link">
            <template #body="slotProps">
                <Button :label="projectsPanel.label_btn" icon="fas fa-external-link-alt" class="p-button-sm" @click="openLink(slotProps.data.link)"/>
            </template>
          </Column>
      </DataTable>
    </Panel>

    <Panel class="p-shadow-2 p-mb-3" id="header-about">
      <template #header>
          <i class="fas fa-user-friends"></i> <div class="p-panel-title">{{ aboutPanel.header }}</div>
      </template>
      <div v-html="aboutPanel.description"></div>
    </Panel>

    <Card class="p-shadow-2 p-mb-6" id="card-footer">
        <template #content>
            <div class="p-grid">
                <div class="p-lg-3 p-md-6 p-sm-12">
                    <div class="box"><a href="https://mmb.irbbarcelona.org" target="_blank"><img alt="MMB logo" class="mmb-logo" src="../assets/img/mmb.png"></a></div>
                </div>
                <div class="p-lg-3 p-md-6 p-sm-12">
                    <div class="box"><a href="https://irbbarcelona.org" target="_blank"><img alt="IRB logo" class="irb-logo" src="../assets/img/irb.png"></a></div>
                </div>
            </div>
        </template>
    </Card>

  </div>

  <Footer />
  
  
</template>

<script>
import { ref, onMounted } from 'vue'
import globals from '@/globals'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
  components: {  },
  setup() {

    const { getLastProjects } = useProjectSettings()

    const header = globals.longName

    const welcomePanel = {
      header: "Welcome to " + globals.shortName,
      description: `
        <p>The <strong>${globals.longName} (${globals.shortName})</strong> web application has been built with the aim of <strong>sharing visualizations of 3D biological structures</strong> through the web. In these visualizations, users will be able to draw several representations with different selections of the structure(s) previously <strong>uploaded to the application</strong>.</p>
        <p>Our <strong>philosophy for this project</strong> is to make it accessible to everybody, so there is no private area and once a project is shared <strong>everybody with the link can access it</strong> with no restrictions.</p>
      `
    }

    const projectsPanel = {
      header: " Last projects",
      description: `<p>List with the last projects developed by our users:</p>`,
      label_btn: 'Open'
    }

    const truncate = (input) => input.length > 25 ? `${input.substring(0, 25)}...` : input;

    let projectsList = ref([])

    const generateProjectsList = (projects) => {

      const pl = []

      for(const p of projects) {
        pl.push({
          name: truncate(p.projectSettings.title),
          date: new Date(p.projectSettings.uploadDate.date).toLocaleDateString("en-GB"),
          time: new Date(p.projectSettings.uploadDate.date).toLocaleTimeString("en-GB"),
          link: p._id
        })
      }

      return pl

    }

    onMounted(() => {
      getLastProjects()
        .then((r) => {
              if(r.code != 404) {
                projectsList.value = generateProjectsList(r.projects)
              } else console.error(r.message)
        })
    })

    const openLink = (id) => {
      window.open(window.location.origin + process.env.BASE_URL + 'shared/' + id, '_blank')
    }

    const aboutPanel = {
      header: " About us",
      description: `<p>` + globals.longName + ` has been developed by the <a href="https://mmb.irbbarcelona.org" target="_blank">Molecular Modeling and Bioinformatics</a> laboratory at the <a href="https://irbbarcelona.org" target="_blank">IRB Barcelona</a>.</p>
                    <p>Genís Bayarri <a href="https://www.irbbarcelona.org/en/profile/genis-bayarri" target="_blank"><i class="fas fa-envelope"></i></a> , Adam Hospital and Modesto Orozco.</p>`
    }

    return { header, welcomePanel, projectsPanel, projectsList, openLink, aboutPanel }
  }
}
</script>

<style>

  #about-logo p { text-align: center;}
  #about-logo p img { width: 80%; }
  .projects-time { color:#717171; font-size: 13px;}

</style>
