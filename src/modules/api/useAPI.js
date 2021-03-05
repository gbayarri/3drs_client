import { ref } from 'vue'

export default function useAPI() {

  const apiData = ref({})

  // TRY TO MIGRATE TO AXIOS? 
  // TRY TO INTEGRATE UPLOADS? AND MIGRATE TO FETCH??

  // fetch project data
  const fetchProject = async (id) => {
      
      const response = await fetch(process.env.VUE_APP_API_LOCATION + '/project/' + id)
      apiData.value = await response.json()

  }

  const updateProjectData = async (id, data) => {
      
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

  const createRepresentation = async (id, data) => {

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/representation/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  const updateRepresentationData = async (id, representation, data) => {

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/representation/' + id + '/' + representation, {
      method: 'PATCH',
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
    updateProjectData,
    createRepresentation,
    updateRepresentationData
  }

}