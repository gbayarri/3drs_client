<template>
  <Button
    :icon="activated ? 'fas fa-compass fa-spin' : 'fas fa-compass'"
    :class="'p-shadow-2 ' + (activated ? 'nav-mode' : '')"
    v-tooltip.right="ttp"
    @click="handleClick"
  />
</template>

<script>
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import useFlags from '@/modules/common/useFlags'
export default {
  setup() {

    const { setFlagStatus } = useFlags()

    const activated = ref(false)
    const ttp = computed(() => activated.value ? "Disable navigation mode" : "Enable navigation mode");

    const toast = useToast()

    const handleClick = () => {
        activated.value = !activated.value
        if(activated.value) {
          toast.add({ 
              severity:'info', 
              summary: 'Navigation mode', 
              detail:`Navigation mode has been enabled! From now on, some actions on the stage, 
              such as select residues and get measurements, are disabled. 
              To disable it, please click again the Navigation Mode button.`, 
              life: 15000
          })
          document.querySelector("#stage").style.cursor = 'grabbing'
          setFlagStatus('navigationMode', true)
        } else {
          document.querySelector("#stage").style.cursor = 'default'
          setFlagStatus('navigationMode', false)
        }
    };

    return { ttp, handleClick, activated };
  },
};
</script>

<style>
  #tools .p-button.p-button-icon-only.nav-mode { color:#6f96a9; background:#fff; }
</style>