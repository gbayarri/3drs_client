<template>
  <Button icon="fas fa-image" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
  <div v-if="cpVisible" id="picker-container">
      <ColorPicker v-model="color" :inline="true" />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import structureStorage from '@/modules/structure/structureStorage'
import useAPI from '@/modules/api/useAPI'
import useFlags from '@/modules/common/useFlags'
export default {
//props: ['stage'],
setup(/*props*/) {

    const { projectData } = structureStorage()
    const { updateProjectData } = useAPI()
    const { flags } = useFlags()

    const dataProject = computed(() => projectData.value)
    const isShared = computed(() => flags.isShared)

    const ttp = computed(() => cpVisible.value ? "Click to close color picker" : "Change background color")
    const color = ref(dataProject.value.background)
    const cpVisible = ref(false)

    //const stage = props.stage

    const handleClick = () => {
        cpVisible.value = !cpVisible.value;
    }

    /*const closePicker = () => {
       console.log('close???')
    }*/

    const autoSaveBackground = function(color) {
        updateProjectData(dataProject.value._id, { background: color })
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
    }

    let myTimeOut = null
    watch(color, (color, prevColor) => {
        //document.getElementById("viewport").style.background = '#' + color
        document.querySelector("#viewport").style.backgroundColor = '#' + color
        if(!isShared.value) {
            clearTimeout(myTimeOut)
            myTimeOut = setTimeout(() => {
                autoSaveBackground('#' + color)
                cpVisible.value = false
            }, 5000)
        }
    })

    return { ttp, color, cpVisible, handleClick/*, closePicker*/ }
}
}
</script>

<style>
    #picker-container { position:absolute; }
    #picker-container .p-colorpicker.p-component { position:absolute;top: -32px; left: 38px;;z-index:20; }
</style>