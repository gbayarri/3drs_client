<template>

    <div id="minisettings">
        
        <Button 
        :icon="isCollapsed ? 'pi pi-angle-double-up' : 'pi pi-angle-double-down'" 
        @click="unfoldRepresentations" 
        id="unfold-button"
        v-tooltip.top="ttpu" />
        
        <!-- representation -->
        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_repr }}</label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col-10" style="padding-right:0">
                <Dropdown 
                v-model="representationSelected" 
                :options="reprList" 
                optionLabel="name" 
                @change="onChangeRepresentation"
                :disabled="reprList.length <= 1"
                />
            </div>
            <div class="p-col-2" style="padding-left:0; text-align: center;">
                <Button 
                :icon="isVisible ? 'far fa-eye' : 'far fa-eye-slash'" 
                class="p-button-rounded repr-button" 
                @click="setVisibility"
                v-tooltip.top="ttphr" />
            </div>
        </div>

        <div v-if="!isCollapsed">

            <!-- new representation -->
            <div class="p-grid">
                <div class="p-col">
                    <label>{{ label_new_repr }}</label>
                </div>
            </div>
            <div class="p-grid">
                <div class="p-col">
                    <div class="p-inputgroup">
                        <InputText v-model="modelNewSel" :placeholder="placeholderNewSel"/>
                        <Button 
                        icon="pi pi-plus" 
                        class="p-button-nr" 
                        @click="newRepresentation"
                        :disabled="nrbDisabled"/>
                    </div>
                </div>
            </div>

            <hr />
            
            <div v-if="representationSelected.id != defaultRepresentation">
            
                <!-- molecular representation -->
                <div class="p-grid">
                    <div class="p-col">
                        <label>{{ label_mol_repr }}</label>
                    </div>
                </div>
                <div class="p-grid">
                    <div class="p-col">
                        <Dropdown 
                        v-model="molRepresentation" 
                        :options="molReprType" 
                        optionLabel="name" 
                        @change="onChangeMolRepresentation"/>
                    </div>
                </div>

                <!-- radius -->
                <div class="p-grid double-col" v-if="hasRadius" >
                    <div class="p-col">
                        <label>{{ label_radius }}</label>
                    </div>
                    <div class="p-col slider-value">
                        <label>{{ radius }}</label>
                    </div>
                </div>
                <div class="p-grid" v-if="hasRadius" >
                    <div class="p-col">
                        <Slider v-model="radius" :min="0" :max="500" :step="5" @change="onChangeRadius" />
                    </div>
                </div>

                <!-- color -->
                <div class="p-grid">
                    <div class="p-col">
                        <label>{{ label_color }}</label>
                    </div>
                </div>
                <div class="p-grid">
                    <div class="p-col">
                        <Dropdown
                        v-model="mainStructureColor" 
                        :options="colorScheme" 
                        optionLabel="name" 
                        @change="onChangeColorScheme"/>
                    </div>
                    <div class="p-col-fixed" v-if="colorUniform" style="width:3rem; ">
                        <ColorPicker v-model="color" style="margin-left:-.5rem;margin-top:2px;" />
                    </div>
                </div>
                
            </div>

            <!-- opacity -->
            <div class="p-grid double-col">
                <div class="p-col">
                    <label>{{ label_opacity }}</label>
                </div>
                <div class="p-col slider-value">
                    <label>{{ opacity }}</label>
                </div>
            </div>
            <div class="p-grid margin-bottom-20">
                <div class="p-col">
                    <Slider v-model="opacity" :min="0" :max="100" :step="1" @change="onChangeOpacity" />
                </div>
            </div>

            <div v-if="representationSelected.id != defaultRepresentation">

                <hr />

                <!-- remove / schema -->
                <div class="p-grid ">
                    <div class="p-col">
                        <Button 
                        label="Remove"
                        icon="far fa-trash-alt" 
                        class="settings-button" 
                        v-on:dblclick="removeRepresentation"
                        v-tooltip="ttprr" />
                    </div>
                    <div class="p-col">
                        <Button 
                        label="Structure"
                        icon="fas fa-project-diagram" 
                        class="settings-button" 
                        @click="visualizeStructure"
                        v-tooltip="ttpvs" />
                    </div>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
