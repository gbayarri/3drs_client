<template>

    <Tools v-if="stageLoaded" :isDraft="isDraft" />

    <Fork v-if="stageLoaded && hasFork && !disableComponents" :isDraft="isDraft" :project_id="project_id" />

    <Legend v-if="stageLoaded" />

    <Viewport :project_id="project_id" />

    <ModalEmbed v-if="stageLoaded" :project_id="project_id" />

</template>

<script>
import { computed, ref } from 'vue'
import useFlags from '@/modules/common/useFlags'
import Tools from '@/components/representation/Tools'
import Fork from '@/components/representation/Fork'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
import ModalEmbed from '@/components/representation/modals/ModalEmbed'
export default {
    components: { 
        Tools,
        Fork, Legend, 
        Viewport,
        ModalEmbed
    },
    props: ['id', 'hasFork', 'isDraft'],
    setup(props) {

        const { flags, setFlagStatus } = useFlags()

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        const width = ref(window.innerWidth)
        const disableComponents = computed(() => width.value < 768 )
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)
        setFlagStatus('isShared', true)

        const project_id = props.id

        window.addEventListener("resize", () => width.value = window.innerWidth )

        return { stageLoaded, project_id, disableComponents }
    }
}
</script>

<style>

</style>