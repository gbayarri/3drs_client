<template>
  <div id="legend" :class="{ 'open-settings': sidebarEnabled }" v-if="legendEnabled">
      <span>{{ legendContent.name }}</span>  | Model <span>{{ legendContent.model + 1 }}</span> | Chain <span>{{ legendContent.chainname }}</span> | <span v-html="legendContent.resname"></span> <span>{{ legendContent.resno }}</span>  {{ legendContent.atomname }}
  </div>
</template>

<script>
import useFlags from '@/modules/common/useFlags'
import useLegend from '@/modules/viewport/useLegend'
//import structureSettings from '@/modules/structure/structureSettings'
//import useRepresentations from '@/modules/representations/useRepresentations'
import { computed } from 'vue'
export default {
    setup() {
        const { flags } = useFlags()
        const { legend } = useLegend()
        //const { getCurrentModel } = structureSettings()
        //const { currentRepresentation } = useRepresentations()

        //const currReprVal = computed(() => currentRepresentation.value)
        const sidebarEnabled = computed(() => flags.sidebarEnabled)
        const legendEnabled = computed(() => flags.legendEnabled)
        const legendContent = computed(() => legend.value )
        //const currModel = computed(() => getCurrentModel(currReprVal.value) + 1)
        
        return { sidebarEnabled, legendEnabled, legendContent, /*currModel*/ }
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
#legend.open-settings { 
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
#legend span.lowercase-legend { text-transform: lowercase!important;}
@media (max-width: 768px) {
    #legend { 
        position: absolute;
        bottom: 4rem;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
    }
}
@media (max-width: 600px) {
    #legend { 
        position: absolute;
        bottom: 2rem;
        left: 50%;
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        transform: translateX(-50%) translateY(-50%);
        text-align: center;
    }
}
</style>

