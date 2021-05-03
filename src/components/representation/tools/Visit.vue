<template>
  <Button icon="fas fa-arrow-up" class="p-shadow-2" v-tooltip.right="ttp"  @click="handleClick" />
</template>

<script>
import globals from '@/globals'
export default {
    setup() {
        
        const ttp = 'Visit ' + globals.shortName + ' website'

        const handleClick = () => {
            window.open(process.env.VUE_APP_URL, '_blank')
        }

        return { ttp, handleClick }
    
    }
}
</script>

<style>

</style>