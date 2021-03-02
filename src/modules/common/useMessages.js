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

  return { messages, setMessage }

}