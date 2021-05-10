<template>
    <Dialog v-model:visible="dialog.measurements" 
            :closable="true"
            :closeOnEscape="true" 
            :dismissableMask="true" 
            :modal="true" 
            :baseZIndex="2001"
            :style="{ width: '60vw', opacity:'0.95' }"
            id="dialog-measurements">
        <template #header>
            <i class="fas fa-ruler"></i> <h3>{{ header }}</h3>
        </template>

        <TabView>

            <TabPanel :header="headerDistances">
                <DistancesList :stage ="stage" />
            </TabPanel>

            <TabPanel :header="headerAngles">
                <AnglesList :stage ="stage" />
            </TabPanel>
            
        </TabView>

        <template #footer>
            <Button :label="labelClose" icon="pi pi-times" class="p-button-outlined" @click="closeThisModal" />
        </template>
    </Dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import useModals from '@/modules/common/useModals'
import DistancesList from '@/components/representation/modals/measurements/DistancesList'
import AnglesList from '@/components/representation/modals/measurements/AnglesList'
import useStage from '@/modules/ngl/useStage'
export default {
    components: { DistancesList, AnglesList },
    setup() {

        const { getStage } = useStage()
        const stage = getStage()

        /*
        put here 2 tabs with angles and distances
        message if empty lists
        get only current structure distances!!!!
        show list as:
        atom1 - atom2 - distance - remove - (edit?)

        atom1 - atom2 - atom3 - angle - remove - (edit?)

        Check if possible to edit color / labelSize
        create removeMeasurement in useMeasurements
        for changing labelSize, use in mouse scroll!!!:
            for(const item of stage.getRepresentationsByName("pd2hx6-6094efa0f7aa6040b62b31c3-ang").list) {
                item.setParameters( { labelSize: 20, labelBackgroundColor:0xff0000 } )
            }
        
        */

        const { dialog, closeModal } = useModals()

        /* MODAL */

        const page = reactive({
            header:'Measurements',
            labelClose: 'Close',
            headerDistances: 'Distances',
            headerAngles: 'Angles'
        })

        const closeThisModal = () => {
            closeModal('measurements')
        }

        return { 
            ...toRefs(page), dialog, stage, closeThisModal
        }
    }
}
</script>

<style>
    .measurements-list .even-line { background: #f1f1f1; margin-bottom:.5rem!important; }
    .measurements-list .odd-line { background: #d5dce0; margin-bottom:.5rem!important; }
    .measurements-list .repr-button {
        color:#546974!important;
        height: 1.5rem!important;
        width: 1.5rem!important;
        font-size: 12px;
        background:transparent;
        border-color:#546974!important;
    }
    .measurements-list .repr-button:hover { background: #c75959!important; border-color:#c75959!important; color:#ffffff!important;}
</style>