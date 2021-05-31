<template>
  <div class="main container">
    <h1>{{ header }}</h1>
    <Breadcrumb :home="home" :model="breadcrumbs" class="p-mb-3" />  
    <Panel class="p-shadow-2 p-mb-3" id="header-gallery">
      <template #header>
          <i class="fas fa-images"></i> <div class="p-panel-title">{{ galleryPanel.header }}</div>
      </template>
      <div class="p-grid">
        <div class="p-lg-3 p-md-6 p-sm-12" v-for="(item) in galleryList" :key="item._id">
          <Card style="width: 100%">
            <template #header>
                <img :src="require(`@/assets/img/gallery/${item.img}`)" @click="openExternal(item._id)" >
            </template>
            <!--<template #title>
                <a href="javascript:;" @click="openExternal(item._id)">{{ item.projectSettings.title }}</a>
            </template>-->
            <template #content>
                <a href="javascript:;" @click="openExternal(item._id)">{{ item.projectSettings.title }}</a>
                <!--<div v-html="item.projectSettings.caption"></div>-->
            </template>
            <template #footer>
                <Button icon="fas fa-external-link-alt" class="p-button-sm" v-tooltip.top="galleryPanel.ttpot" @click="openExternal(item._id)" />
                <Button icon="far fa-window-maximize" class="p-button-sm" style="margin-left: .5em" v-tooltip.top="galleryPanel.ttpoe" @click="openEmbed(item._id)" />
            </template>
          </Card>
        </div>
      </div>
    </Panel>
  </div>
  <Footer />

  <ModalEmbedGallery  :project_id="project_id" />
</template>

<script>
import globals from '@/globals'
import { ref, onMounted } from 'vue'
import useProjectSettings from '@/modules/structure/useProjectSettings'
import useModals from '@/modules/common/useModals'
import ModalEmbedGallery from '@/components/representation/modals/ModalEmbedGallery'
export default {
  components: { ModalEmbedGallery },
  setup() {

    const galleryIds = globals.gallery.map(a => a.id)
    const { getMultipleSettings } = useProjectSettings()
    const { openModal } = useModals()

    let galleryList = ref([])
    let project_id = ref([])

    onMounted(() => {
      getMultipleSettings(galleryIds)
        .then((r) => {
              if(r.code != 404) {
                const g = r.gallery.map(v => ({...v, img: globals.gallery.filter(item => item.id == v._id)[0].img}))
                galleryList.value = g
                //console.log(galleryList.value)
              } else console.error(r.message)
        })
    })

    const header = "Gallery"

    const home = { icon: 'pi pi-home', to: { name: 'About'} }
    const breadcrumbs = [
        { label: 'Gallery', to: { name: 'Gallery'}}
    ]

    const galleryPanel = {
      header: globals.shortName + " gallery",
      longName: globals.longName,
      ttpot: 'Open as a shared project in an external tab',
      ttpoe: 'Open as an embed project in a modal window'
    }

    const openExternal = (project) => {
      window.open(process.env.BASE_URL + 'shared/' + project, '_blank')
    }

    const openEmbed = (project) => {
        project_id.value = project
        console.log(project_id.value)
        openModal('embed_gallery')
    }

    return { 
      header, galleryPanel, home, breadcrumbs,
      galleryList, 
      openExternal, openEmbed, project_id
    }
  }
}
</script>

<style>
  #header-gallery .p-card-header img { cursor:pointer; }
  #header-gallery .p-card-content { height:5rem; overflow-y: auto; overflow-x: hidden; padding: 0; word-break: break-word; }
</style>