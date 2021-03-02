import { ref } from 'vue'

export default function useAPI() {

  const apiData = ref({})

  const fetchProject = async (id) => {
      
      const response = await fetch(process.env.VUE_APP_API_LOCATION + '/project/' + id)
      apiData.value = await response.json()

  }

  return { apiData, fetchProject }

}