<template>
  <Button icon="fas fa-camera-retro" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick"  />
</template>

<script>
import { computed } from 'vue'
import globals from '@/globals'
import structureStorage from '@/modules/structure/structureStorage'
import useModals from '@/modules/common/useModals'
export default {
  props: ['stage'],
  setup(props) {

    const { projectData } = structureStorage()
    const { openModal, setBlockUI, closeModal } = useModals()

    const dataProject = computed(() => projectData.value)

    const ttp = "Take a picture of the representation"

    const stage = props.stage

    const handleClick = () => {
      setBlockUI('picture')
      openModal('block')
      stage.makeImage( {
          factor: 4,
          antialias: true,
          trim: false,
          transparent: true
      } ).then( function( blob ){
          let link = document.createElement('a');
          link.download = globals.shortName + '.' + dataProject.value._id + '.png';
          let reader = new FileReader();
          reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
          reader.onload = function() {
            closeModal('block')
            link.href = reader.result; // data url
            link.click();
          };
      } );
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>