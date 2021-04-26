<template>

    <Tools v-if="stageLoaded" />

    <Fork v-if="stageLoaded" :isDraft="true" />

    <Legend v-if="stageLoaded" />

    <Viewport :project_id="project_id" />

</template>

<script>
import { computed } from 'vue'
import useFlags from '@/modules/common/useFlags'
import Tools from '@/components/representation/Tools'
import Fork from '@/components/representation/Fork'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
export default {
    components: { 
        Tools,
        Fork, Legend, 
        Viewport
    },
    props: ['id'],
    setup(props) {

        const { flags, setFlagStatus } = useFlags()

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        
        //setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)
        setFlagStatus('isShared', true)

        const project_id = props.id

        return { stageLoaded, project_id }
    }
}
</script>

<style>

</style>