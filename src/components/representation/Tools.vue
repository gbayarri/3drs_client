<template>
    <div id="tools" >
        <div>
        <Reload :stage="stage" />
        <Rotate v-if="isShared" :stage="stage" />
        <Center :stage="stage" />
        <Background v-if="!isShared" />
        <FullScreen :stage="stage" />
        <Picture v-if="isShared && !disabled" :stage="stage" />
        <Align v-if="!isShared && isAlignable" />
        <Player v-if="isShared" :stage="stage" />
        <Embed v-if="isShared && !disabled" :isDraft="isDraft" />
        <Measurements v-if="!isShared" />
        <NavigationMode v-if="!isShared" />
        <Camera v-if="!isShared" :stage="stage" />
        <QR v-if="isShared && !disabled" :isDraft="isDraft" />
        <Help />
        <Visit v-if="isShared" :isDraft="isDraft" />
        <ProjectSettings v-if="!isShared" />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import useStage from "@/modules/ngl/useStage"
import useFlags from '@/modules/common/useFlags'
import structureSettings from '@/modules/structure/structureSettings'
import Reload from '@/components/representation/tools/Reload'
import Rotate from '@/components/representation/tools/Rotate'
import Center from '@/components/representation/tools/Center'
import Background from '@/components/representation/tools/Background'
import FullScreen from '@/components/representation/tools/FullScreen'
import Picture from '@/components/representation/tools/Picture'
import Help from '@/components/representation/tools/Help'
import QR from '@/components/representation/tools/QR'
import Player from '@/components/representation/tools/Player'
import Embed from '@/components/representation/tools/Embed'
import Measurements from '@/components/representation/tools/Measurements'
import NavigationMode from '@/components/representation/tools/NavigationMode'
import Camera from '@/components/representation/tools/Camera'
import Visit from '@/components/representation/tools/Visit'
import Align from '@/components/representation/tools/Align'
import ProjectSettings from '@/components/representation/tools/ProjectSettings'
export default {
    components: { Reload, Rotate, Center, Background, FullScreen, Picture, Help, QR, Player, Embed, Measurements, NavigationMode, Camera, Visit, Align, ProjectSettings },
    props: ['isDraft'],
    setup() {
        const { getStage } = useStage()
        const { flags } = useFlags()
        const { getNumStructures } = structureSettings()
        
        const isShared = computed(() => flags.isShared)
        const disabled = computed(() => flags.responsive)
        const isAlignable = computed(() => getNumStructures() > 1)
        const stage = getStage()
        return { stage, isShared, isAlignable, disabled }
    }
}
</script>

<style>
    #tools { position: absolute; z-index: 2; left: 1%; top: 1%;  width:40px; }
    #tools .p-button.p-button-icon-only { width:auto; width:2.2rem; height:2rem; margin-top:.2rem; }
    @media (max-width: 600px) {
        #tools { left: 0; bottom: 2%; top:auto; width:100%; }
        #tools div { text-align: center; }
        #tools .p-button.p-button-icon-only { margin-right:.2rem; }
    }
</style>