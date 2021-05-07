<template>
  <p v-if="anglesList.length > 0" class="margin-bottom-30">The list below shows all the angles found in the current structure:</p>
  <p v-else class="margin-bottom-30">There are no angles in the current structure.</p>

    <div v-if="anglesList.length > 0" class="measurements-list">
        <div class="p-grid margin-bottom-10 bold">
            <div class="p-col-6"> Atom triple </div>
            <div class="p-col-2"> Angle </div>
            <div class="p-col-2"> Label size </div>
            <div class="p-col-1"> Color </div>
            <div class="p-col-1">  </div>
        </div>
        <div v-for="(item, index) in anglesList" :key="item.id" :class="'p-grid ' + ((index % 2 === 0) ? 'even-line' : 'odd-line')">
            <div class="p-col-6" style="padding-top:1rem">
                {{ item.sele[0] }} <i class="fas fa-long-arrow-alt-left" ></i> {{ item.sele[1] }} <i class="fas fa-long-arrow-alt-right" ></i> {{ item.sele[2] }}
            </div>
            <div class="p-col-2" style="padding-top:1rem">
                {{ item.angle }}°
            </div>
            <div class="p-col-2">
                <InputNumber v-model="sizes[item.id]" :defaultColor="item.color" showButtons :step="1" :min="1" :max="10" inputStyle="width:100%" />
            </div>
            <div class="p-col-1" style="padding-top:.8rem">
                <ColorPicker v-model="colors[item.id]" :defaultColor="item.color" class="custom-panel" />
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
        const angles = getMeasurements('angles')
        const anglesList = computed(() => angles.filter(item => item.id === currStr.value)[0].atomTriples)

        /* MODAL */

        const page = reactive({
            //ttphr: 'Remove this distance'
        })

        /* LABEL SIZE */

        const sizes = computed({
            get: () => {
                const s = []
                for(const d of anglesList.value) {
                    s[d.id] = d.size
                }
                return s
            },
            set: val => console.log(val)
        })

        //console.log(sizes.value)

        /* COLOR */
        const colors = computed({
            get: () => {
                const c = []
                for(const d of anglesList.value) {
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
            ...toRefs(page), anglesList, 
            sizes,
            colors,
            removeMeasurement 
        }
    }

}
</script>

<style>

</style>