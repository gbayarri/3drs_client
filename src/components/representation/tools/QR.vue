<template>
  <Button icon="fas fa-qrcode" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import { computed } from 'vue'
import useModals from '@/modules/common/useModals'
export default {
    props: ['isDraft'],
    setup(props) {
        
        const { openModal } = useModals()

        const isDraft = props.isDraft
        const ttp = computed(() => isDraft ? 'This is a draft and a QR code can\'t be generated' : 'Click here to generate QR code')
        
        const handleClick = async () => {
            if(!isDraft) {
                openModal('qrcode')
            }
        }

        return { ttp, handleClick }
        
    }
}
</script>

<style>

</style>