import { ref, watch, computed, reactive, toRefs } from 'vue'
import globals from '@/globals'
import useStage from '@/modules/ngl/useStage'
import useComponents from '@/modules/ngl/useComponents'
import useRepresentations from '@/modules/representations/useRepresentations'
import structureStorage from '@/modules/structure/structureStorage'
export default {
    setup() {

        const { stage } = useStage()
        const { addRepresentation, delRepresentation } = useComponents()
        const { projectData, updateProject } = structureStorage()
        const { 
            defaultRepresentation, 
            currentRepresentation, 
            getRepresentationNames, 
            getCurrentRepresentationSettings,
            updateRepresentationProperty,
            removeRepresentationFromStructure,
            setCurrentRepresentation,
            setMolecularRepresentation,
            setVisibilityRepresentation,
            setColorSchemeRepresentation,
            setColorRepresentation,
            setOpacityRepresentation,
            createNewRepresentation,
            deleteRepresentation
        } = useRepresentations()

        let isCollapsed = ref(true)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const currReprVal = computed(() => currentRepresentation.value)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-[0-9a-z]*\-[a-z]*)', 'g'))

        const page = reactive({
            ttpu: computed(() => isCollapsed.value ? 'Unfold representation settings' : 'Fold representation settings'),
            label_repr: "Select representation",
            label_new_repr: "Create new representation",
            ttprr: "Remove representation (double click)",
            ttpvs: "View representation structure",
            ttphr: computed(() => isVisible.value ? 'Hide representation' : 'Show representation'),
            placeholderNewSel: "Insert new name",
            label_mol_repr: "Select molecular representation",
            label_radius: "Select radius",
            label_color: "Select color scheme",
            label_opacity: "Select opacity"
        })

        const unfoldRepresentations = (e) => {
            isCollapsed.value = !isCollapsed.value
        }

        // select representation
        const reprList = computed(() => getRepresentationNames())
        const representationSelected = ref(reprList.value.filter(item => item.id === currReprVal.value)[0])
        const watchedRepresentationSelected = computed(() => reprList.value.filter(item => item.id === currReprVal.value)[0])
        const onChangeRepresentation = (e) => {
            //hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
            setCurrentRepresentation(e.value.id, true)
        }

        // set visibility
        const isVisible = computed(() => currReprSettings.value.visible)
        setVisibilityRepresentation(stage, isVisible.value, re.value, false)
        const setVisibility = () => {
            console.log(stage)
            const newVal = !isVisible.value
            updateRepresentationProperty('visible', newVal)
            setVisibilityRepresentation(stage, newVal, re.value, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        // new representation
        let modelNewSel = ref('')
        let nrbDisabled = computed(() => !modelNewSel.value.length)
        const newRepresentation = () => {
            createNewRepresentation(modelNewSel.value)
                .then((r) => {
                    if(r.code != 404) {
                        // insert new representation to projectData
                        let dp = projectData.value
                        dp.representations.push(r.representation)
                        updateProject(dp)
                        setCurrentRepresentation(r.representation.id, true)
                        // DRAW REPRESENTATION!!!!!!
                        addRepresentation(stage, r.representation)
                        console.log(r.message)
                    } else {
                        console.error(r.message)
                    }
                })
            modelNewSel.value = ''
        }

        // molecular representation
        const molReprType =  globals.representation
         // DEFINE AS A COMPUTED GLOBAL CONSTANT
        //let molRepresentation = ref({ name: 'Cartoon', id: 'cartoon' })
        const molRepresentation = ref(molReprType.filter(item => item.id === currReprSettings.value.mol_repr)[0])
        const watchedMolRepresentation = computed(() => molReprType.filter(item => item.id === currReprSettings.value.mol_repr)[0])
        const onChangeMolRepresentation = (e) => {
            // DEFINE AS A COMPUTED GLOBAL CONSTANT
            //hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface' || e.value.id == 'cartoon' || e.value.id == 'ribbon')

            if(currReprVal.value !== defaultRepresentation) {
                //console.log(molRepresentation.value.id)
                updateRepresentationProperty('mol_repr', molRepresentation.value.id)
                setMolecularRepresentation(stage, currReprSettings.value, molRepresentation.value.id, re.value, true)
                    .then((r) => {
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
            }
        }

        // radius
        // DEFINE AS A COMPUTED GLOBAL CONSTANT (line / surface / cartoon / ribbon)
        //let hasRadius = ref(false)
        const hasRadius = computed(() => !(currReprSettings.value.mol_repr == 'line' 
                                            || currReprSettings.value.mol_repr == 'surface' 
                                            || currReprSettings.value.mol_repr == 'cartoon' 
                                            || currReprSettings.value.mol_repr == 'ribbon'))
        // DEFINE AS A COMPUTED
        let radius = ref(100)
        const onChangeRadius = () => {
            setRadiusRepresentation(stage, radius.value, re.value)
        }

        // color
        const colorScheme =  globals.colorScheme
        const colorUniform = ref(currReprSettings.value.color_scheme === 'uniform')
        const watchedColorUniform = computed(() => currReprSettings.value.color_scheme === 'uniform')
        const color = ref(currReprSettings.value.color)
        const watchedColor = computed(() => currReprSettings.value.color)
        const mainStructureColor = ref(colorScheme.filter(item => item.id === currReprSettings.value.color_scheme)[0])
        const watchedMainStructureColor = computed(() => colorScheme.filter(item => item.id === currReprSettings.value.color_scheme)[0])

        // change color schema from dropdown
        const onChangeColorScheme = (e) => {
            if(currReprVal.value !== defaultRepresentation) {
                updateRepresentationProperty('color_scheme', mainStructureColor.value.id)
                setColorSchemeRepresentation(stage, mainStructureColor.value.id, color.value, re.value, true)
                    .then((r) => {
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
            }
        }

        // change uniform color from picker
        const changeColor = () => {
            if(currReprVal.value !== defaultRepresentation) {
                let col = color.value
                if (!col.startsWith('#') && col.length < 7) col = '#' + color.value
                updateRepresentationProperty('color', col)
                //console.log(projectData.value)
                setColorRepresentation(stage, col, re.value, true)
            }
        }

        // opacity
        const watchedOpacity = computed(() => (currReprSettings.value.opacity * 100))
        const opacity = ref(Math.round(currReprSettings.value.opacity * 100))
        setOpacityRepresentation(stage, opacity.value, re.value, false)
        const onChangeOpacity = () => {
            updateRepresentationProperty('opacity', (opacity.value / 100))
            setOpacityRepresentation(stage, opacity.value, re.value, true)
        }

        // watchers
        // custom color watcher
        watch(color, (col, prevColor) => {
            //console.log(col, prevColor)
            if (color.value !== 'undefined' && colorUniform.value) changeColor()
        })
        // generic watcher
        watch([watchedRepresentationSelected, 
            watchedMolRepresentation,
            watchedColorUniform, 
            watchedColor, 
            watchedMainStructureColor,
            watchedOpacity], (newValues, prevValues) => {
            // select representations
            const wrs = newValues[0]
            representationSelected.value = wrs
            // change molecular respresentation
            const wmr = newValues[1]
            molRepresentation.value = wmr
            // colors
            const wclu = newValues[2]
            colorUniform.value = wclu
            const wcl = newValues[3]
            color.value = wcl
            const wmscl = newValues[4]
            mainStructureColor.value = wmscl
            // opacity
            const wop = newValues[5]
            opacity.value = Math.round(wop)
        })

        // REMOVE REPRESENTATION / VISUALIZE REPRESENTATION STRUCTURE
        // *****************************************************
        // *****************************************************
        // *****************************************************
        /* stage.getComponentsByName('first_str').list[0].dispose() */
        // *****************************************************
        // *****************************************************
        // *****************************************************
        //const ttprr = "Remove representation (double click)"
        //const ttpvs = "View representation structure"
        const removeRepresentation = () => {
            //delRepresentation(stage, representationSelected.value.id)
            deleteRepresentation(representationSelected.value.id)
                .then((r) => {
                    if(r.code != 404) {
                        // remove representation from  projectData
                        delRepresentation(stage, representationSelected.value.id)
                        setCurrentRepresentation(r.newCurrentRepresentation, true)
                        removeRepresentationFromStructure(representationSelected.value.id)
                        console.log(r.message)
                    } else {
                        console.error(r.message)
                    }
                })
        }
        const visualizeStructure = () => {
            // open modal with all the content of dataProject.representation[this structure].settings
            console.log("visualize structure")
        }

        return { 
            isCollapsed, isVisible, 
            ...toRefs(page), 
            defaultRepresentation,
            unfoldRepresentations,
            reprList, representationSelected, onChangeRepresentation, 
            setVisibility,
            modelNewSel, nrbDisabled, newRepresentation,
            molReprType, molRepresentation, onChangeMolRepresentation,
            radius, hasRadius, onChangeRadius,
            colorScheme, mainStructureColor, onChangeColorScheme, colorUniform, color,
            opacity, onChangeOpacity,
            removeRepresentation, visualizeStructure,
        }
    }
}
</script>

<style>
    #minisettings { 
        position: absolute; 
        z-index: 2; 
        left: 1%;
        bottom: 0;
        width: 20%;
        padding:0.2rem 0.25rem 0 0.25rem;
        background-color: rgb(123 141 160 / 0.95); 
        border-radius: 5px 5px 0 0;
        -webkit-box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.6);
        -moz-box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.6);
        box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.7);
    }
    #minisettings .double-col { margin: -0.5rem -0.25rem 0 -0.25rem; }
    /* buttons */
    #minisettings .p-button-nr { 
        background: #fff; 
        border-top-color: #fff; 
        border-right-color: #fff; 
        border-bottom-color: #fff; 
        color:#6f96a9;  
        padding: .35rem 0; 
        width: 2.2rem; 
        z-index:2;
    }
    #minisettings .p-button-nr:hover { background: #6f96a9; color:#fff; }
    #minisettings .settings-button { width: 95%; margin: 0 2.5%; background:#fff; color:#6f96a9; text-align: left; font-size:15px; }
    #minisettings .settings-button:hover { background:#546974; color:#fff; }
    /* label */
    #minisettings label { margin:0 2.5%; color:#fff;}
    /* label */
    #minisettings .p-slider.p-slider-horizontal { width: 90%; margin: 0 5%; background: #ccc; }
    #minisettings .p-slider .p-slider-range { background: #fff; }
    #minisettings .p-slider .p-slider-handle { border-color: #b4cce6; }
    #minisettings .p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #fff; }
    #minisettings .slider-value { text-align:right; font-weight: 700;}
    /* input group */
    #minisettings .p-inputgroup { width:95%; margin:0 2.5%; }

    #minisettings #unfold-button {
        z-index:2;
        position: absolute;
        left: 50%;
        top: -2.2rem;
        transform: translateX(-50%);
        cursor: pointer;
        background: rgb(123 141 160 / 0.95); 
        color: #fff;
        padding: .5rem 1rem 0 1rem;
        width: 3rem;
        font-size: 20px;
        border-radius: 5px 5px 0 0;
        border:none;
    }
    #minisettings #unfold-button:focus { 
        -webkit-box-shadow: 0px -1px 2px rgba(32, 8, 8, 0.6)!important;
        -moz-box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6)!important;
        box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6)!important;
    }

    #minisettings .repr-button {
        height: 1.5rem;
        width: 1.5rem;
        font-size: 13px;
        margin: .3rem 0 0 .1rem;
        background:transparent;
        border:none;
    }
    #minisettings .repr-button:hover { background: #546974;}

</style>