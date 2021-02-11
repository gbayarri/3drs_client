<template>
    <div id="tools">
        <Reload :stage="stage" />
        <Rotate :stage="stage" />
        <Center :stage="stage" />
        <Background :stage="stage" />
        <FullScreen :stage="stage" />
        <Picture :stage="stage" />
        <Upload :stage="stage" />
        <Align :stage="stage" />
    </div>
</template>

<script>
/*import { onMounted } from 'vue'*/
import ngl from "@/modules/NGLStage"
import Reload from '@/components/representation/tools/Reload'
import Rotate from '@/components/representation/tools/Rotate'
import Center from '@/components/representation/tools/Center'
import Background from '@/components/representation/tools/Background'
import FullScreen from '@/components/representation/tools/FullScreen'
import Picture from '@/components/representation/tools/Picture'
import Upload from '@/components/representation/tools/Upload'
import Align from '@/components/representation/tools/Align'
export default {
    components: { Reload, Rotate, Center, Background, FullScreen, Picture, Upload, Align },
    setup() {
        let stage = null
        stage = ngl.getStage().stage
        return { stage }
    }
}
</script>

<style>
    #tools { position: absolute; z-index: 2; left: 1%; top: 1%; /*display: none;*/ width:40px; }
    #tools .p-button.p-button-icon-only { width:auto; width:2.2rem; height:2rem; margin-top:.2rem; }

</style>