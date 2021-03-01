<template>

  <Header />

  <router-view/>

  <ModalBlock />

</template>

<script>
import ModalBlock from '@/components/representation/modals/ModalBlock'
export default {
  components: { ModalBlock },
  setup() {
    
  }
}
</script>
