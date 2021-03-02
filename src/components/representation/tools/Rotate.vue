<template>
  <Button icon="fas fa-undo-alt" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick" />
</template>

<script>
export default {
  props: ['stage'],
  setup(props) {
    const ttp = "Toggle spin rotation"
    const stage = props.stage

    const handleClick = () => {
      //console.log(stage)
      stage.toggleSpin();
      //console.log(stage.getComponentsByName('kk'))
      /*stageObj.stage.loadFile("https://mmb.irbbarcelona.org/api/pdb/1aki", { defaultRepresentation: false, ext: 'pdb' })
      .then(function (component) {
              console.log(stage)
                component.addRepresentation( "ribbon", {  color: '#000'} )
      })*/
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>