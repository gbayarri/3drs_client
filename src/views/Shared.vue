<template>

    <Tools v-if="stageLoaded" />

    <Fork v-if="stageLoaded && hasFork" :isDraft="isDraft" />

    <Legend v-if="stageLoaded" />

    <Viewport :project_id="project_id" />

</template>

<script>
import { computed, ref } from 'vue'
import useFlags from '@/modules/common/useFlags'
import Tools from '@/components/representation/Tools'
import Fork from '@/components/representation/Fork'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    components: { 
        Tools,
        Fork, Legend, 
        Viewport
    },
    props: ['id', 'hasFork', 'isDraft'],
    setup(props) {

        const { flags, setFlagStatus } = useFlags()
        const { getProjectSettings, updateProjectSettings, updateProjectSettingsTimeout } = useProjectSettings()

        const settings = computed(() => getProjectSettings())
        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)

        /*let hasFork = ref(null)
        console.log(settings.value)
        if(!settings.value.forkable) hasFork.value = false
        else hasFork.value = props.hasFork*/
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)
        setFlagStatus('isShared', true)

        const project_id = props.id

        return { stageLoaded, /*hasFork,*/ project_id }
    }
}
</script>

<style>

</style>