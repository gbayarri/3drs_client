import { reactive } from 'vue'

const messages = reactive({
    launch: {
        severity: null,
        content: null,
        show: false
    }
})

export default function useMessages() {

  const setMessage = function (label, content) {
    messages[label] = content
  }

  const resetMessage = function (label) {
    messages[label] = {
      severity: null,
      content: null,
      show: false
    }
  }

  return { messages, setMessage, resetMessage }

}