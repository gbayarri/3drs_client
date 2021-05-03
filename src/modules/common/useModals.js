import { reactive, ref } from 'vue'

const dialog = reactive({
  trajectory: false,
  structure: false,
  share: false,
  settings: false,
  tips: false,
  block: false,
  hierarchy: false,
  embed: false,
  align: false
})

const tips = ref('')

const blockProperties = [
  {
    status: 'upload_pdb',
    header: 'Uploading data',
    message: 'The requested PDB structures are being loaded to the server, please don\'t close the tab.'
  },
  {
    status: 'upload_files',
    header: 'Uploading data',
    message: 'The structures are being loaded to the server, please don\'t close the tab.'
  },
  {
    status: 'load',
    header: 'Loading structures',
    message: 'The structures are being downloaded from the server, please don\'t close the tab.'
  },
  {
    status: 'update',
    header: 'Updating data',
    message: 'The project data is being loaded, please don\'t close the tab.'
  },
  {
    status: 'traj',
    header: 'Loading trajectory',
    message: 'The new trajectory is being loaded to the server, please don\'t close the tab.'
  },
  {
    status: 'fork',
    header: 'Forking project',
    message: 'The new project is being created, please don\'t close the tab.'
  }
]

const blockUI = reactive({
  header: '',
  message: ''
})

export default function useModals() {

  const openModal = function (label, tps = null) {
    dialog[label] = true
    if(tips) tips.value = tps
  }

  const closeModal = function (label) {
    dialog[label] = false
  }

  const setBlockUI = function(status) {
    const bps = blockProperties.filter(item => item.status === status)[0]
    blockUI.header =  bps.header
    blockUI.message =  bps.message
  }
  

  return { dialog, tips, blockUI, openModal, closeModal, setBlockUI }

}