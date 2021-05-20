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
import globals from '@/globals'
export default {
  components: {  },
  setup() {

    const header = globals.longName

    const welcomePanel = {
      header: "Welcome to " + globals.shortName,
      description: `
        <p>The <strong>${globals.longName} (${globals.shortName})</strong> web application has been built with the aim of <strong>sharing visualizations of 3D biological structures</strong> through the web. In these visualizations, users will be able to draw several representations with different selections of the structure(s) previously <strong>uploaded to the application</strong>.</p>
        <p>Our <strong>philosophy for this project</strong> is to make it accessible to everybody, so there is no private area and once a project is shared <strong>everybody with the link can access it</strong> with no restrictions.</p>
      `
    }

    const aboutPanel = {
      header: " About us",
      description: `<p>` + globals.longName + ` has been developed by the <a href="https://mmb.irbbarcelona.org" target="_blank">Molecular Modeling and Bioinformatics</a> laboratory at the <a href="https://irbbarcelona.org" target="_blank">IRB Barcelona</a>.</p>
                    <p>Genís Bayarri <a href="https://www.irbbarcelona.org/en/profile/genis-bayarri" target="_blank"><i class="fas fa-envelope"></i></a> , Adam Hospital and Modesto Orozco.</p>`
    }

    return { header, welcomePanel, aboutPanel }
  }
}
</script>

<style>

  #about-logo p { text-align: center;}
  #about-logo p img { width: 80%; }

</style>
