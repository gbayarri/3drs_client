import { ref } from 'vue'

const legend = ref({})

export default function useLegend() {

  const updateLegend = function (obj) {
    legend.value = obj
  }

  return { legend, updateLegend }

}