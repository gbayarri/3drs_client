<template>
  <Button icon="fas fa-images" v-tooltip.right="ttp" @click="handleClick" />
  <div v-if="cpVisible" id="picker-container">
      <ColorPicker v-model="color" :inline="true" />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
export default {
props: ['stage'],
setup(props) {

    const store = useStore()

    const ttp = ref("Change background color")
    let color = ref('#f1f1f1')

    const cpVisible = ref(false)

    let stage = props.stage

    const handleClick = () => {
        cpVisible.value = !cpVisible.value;

        if(cpVisible.value) ttp.value = "Click to close color picker"
        else ttp.value = "Change background color"

        stage.setParameters( { backgroundColor: '#ff0000' } );
    }

    /*const closePicker = () => {
       console.log('close???')
    }*/

    watch(color, (color, prevColor) => {
        document.getElementById("viewport").style.background = '#' + color
        // ????????????????
        //console.log(stage)
        //stage.setParameters( { backgroundColor: '#' + color } );
        // ????????????????
    })

    return { ttp, color, cpVisible, handleClick/*, closePicker*/ }
}
}
</script>

<style>
    #picker-container { position:absolute; }
    #picker-container .p-colorpicker.p-component { position:absolute;top: -32px; left: 38px;;z-index:20; }
</style>