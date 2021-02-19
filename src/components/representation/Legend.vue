<template>
  <div id="legend" :class="{ 'legend-moved-left': sidebarEnabled }" v-if="legendEnabled">
      <span>{{ legendContent.name }}</span>  | Model <span>1</span> | Chain <span>{{ legendContent.chainname }}</span> | <span>{{ legendContent.resname }} {{ legendContent.resno }}</span>  {{ legendContent.atomname }}
  </div>
</template>

<script>
//import { useStore } from 'vuex'
import useFlags from '@/modules/common/useFlags'
import useLegend from '@/modules/ngl/useLegend'
import { computed } from 'vue'
export default {
    setup() {
        const { flags } = useFlags()
        const { legend } = useLegend()

        const sidebarEnabled = computed(() => flags.sidebarEnabled)
        const legendEnabled = computed(() => flags.legendEnabled)
        const legendContent = computed(() => legend.value )
        
        return { sidebarEnabled, legendEnabled, legendContent }
    }
}
</script>

<style>
#legend {
    position: absolute;
    z-index: 2;
    border-radius: 4px;
    right: 1%;
    bottom: 1.5%;
    background-color: rgb(123 141 160 / 0.95);
    text-align: right;
    color: #fff;
    padding: 10px 15px;
    -moz-transition-duration: 0.4s;
    -webkit-transition-duration: 0.4s;
    -o-transition-duration: 0.4s;
    transition-duration: 0.4s;
    -moz-transition-timing-function: ease;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease;
}
#legend.legend-moved-left { 
    right: 26%;
    -moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: ease-in;
    -webkit-transition-timing-function: ease-in;
    -o-transition-timing-function: ease-in;
    transition-timing-function: ease-in;
}
#legend span { text-transform: uppercase; font-weight: 600;}
</style>