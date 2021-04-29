<template>
    <div v-if="isVisible" id="share-box" @click="openShareModal" v-tooltip.left="ttp" class="p-shadow-2" >
        <img src="@/assets/img/logo_legend_fork.png" />
    </div>
</template>

<script>
import { computed } from 'vue'
import useModals from '@/modules/common/useModals'
import useAPI from '@/modules/api/useAPI'
import useProjectSettings from '@/modules/structure/useProjectSettings'
export default {
    props: ['isDraft', 'project_id'],
    setup(props) {
        
        const { setBlockUI, openModal, closeModal } = useModals()
        const { getProjectSettings } = useProjectSettings()
        const { forkProject } = useAPI()

        const isDraft = props.isDraft
        const project_id = props.project_id

        const ttp = computed(() => isDraft ? 'This is a draft and it can\'t be forked' : 'Click here to fork project!')
        const settings = computed(() => getProjectSettings())

        const isVisible = settings.value.forkable

        const openShareModal = () => {
            if(!isDraft) {
                // open blockUI and when cloning is finished, redirect to forked project
                //console.log('fork!')

                setBlockUI('fork')
                openModal('block')

                forkProject(project_id)
                    .then((r) => {
                        if(r.code != 404) {
                            console.log(r.message)
                            closeModal('block')
                            window.open(process.env.BASE_URL + 'representation/' + r.project, '_blank')
                        }
                        else console.error(r.message)
                })
            }
            
        }

        return { ttp, isVisible,  openShareModal }

    }

}
</script>

<style>
#share-box {
    position: absolute;
    z-index: 2;
    right: 1%;
    top: 1.5%;
    cursor:pointer;
    background:rgba(255, 255, 255, .9);
    padding:.2rem .5rem;
    border-radius:5px;
    -moz-transition-duration: 0.35s;
    -webkit-transition-duration: 0.35s;
    -o-transition-duration: 0.35s;
    transition-duration: 0.35s;
    -moz-transition-timing-function: ease;
    -webkit-transition-timing-function: ease;
    -o-transition-timing-function: ease;
    transition-timing-function: ease;
    user-select: none;
}

</style>