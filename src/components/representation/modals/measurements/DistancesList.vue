<template>
    <p v-if="distancesList.length > 0" class="margin-bottom-30">The list below shows all the distances found in the current structure:</p>
    <p v-else class="margin-bottom-30">There are no distances in the current structure</p>

    <div v-if="distancesList.length > 0" class="measurements-list">
        <div class="p-grid margin-bottom-10 bold">
            <div class="p-col-6"> Atom pair </div>
            <div class="p-col-2"> Distance </div>
            <div class="p-col-2"> Label size </div>
            <div class="p-col-1"> Color </div>
            <div class="p-col-1">  </div>
        </div>
        <div v-for="(item, index) in distancesList" :key="item.id" :class="'p-grid ' + ((index % 2 === 0) ? 'even-line' : 'odd-line')">
            <div class="p-col-6" style="padding-top:1rem">
                {{ item.sele[0] }} <i class="fas fa-long-arrow-alt-right"></i> {{ item.sele[1] }}
            </div>
            <div class="p-col-2" style="padding-top:1rem">
                {{ item.dist }} Å
            </div>
            <div class="p-col-2">
                <InputNumber v-model="sizes[item.id]" showButtons :step="1" :min="1" :max="10" inputStyle="width:100%" />
            </div>
            <div class="p-col-1" style="padding-top:.8rem">
                <ColorPicker v-model="colors[item.id]" class="custom-panel" />
            </div>
            <div class="p-col-1" style="padding-top:1rem">
                <Button 
                    icon="far fa-trash-alt" 
                    class="p-button-rounded p-button-outlined repr-button" 
                    @click="removeMeasurement(item.id)"/>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import useMeasurements from '@/modules/structure/useMeasurements'
export default {

    setup() {
        const { currentStructure } = structureSettings()
        const { getMeasurements } = useMeasurements()

        const currStr = computed(() => currentStructure.value)
        const distances = getMeasurements('distances')
        const distancesList = computed(() => distances.filter(item => item.id === currStr.value)[0].atomPairs)
        //console.log(distancesList)

        /* MODAL */

        const page = reactive({
            //ttphr: 'Remove this distance'
        })

        /* LABEL SIZE */

        const changeSize = (size) => {
            console.log(size)
            //distances.filter(item => item.id === pickingProxy.atom.structure.name)[0].atomPairs.push(ap)
        }

        const sizes = computed({
            get: () => {
                const s = []
                for(const d of distancesList.value) {
                    s[d.id] = d.size
                }
                return s
            },
            set: val => changeSize(val)
        })

        //console.log(sizes.value)

        /* COLOR */
        const colors = computed({
            get: () => {
                const c = []
                for(const d of distancesList.value) {
                    c[d.id] = d.color
                }
                return c
            },
            set: val => console.log(val)
        })

        //console.log(colors.value)

        /* REMOVE */

        const removeMeasurement = (id) => {
            console.log(id)
        }

        return { 
            ...toRefs(page), distancesList, 
            sizes,
            colors,
            removeMeasurement 
        }
    }

}
</script>

<style>
    .custom-panel .p-colorpicker-overlay-panel { 
        transform-origin: right bottom!important; 
        top: auto!important; 
        left:auto!important; 
        bottom: 32px!important; 
        right: 0px!important; 
    }
</style>