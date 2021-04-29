<template>
  <Button icon="fas fa-code" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    props: ['isDraft'],
    setup(props) {
    
        const { openModal } = useModals()

        const isDraft = props.isDraft
        
        const ttp = computed(() => isDraft ? 'This is a draft and it can\'t be embedded' : 'Click here to get embed code')

        const handleClick = () => {
            if(!isDraft) {
                openModal('embed')
            }
        }

        return { ttp, handleClick }
    
    }
}
</script>

<style>

</style>