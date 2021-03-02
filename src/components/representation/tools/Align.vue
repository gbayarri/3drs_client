<template>
  <Button icon="fas fa-clone" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick"  />
</template>

<script>
export default {
  props: ['stage'],
  // see component/structure-superpose from gallery
  // TO SHOW ONLY IN CASE MORE THAN ONE REPRESENTATION
  setup(props) {
    const ttp = "Align all the structures in the representation"

    //stage.getComponentsByName('kk')

    const stage = props.stage

    const handleClick = () => {
      // TODO: PUT IN A FOR!!!! TEST WITH MORE THAN 2!!!!!
      const c1 = stage.getComponentsByName('1aki').list[0]
      const c2 = stage.getComponentsByName('2rgp').list[0]
      const c3 = stage.getComponentsByName('4i19').list[0]
      //console.log(c1, c2, c3)
      //stage.autoView(500);
      c2.superpose(c1, false)
      //console.log(new_c)
      const new_c = c3.superpose(c2, false)
      new_c.autoView(500)

      //c1.addRepresentation( "spacefill", { sele: "* and not(_H)", radius: 5, aspectRatio: 1.5 });
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>