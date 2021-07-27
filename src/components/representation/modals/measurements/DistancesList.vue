<template>
    <p v-if="distancesList.length > 0" class="margin-bottom-30">The list below shows all the distances found in the current structure. You can remove them and modify size and color. 
        If <strong>only</strong> a <strong>distance</strong> is needed (<strong>without label</strong>), please set <strong>0 as Label size</strong>. To create a new one, <strong>
        you must click on two atoms with the mouse right button</strong>.
    </p>
    <p v-else class="margin-bottom-30">There are no distances in the current structure. To create a new one, <strong>
        you must click on two atoms with the mouse right button</strong>.
    </p>

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
                <InputNumber :value="item.size" @input="changeSize(item.id, $event)" showButtons :step="1" :min="0" :max="10" inputStyle="width:100%" />
            </div>
            <div class="p-col-1" style="padding-top:.8rem">
                <ColorPicker v-model="item.color" class="custom-panel" @click="clickPicker(item.id)" />
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
import { computed, reactive, toRefs, watch } from 'vue'
import structureSettings from '@/modules/structure/structureSettings'
import useMeasurements from '@/modules/structure/useMeasurements'
export default {
    props: ['stage'],
    setup(props) {

        const stage = props.stage

        const { currentStructure } = structureSettings()
        const { getMeasurements, updateMeasurementsTimeout } = useMeasurements()

        const currStr = computed(() => currentStructure.value)
        const distances = getMeasurements('distances')
        const distancesList = computed(() => distances.filter(item => item.id === currStr.value)[0].atomPairs)

        /* MODAL */

        const page = reactive({
            //ttphr: 'Remove this distance'
        })

        /* LABEL SIZE */

        const changeSize = (id, e) => {
            // update distances
            distancesList.value.filter(item => item.id === id)[0].size = e.value
            distances.filter(item => item.id === currStr.value)[0].atomPairs = distancesList.value
            // get atom pair (NGL trick)
            const ap = distancesList.value.filter(item => item.id === id)[0].sele
            // update size
            for(const item of stage.getRepresentationsByName(`${id}-${currStr.value}-dist`).list) {
                item.setParameters( { atomPair: [ [ap[0], ap[1]] ], labelSize: e.value } )
            }
            // update DB
            updateMeasurementsTimeout('distances', distances)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        /* COLOR */

        let currentIndex = null

        const colors = computed({
            get: () => {
                const c = []
                for(const d of distancesList.value) {
                    //c[d.id] = d.color
                    c.push({ id: d.id, color: d.color})
                }
                return c
            },
            set: val => console.log(val)
        })

        const changeBackground = (color) => {
            //console.log(currentIndex, `#${color}`)
            const id = currentIndex
            const nc = (!color.startsWith('#') && color.length < 7) ? `#${color}` : color
            // update distances
            distancesList.value.filter(item => item.id === id)[0].color = nc
            distances.filter(item => item.id === currStr.value)[0].atomPairs = distancesList.value
            // get atom pair (NGL trick)
            const ap = distancesList.value.filter(item => item.id === id)[0].sele
            // update size
            for(const item of stage.getRepresentationsByName(`${id}-${currStr.value}-dist`).list) {
                item.setParameters( { atomPair: [ [ap[0], ap[1]] ], labelBackgroundColor: nc, labelBorderColor: nc, color: nc } )
            }
            // update DB
            updateMeasurementsTimeout('distances', distances)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        const clickPicker = (id) => {
            currentIndex = id
        }

        /* REMOVE */

        const removeMeasurement = (id) => {
            const dl = distancesList.value.filter(item => item.id !== id)
            distances.filter(item => item.id === currStr.value)[0].atomPairs = dl
            for(const item of stage.getRepresentationsByName(`${id}-${currStr.value}-dist`).list) {
                item.parent.removeRepresentation(item)
            }

            currentIndex = null
            // update DB
            updateMeasurementsTimeout('distances', distances)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })

        }

        /* WATCHERS */

        watch(colors, (newValues, prevValues) => {
            if( currentIndex !== null ) changeBackground(newValues.filter(item => item.id === currentIndex)[0].color)
        })

        return { 
            ...toRefs(page), distancesList, 
            changeSize,
            colors, clickPicker,
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