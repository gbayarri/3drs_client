<template>
  <div class="main container">
    <h1>{{ header }}</h1> 
    <Panel :header="welcomePanel.header" class="p-shadow-2 p-mb-3" id="header-welcome">
      <div class="p-grid">
        <div class="p-lg-3 p-md-6 p-sm-12" id="about-logo">
          <p><img alt="Vue logo" class="p-mt-2" src="@/assets/img/logo.png"></p>
        </div>
        <div class="p-lg-9 p-md-6 p-sm-12">
          <div v-html="welcomePanel.description"></div>
        </div>
      </div>
    </Panel>

    <Panel :header="aboutPanel.header" class="p-shadow-2 p-mb-3" id="header-about">
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
export default {
  components: {  },
  setup() {

    const header = "3-dimensional structure Representation Sharing"

    const welcomePanel = {
      header: " Welcome to 3DRS",
      description: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores fuga veniam inventore, sapiente labore pariatur deserunt! Beatae, repellendus? Explicabo molestiae rerum minima veniam, aspernatur amet? Molestias veritatis magni, non hic illo sequi aliquam ducimus reprehenderit voluptatibus totam excepturi eum a numquam nulla asperiores officia accusantium earum. Possimus minima voluptatum sint ea quod quae amet voluptatibus, repellendus dolor. Facilis laudantium, iure consequuntur possimus quod dolorum aperiam corrupti labore inventore sunt veniam esse voluptates iusto, maxime, reiciendis porro vero nam quas nulla? Fugiat, quasi, qui eum tempora voluptatem illo aliquid adipisci natus rem autem ad quibusdam libero et assumenda deserunt amet ipsa quam molestias. Similique consectetur possimus fugit vitae perferendis quam sint reiciendis natus aperiam, magnam, veniam neque optio! Harum odio nam, ipsum iste ad consequuntur molestiae nisi eaque sit minima laudantium architecto impedit quidem, repellat ullam at ab eius est saepe nihil error modi aspernatur. Obcaecati id magni veritatis iusto consequatur!</p>`
    }

    const aboutPanel = {
      header: " About us",
      description: `<p>3-dimensional structure Representation Sharing has been developed by the <a href="https://mmb.irbbarcelona.org" target="_blank">Molecular Modeling and Bioinformatics</a> laboratory at the <a href="https://irbbarcelona.org" target="_blank">IRB Barcelona</a>.</p>
                    <p>Genís Bayarri <a href="https://www.irbbarcelona.org/en/profile/genis-bayarri" target="_blank"><i class="fas fa-envelope"></i></a> , Adam Hospital and Modesto Orozco.</p>`
    }

    return { header, welcomePanel, aboutPanel }
  }
}
</script>

<style>

  #about-logo p { text-align: center;}
  #about-logo p img { width: 80%; }
  /* inject font awesome into panel */
  #header-welcome .p-panel-header span.p-panel-title::before {
    font-family: 'Font Awesome 5 Free';
    content: "\f05a";
  }
  #header-about .p-panel-header span.p-panel-title::before {
    font-family: 'Font Awesome 5 Free';
    content: "\f500";
  }

</style>
