import { reactive } from 'vue'

const dialog = reactive({
  trajectory: false,
  structure: false,
  share: false,
  block: false
})

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
    status: 'process',
    header: 'Processing structures',
    message: 'The structures are being processed, please don\'t close the tab.'
  }
]

const blockUI = reactive({
  header: '',
  message: ''
})

export default function useModals() {

  const openModal = function (label) {
    dialog[label] = true
  }

  const closeModal = function (label) {
    dialog[label] = false
  }

  const setBlockUI = function(status) {
    const bps = blockProperties.filter(item => item.status === status)[0]
    blockUI.header =  bps.header
    blockUI.message =  bps.message
  }
  

  return { dialog, blockUI, openModal, closeModal, setBlockUI }

}