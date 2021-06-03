<template>
  
</template>

<script>
import { inject } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import useMessages from '@/modules/common/useMessages'
export default {
    props: ['id', 'isShared'],
    setup(props) {

        const $router = inject('$router')

        const { setFlagStatus } = useFlags()
        const { fetchShortURL } = useAPI()
        const { setMessage } = useMessages()

        setFlagStatus('menuEnabled', false)

        fetchShortURL(props.id)
        .then((r) => {
            //  project doesn't exist, redirect to launch and show warning
            if(r.code === 404) {
                const msg = {
                    severity: 'warn',
                    content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                    show: true
                }
                setMessage('launch', msg)
                $router.push({ name: 'Launch' }) 
                setFlagStatus('menuEnabled', true)
                return false
            }

            if(props.isShared) $router.push({ name: 'Shared', params: { id: r.project } }) 
            else $router.push({ name: 'Embed', params: { id: r.project } }) 

        })

    }
}
</script>

