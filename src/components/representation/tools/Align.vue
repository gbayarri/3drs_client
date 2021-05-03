<template>
  <Button icon="fas fa-clone" class="p-shadow-2" v-tooltip.right="ttp" @click="handleClick"  />
</template>

<script>
//import * as NGL from 'ngl'
import useModals from '@/modules/common/useModals'
export default {
  //props: ['stage'],
  setup(/*props*/) {

    const { openModal } = useModals()

    const ttp = "Superpose structures"

    //stage.getComponentsByName('kk')

    //const stage = props.stage

    const handleClick = () => {
      openModal('align')
    }

    const handleClicks = () => {

      /*const c1 = stage.getComponentsByName("608fb4bef7aa6049cc63c097").list[0]
      const c2 = stage.getComponentsByName("608fb4bef7aa6049cc63c093").list[0]

      const s1 = stage.getComponentsByName("608fb4bef7aa6049cc63c097").list[0].structure
      const s2 = stage.getComponentsByName("608fb4bef7aa6049cc63c093").list[0].structure*/

      /*const c1_pos = c1.getCenter()
      const c2_pos = c2.getCenter()

      console.log(c1.getCenter(), c2.getCenter())

      c1.superpose(c2, true, ':A', ':A')

      console.log(c1.getCenter(), c2.getCenter())

      c1.updateRepresentations({ position: true })
      c2.updateRepresentations({ position: true })*/

      /*const c1_pos = c1.getCenter()
      const c2_pos = c2.getCenter()

      console.log(c1)

      console.log(c1.getCenter(), c2.getCenter())

      NGL.superpose(s1, s2, true, ":B", ":B")
      c1.updateRepresentations({ position: true })
      c1.autoView()

      console.log(c1.getCenter(), c2.getCenter())

      //console.log(c1.center, c2.center)

      //console.log(stage)
      setTimeout(() => {

        //c1.setPosition(c1_pos)
        //c2.setPosition(c2_pos)

        //c1.autoView()
        //c2.autoView()

        //console.log(c1.getCenter(), c2.getCenter())

        //NGL.superpose(s1, s2, true, ":A", ":A")
        //c1.updateRepresentations({ position: true })
        //stage.getComponentsByName("608fb4bef7aa6049cc63c097").list[0].setPosition(c1_pos)
        //stage.getComponentsByName("608fb4bef7aa6049cc63c093").list[0].setPosition(c2_pos)
        //stage.getComponentsByName("608fb4bef7aa6049cc63c097").list[0].updateRepresentations({ position: true })
      }, 2000)*/

      /*setTimeout(() => {
        c1.setPosition(c1_pos)
        c2.setPosition(c2_pos)
        console.log(c1.getCenter(), c2.getCenter())

        c1.updateRepresentations({ position: true })
        c2.updateRepresentations({ position: true })

      }, 2000)*/

      


      /*
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
      */
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>