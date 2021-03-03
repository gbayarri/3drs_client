import { ref } from 'vue'

export default function useAPI() {

  const apiData = ref({})

  // fetch project data
  const fetchProject = async (id) => {
      
      const response = await fetch(process.env.VUE_APP_API_LOCATION + '/project/' + id)
      apiData.value = await response.json()

  }

  // update project for first time
  const updateFirst = async (id, data) => {
      
    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/update/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  // update orientation (TODO updateFirst AND updateOrientation IN ONE FUNCTION???)
  const updateOrientation = async (id, orientation) => {
      
    const data = {
      orientation: orientation
    }

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/update/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  // updateStructure (when new file added)

  // updateRepresentation (when new one or modified, send id and all the content of the representation again)

  return { 
    apiData, 
    fetchProject, 
    updateFirst,
    updateOrientation
  }

}