<template>
  <Button icon="fas fa-arrow-up" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import globals from '@/globals'
export default {
    setup() {
        
        const ttp = 'Visit ' + globals.shortName + ' website'

        const handleClick = () => {
            window.open(window.location.origin + process.env.BASE_URL, '_blank')
        }

        return { ttp, handleClick }
    
    }
}
</script>

<style>

</style>