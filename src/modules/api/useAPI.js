import { ref } from 'vue'

export default function useAPI() {

  const apiData = ref({})

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

  const shareProject = async (id) => {
      
    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/share/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resp = await response.json()

    return resp

  }

  const forkProject = async (id) => {
      
    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/fork/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
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

  const cloneRepresentation = async (id, data) => {

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/clone/' + id, {
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

  const eliminateRepresentation = async (id, representation) => {

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/representation/' + id + '/' + representation, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const resp = await response.json()

    return resp

  }

  const updateTrajectoryData = async (id, data) => {

    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/trajectory/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  const fetchSettings = async (data) => {
      
    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  const fetchLastProjects = async (data) => {
      
    const response = await fetch(process.env.VUE_APP_API_LOCATION + '/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await response.json()

    return resp

  }

  return { 
    apiData, 
    fetchProject, 
    updateProjectData,
    shareProject,
    forkProject,
    createRepresentation,
    cloneRepresentation,
    updateRepresentationData,
    eliminateRepresentation,
    updateTrajectoryData,
    fetchSettings,
    fetchLastProjects
  }

}