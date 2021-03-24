<template>
    <Dialog v-model:visible="dialog.tips" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw' }">
        <template #header>
            <i class="far fa-lightbulb"></i> <h3>{{ header }}</h3>
        </template>

        <TipsModels v-if="type === 'models'" @changeModalTitle="modalTitleChange" />
        <TipsChains v-if="type === 'chains'" @changeModalTitle="modalTitleChange" />
        <TipsSequence v-if="type === 'residues'" @changeModalTitle="modalTitleChange" />
        <TipsHeteroatoms v-if="type === 'heteroatoms'" @changeModalTitle="modalTitleChange" />
        <TipsIons v-if="type === 'ions'" @changeModalTitle="modalTitleChange" />
        <TipsWaters v-if="type === 'waters'" @changeModalTitle="modalTitleChange" />
        <TipsCustom v-if="type === 'custom'" @changeModalTitle="modalTitleChange" />

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { computed, ref, reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import TipsModels from '@/components/representation/modals/tips/TipsModels'
import TipsChains from '@/components/representation/modals/tips/TipsChains'
import TipsSequence from '@/components/representation/modals/tips/TipsSequence'
import TipsHeteroatoms from '@/components/representation/modals/tips/TipsHeteroatoms'
import TipsIons from '@/components/representation/modals/tips/TipsIons'
import TipsWaters from '@/components/representation/modals/tips/TipsWaters'
import TipsCustom from '@/components/representation/modals/tips/TipsCustom'
export default {
    components: { TipsModels, TipsChains, TipsSequence, TipsHeteroatoms, TipsIons, TipsWaters, TipsCustom },
    setup() {

        const page = reactive({
            header:'',
            labelClose: 'Close'
        })

        const { dialog, tips, closeModal } = useModals()

        const type = computed(() => tips.value)

        const closeThisModal = () => {
            closeModal('tips')
        }

        const modalTitleChange = (e) => {
            page.header = e
        }

        return { ...toRefs(page), dialog, type, closeThisModal, modalTitleChange }
    }
}
</script>

<style>

</style>