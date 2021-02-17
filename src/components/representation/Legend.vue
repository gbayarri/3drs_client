<template>
  <div id="legend" :class="{ 'legend-moved-left': sidebarEnabled }">
      <!--str.name + ' | model 1 | <strong>' + chain + '</strong> | <strong>' + name + ' ' + num + '</strong>'-->
      file.pdb | model 1 | <strong>A</strong> | <strong>ALA 702</strong>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
    setup() {
        const store = useStore()
        
        let sidebarEnabled = computed(() => store.state.sidebarEnabled)

        return { sidebarEnabled }
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
    /* display: none; */
    /*-moz-transition-duration: 0.4s;
    -webkit-transition-duration: 0.4s;
    -o-transition-duration: 0.4s;
    transition-duration: 0.4s;
    -moz-transition-timing-function: ease;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease;*/
}
#legend.legend-moved-left { 
    right: 26%;
    /*-moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: ease-in;
    -webkit-transition-timing-function: ease-in;
    -o-transition-timing-function: ease-in;
    transition-timing-function: ease-in;*/
}
</style>