<template>

    <Disabled v-if="disableComponents" />

    <Tools v-if="stageLoaded && !disableComponents" />

    <ZoomWindow v-if="stageLoaded && !disableComponents" />

    <RepresentationSettings v-if="stageLoaded && !disableComponents" />

    <Settings v-if="stageLoaded && !disableComponents" />

    <Share v-if="stageLoaded && !disableComponents" />

    <Legend v-if="stageLoaded && !disableComponents" />

    <Toast v-if="!disableComponents" />

    <Viewport v-if="loadViewport" v-show="!disableComponents" :project_id="project_id" />

    <ModalTrajectory v-if="stageLoaded && !disableComponents" :project_id="project_id" />
    <!--<ModalStructure v-if="stageLoaded" />-->
    <ModalShare v-if="stageLoaded && !disableComponents" :project_id="project_id" />
    <ModalTips v-if="stageLoaded && !disableComponents" />
    <ModalSettings v-if="stageLoaded && !disableComponents" />
    <ModalHierarchy v-if="stageLoaded && !disableComponents" />

</template>

<script>
import { computed, ref, inject } from 'vue'
import useFlags from '@/modules/common/useFlags'
import useAPI from '@/modules/api/useAPI'
import useMessages from '@/modules/common/useMessages'
import useModals from '@/modules/common/useModals'
import Disabled from '@/components/representation/Disabled'
import Tools from '@/components/representation/Tools'
import ZoomWindow from '@/components/representation/settings/addons/ZoomWindow'
import RepresentationSettings from '@/components/representation/RepresentationSettings'
import Settings from '@/components/representation/Settings'
import Share from '@/components/representation/Share'
import Legend from '@/components/representation/Legend'
import Viewport from '@/components/representation/Viewport'
import ModalTrajectory from '@/components/representation/modals/ModalTrajectory'
//import ModalStructure from '@/components/representation/modals/ModalStructure'
import ModalShare from '@/components/representation/modals/ModalShare'
import ModalTips from '@/components/representation/modals/ModalTips'
import ModalSettings from '@/components/representation/modals/ModalSettings'
import ModalHierarchy from '@/components/representation/modals/ModalHierarchy'
export default {
    components: { 
        Disabled,
        Tools, ZoomWindow, 
        RepresentationSettings, Settings, 
        Share, Legend, 
        Viewport, 
        ModalTrajectory, /*ModalStructure,*/ ModalShare, ModalTips, ModalSettings, ModalHierarchy },
    props: ['id'],
    setup(props) {

        const $router = inject('$router')

        const { flags, setFlagStatus } = useFlags()
        const { apiData, fetchProject } = useAPI()
        const { setMessage } = useMessages()
        const { closeModal } = useModals()

        // activate tools, sidebar and so on
        const stageLoaded = computed(() => flags.stageLoaded)
        // check with for showing components or not
        const width = ref(window.innerWidth)
        const disableComponents = computed(() => width.value < 768 )
        const loadViewport = ref(false)
        
        setFlagStatus('menuEnabled', false)
        setFlagStatus('stageLoaded', false)
        setFlagStatus('sidebarEnabled', false)
        setFlagStatus('legendEnabled', false)

        const project_id = props.id

        fetchProject(project_id)
        .then(() => {
          //  project doesn't exist, redirect to launch and show warning
          if(apiData.value.code === 404) {
            const msg = {
                severity: 'warn',
                content: 'You tried to access to an unexisting project, please check your project id or create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            setFlagStatus('menuEnabled', true)
            return false
          }
          // project exists, but is read only (not representation)
          if(apiData.value.projectSettings.status === 'rs') {
              const msg = {
                severity: 'warn',
                content: 'You tried to access to a read-only project, please create a new one',
                show: true
            }
            setMessage('launch', msg)
            closeModal('block')
            $router.push({ name: 'Launch' }) 
            return false
          }

          //console.log(apiData.value)
          loadViewport.value = true
        })

        window.addEventListener("resize", () => width.value = window.innerWidth )

        return { stageLoaded, loadViewport, disableComponents, project_id }
    }
}
</script>

<style>
    .p-toast-top-right { left:calc(2% + 38px);  top:1.5%;}
    .p-toast .p-toast-message.p-toast-message-info { 
        background: #d7e6ec!important; 
        border: solid #5e738b!important; 
        border-width: 0 0 0 6px!important;
        color: #48596d!important;
    }
    .p-toast .p-toast-message.p-toast-message-info .p-toast-message-icon, 
    .p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close { color: #48596d!important; }
    .p-toast .p-toast-message .p-toast-icon-close:focus { box-shadow: none!important;}
    .p-toast .p-toast-message .p-toast-icon-close:hover { background:transparent!important; color:#000!important }
</style>