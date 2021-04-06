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
            <div class="p-col">
                <Dropdown 
                v-model="representationSelected" 
                :options="reprList" 
                optionLabel="name" 
                :disabled="reprList.length <= 1"
                />
            </div>
        </div>

        <!-- rename representation -->
        <div class="p-grid" v-if="enabledRename">
            <div class="p-col">
                <label>{{ label_ren_repr }}</label>
            </div>
        </div>
        <div class="p-grid" v-if="enabledRename">
            <div class="p-col">
                <div class="p-inputgroup">
                    <InputText v-model="modelRenSel" :placeholder="placeholderRenSel"/>
                    <Button 
                    icon="pi pi-check" 
                    class="p-button-nr" 
                    @click="renameRepresentation"
                    :disabled="rrbDisabled" />
                </div>
            </div>
        </div>

        <!--<div v-if="representationSelected.id != defaultRepresentation">-->

            <!-- remove / schema -->
            <!--<div class="p-grid ">
                <div class="p-col">
                    <Button 
                    :label="label_remove"
                    icon="far fa-trash-alt" 
                    class="settings-button" 
                    v-on:dblclick="removeRepresentation"
                    v-tooltip="ttprr" />
                </div>
                <div class="p-col">
                    <Button 
                    :label="label_hierarchy"
                    icon="fas fa-sitemap" 
                    class="settings-button" 
                    @click="visualizeStructure"
                    v-tooltip="ttpvs" />
                </div>
            </div>-->

            <div class="p-grid ">
                <div class="p-col-9">
                    <Button 
                    :icon="isVisible ? 'far fa-eye' : 'far fa-eye-slash'" 
                    class="p-button-rounded p-button-outlined repr-button" 
                    @click="setVisibility"
                    v-tooltip.right="ttphr" />

                    <Button 
                    v-if="representationSelected.id != defaultRepresentation"
                    icon="fas fa-sitemap" 
                    class="p-button-rounded p-button-outlined repr-button" 
                    @click="visualizeStructure"
                    v-tooltip.right="ttpvs" />

                    <Button 
                    v-if="representationSelected.id != defaultRepresentation"
                    icon="fas fa-edit" 
                    class="p-button-rounded p-button-outlined repr-button" 
                    @click="editRepresentation"
                    v-tooltip.right="ttper"
                    :style="enabledRename ? 'background: #546974;' : 'background: transparent;'" />
                </div>

                <div class="p-col-1">
                    <Button 
                    v-if="representationSelected.id != defaultRepresentation"
                    icon="far fa-trash-alt" 
                    class="p-button-rounded p-button-outlined repr-button danger" 
                    v-on:dblclick="removeRepresentation"
                    v-tooltip.right="ttprr" />
                </div>
            </div>

        <!--</div>-->

        <div v-if="!isCollapsed">

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
                        optionLabel="name"  />
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
                        <Slider v-model="radius" :min="min_radius" :max="max_radius" :step="1" />
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
                        optionLabel="name" />
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
                    <Slider v-model="opacity" :min="0" :max="100" :step="1" />
                </div>
            </div>

            <hr />

            <!-- new representation -->
            <div class="p-grid">
                <div class="p-col">
                    <label>{{ label_new_repr }}</label>
                </div>
            </div>
            <div class="p-grid margin-bottom-10">
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

        </div>

    </div>
</template>

<script>
import { ref, watch, computed, reactive, toRefs, onUpdated } from 'vue'
import { useToast } from 'primevue/usetoast'
import globals from '@/globals'
import useStage from '@/modules/ngl/useStage'
import useComponents from '@/modules/ngl/useComponents'
import useFlags from '@/modules/common/useFlags'
import useRepresentations from '@/modules/representations/useRepresentations'
import useSelections from '@/modules/representations/useSelections'
import useModals from '@/modules/common/useModals'
import structureSettings from '@/modules/structure/structureSettings'
import structureStorage from '@/modules/structure/structureStorage'
export default {
    setup() {

        const { stage } = useStage()
        const { addRepresentation, delRepresentation } = useComponents()
        const { projectData, updateStructureProject, removeRepresentationFromStructure } = structureStorage()
        const { setFlagStatus } = useFlags()
        const { 
            defaultRepresentation, 
            currentRepresentation, 
            getRepresentationNames, 
            getCurrentRepresentationSettings,
            updateRepresentationProperty,
            setNameRepresentation,
            setCurrentRepresentation,
            setMolecularRepresentation,
            setVisibilityRepresentation,
            setColorSchemeRepresentation,
            setColorRepresentation,
            setOpacityRepresentation,
            setRadiusRepresentation,
            createNewRepresentation,
            deleteRepresentation
        } = useRepresentations()
        const { addNewRepresentationSettings, removeRepresentationSettings } = structureSettings()
        const { updateSelection, getStructureSelection } = useSelections()
        const { openModal } = useModals()

        let isCollapsed = ref(true)
        const currReprSettings = computed(() => getCurrentRepresentationSettings())
        const currReprVal = computed(() => currentRepresentation.value)
        //const currReprName = computed(() => currReprSettings.value.name)

        const re = computed(() => new RegExp('(' + currReprVal.value + '\-[0-9a-z]*\-[a-z]*)', 'g'))

        const page = reactive({
            ttpu: computed(() => isCollapsed.value ? 'Unfold representation settings' : 'Fold representation settings'),
            label_repr: "Select representation",
            label_ren_repr: "Rename representation",
            label_new_repr: "Create new representation",
            label_remove: "Remove",
            ttprr: "Remove representation (double click)",
            label_hierarchy: "Hierarchy",
            ttpvs: "View hierarchy map",
            ttper: "Edit representation name",
            ttphr: computed(() => isVisible.value ? 'Hide representation' : 'Show representation'),
            placeholderRenSel: "Insert new name",
            placeholderNewSel: "Insert new name",
            label_mol_repr: "Select molecular representation",
            label_radius: "Select radius",
            label_color: "Select color scheme",
            label_opacity: "Select opacity"
        })

        const unfoldRepresentations = (e) => {
            isCollapsed.value = !isCollapsed.value
        }

        const toast = useToast()

        // select representation
        const reprList = computed(() => getRepresentationNames())
        //const representationSelected = ref(reprList.value.filter(item => item.id === currReprVal.value)[0])
        const representationSelected = computed({
            get: () => reprList.value.filter(item => item.id === currReprVal.value)[0],
            set: val => {
                // if Default, close settings menu
                if(val.id === defaultRepresentation) {
                    setFlagStatus('sidebarEnabled', false)
                    setFlagStatus('zoomWindowEnabled', false)
                } else  {
                    setFlagStatus('sidebarEnabled', true)
                    //setFlagStatus('zoomWindowEnabled', true)
                }
                setCurrentRepresentation(val.id, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            }
        })
        // TO REMOVE???
        //const watchedRepresentationSelected = computed(() => reprList.value.filter(item => item.id === currReprVal.value)[0])

        /*const onChangeRepresentation = (e) => {
            //hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
            //setCurrentRepresentation(e.value.id, true)
        }*/

        // set visibility
        const isVisible = computed(() => currReprSettings.value.visible)
        //setVisibilityRepresentation(stage, isVisible.value, re.value, false)
        const setVisibility = () => {
            //console.log(stage)
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
                        // update dataProject
                        updateStructureProject(dp)
                        // update settings
                        addNewRepresentationSettings(r.representation)
                        // update selection
                        updateSelection(r.representation.id, dp.files, 'add')
                        // update current representation
                        setCurrentRepresentation(r.representation.id, true)
                            .then((r) => {
                                if(r.code != 404) console.log(r.message)
                                else console.error(r.message)
                            })
                        // draw new representation
                        addRepresentation(stage, r.representation)
                        // show toast with new representation info
                        toast.add({ 
                            severity:'info', 
                            summary: 'New representation', 
                            detail:'The new representation ' 
                                    + r.representation.name 
                                    + ' has been successfully created. Now you have to integrate components to it from the right Settings menu.', 
                            life: 10000
                        });
                        // open settings if closed
                        setFlagStatus('sidebarEnabled', true)
                        console.log(r.message)
                    } else {
                        console.error(r.message)
                    }
                })
            modelNewSel.value = ''
        }

        // molecular representation
        const molReprType =  globals.representation
        //const molRepresentation = ref(molReprType.filter(item => item.id === currReprSettings.value.mol_repr)[0])

        const changeMolRepresentation = (value) => {
            if(currReprVal.value !== defaultRepresentation) {
                //console.log(value.id)
                updateRepresentationProperty('mol_repr',value.id)
                // get selections for current representation
                const str = getStructureSelection(currReprVal.value)
                setMolecularRepresentation(stage, currReprSettings.value, value.id, re.value, str, true)
                    .then((r) => {
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
                }
        }

        const molRepresentation = computed({
            get: () => molReprType.filter(item => item.id === currReprSettings.value.mol_repr)[0],
            set: val => changeMolRepresentation(val)
        })

        // TO REMOVE???
        //const watchedMolRepresentation = computed(() => molReprType.filter(item => item.id === currReprSettings.value.mol_repr)[0])

        // radius
        // DEFINE AS A COMPUTED GLOBAL CONSTANT (line / surface / cartoon / ribbon)
        //let hasRadius = ref(false)
        const hasRadius = computed(() => !(currReprSettings.value.mol_repr == 'line' 
                                            || currReprSettings.value.mol_repr == 'surface' 
                                            || currReprSettings.value.mol_repr == 'cartoon' 
                                            || currReprSettings.value.mol_repr == 'ribbon'))
        const radius = computed({
            get: () => currReprSettings.value.radius[currReprSettings.value.mol_repr] !== undefined ? currReprSettings.value.radius[currReprSettings.value.mol_repr].value*10 : null,
            set: val => changeRadius(val)
        })
        const min_radius = computed(() => radius.value ? currReprSettings.value.radius[currReprSettings.value.mol_repr].min * 10 : null)
        const max_radius = computed(() => radius.value ? currReprSettings.value.radius[currReprSettings.value.mol_repr].max * 10 : null)
        const changeRadius = (value) => {
            updateRepresentationProperty(['radius', currReprSettings.value.mol_repr, 'value' ], value / 10 )
            setRadiusRepresentation(stage, currReprSettings.value.mol_repr, value, re.value, true)
            .then((r) => {
                if(r.code != 404) console.log(r.message)
                else console.error(r.message)
            })
        }

        // color
        const colorScheme =  globals.colorScheme
        //const colorUniform = ref(currReprSettings.value.color_scheme === 'uniform')
        const colorUniform = computed(() => currReprSettings.value.color_scheme === 'uniform')
        // TO REMOVE???
        //const watchedColorUniform = computed(() => currReprSettings.value.color_scheme === 'uniform')

        // change uniform color from picker
        const changeColor = (value) => {
            if(currReprVal.value !== defaultRepresentation) {
                let col = value
                if (!col.startsWith('#') && col.length < 7) col = '#' + value
                updateRepresentationProperty('color', col)
                //console.log(stage)
                //setColorRepresentation(stage, col, re.value, true)
                setColorRepresentation(stage, col, re.value, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
            }
        }

        //const color = ref(currReprSettings.value.color)
        const color = computed({
            get: () => currReprSettings.value.color,
            set: val => changeColor(val)
        })
        // TO REMOVE???
        //const watchedColor = computed(() => currReprSettings.value.color)


        // change color schema from dropdown
        const changeColorScheme = (value) => {
            if(currReprVal.value !== defaultRepresentation) {
                updateRepresentationProperty('color_scheme', value.id)
                setColorSchemeRepresentation(stage, value.id, color.value, re.value, true)
                    .then((r) => {
                        //console.log(stage)
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
            }
        }

        //const mainStructureColor = ref(colorScheme.filter(item => item.id === currReprSettings.value.color_scheme)[0])
        const mainStructureColor = computed({
            get: () => colorScheme.filter(item => item.id === currReprSettings.value.color_scheme)[0],
            set: val => changeColorScheme(val)
        })
        // TO REMOVE???
        //const watchedMainStructureColor = computed(() => colorScheme.filter(item => item.id === currReprSettings.value.color_scheme)[0])

        // opacity

        const changeOpacity = (value) => {
            //console.log(value)
            updateRepresentationProperty('opacity', (value / 100))
            setOpacityRepresentation(stage, value, re.value, true)
                .then((r) => {
                    if(r.code != 404) console.log(r.message)
                    else console.error(r.message)
                })
        }

        //const opacity = ref(Math.round(currReprSettings.value.opacity * 100))
        const opacity = computed({
            get: () => Math.round(currReprSettings.value.opacity * 100),
            set: val => changeOpacity(val)
        })
        // TO REMOVE???
        //const watchedOpacity = computed(() => (currReprSettings.value.opacity * 100))

        //setOpacityRepresentation(stage, opacity.value, re.value, false)
        

        // watchers
        // custom color watcher
        watch(color, (col, prevColor) => {
            //console.log(col, prevColor)
            //if (color.value !== 'undefined' && colorUniform.value) changeColor()
            if (color.value !== undefined && colorUniform.value) color.value = col
        })
        // generic watcher
        // to remove
        /*watch([watchedRepresentationSelected, 
            watchedMolRepresentation,
            watchedColorUniform, 
            watchedColor, 
            watchedMainStructureColor,
            watchedOpacity], (newValues, prevValues) => {
            // select representations
            const wrs = newValues[0]
            //representationSelected.value = wrs
            // change molecular respresentation
            const wmr = newValues[1]
            //molRepresentation.value = wmr
            // colors
            const wclu = newValues[2]
            //colorUniform.value = wclu
            const wcl = newValues[3]
            //color.value = wcl
            const wmscl = newValues[4]
            //mainStructureColor.value = wmscl
            // opacity
            const wop = newValues[5]
            //opacity.value = Math.round(wop)
        })*/

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
            const remRepr = representationSelected.value.id
            const reprName = representationSelected.value.name
            //delRepresentation(stage, representationSelected.value.id)
            deleteRepresentation(remRepr)
                .then((r) => {
                    if(r.code != 404) {
                        // remove representation from components
                        delRepresentation(stage, remRepr)
                        // update dataProject
                        removeRepresentationFromStructure(remRepr)
                        // update settings
                        removeRepresentationSettings(remRepr)
                        // update selection
                        updateSelection(remRepr, null, 'remove')
                        // update current representation
                        setCurrentRepresentation(r.newCurrentRepresentation, true)
                            .then((r) => {
                                if(r.code != 404) console.log(r.message)
                                else console.error(r.message)
                            })
                        toast.add({ 
                            severity: 'warn', 
                            summary: 'Representation removed', 
                            detail:'The representation ' 
                                    + reprName 
                                    + ' has been removed from your workspace.', 
                            life: 5000
                        });
                        // update settings status (closed if default, open otherwise)
                        if(r.newCurrentRepresentation === defaultRepresentation) setFlagStatus('sidebarEnabled', false)
                        else setFlagStatus('sidebarEnabled', true)
                        console.log(r.message)
                    } else {
                        console.error(r.message)
                    }
                })
        }

        const enabledRename = ref(false)
        const editRepresentation = () => {
            enabledRename.value = !enabledRename.value
            // fer una variable que oculti / mostri una caixa de text a sota del desplegable select representation
        }

        let newName = currReprSettings.value.name
        const modelRenSel = computed({
            get: () => currReprSettings.value.name,
            set: val => newName = val
        })

        // NOT WORKING
        const rrbDisabled = computed(() => newName.length === 0)

        const renameRepresentation = () => {
            if(newName) {
                //console.log(newName, currReprVal.value)
                updateRepresentationProperty('name', newName)
                setNameRepresentation(newName, true)
                    .then((r) => {
                        if(r.code != 404) console.log(r.message)
                        else console.error(r.message)
                    })
            }
        }

        const visualizeStructure = () => {
            openModal('hierarchy')
        }

        onUpdated(() => {
            if(enabledRename.value && newName !== currReprSettings.value.name) enabledRename.value = false
            newName = currReprSettings.value.name
        })

        return { 
            isCollapsed, isVisible, 
            ...toRefs(page), 
            defaultRepresentation,
            unfoldRepresentations,
            reprList, representationSelected, /*onChangeRepresentation, */
            setVisibility,
            modelNewSel, nrbDisabled, newRepresentation,
            molReprType, molRepresentation, /*onChangeMolRepresentation,*/
            radius, min_radius, max_radius, hasRadius, /*onChangeRadius,*/
            colorScheme, mainStructureColor, /*onChangeColorScheme,*/ colorUniform, color,
            opacity, /*onChangeOpacity,*/
            removeRepresentation, visualizeStructure, enabledRename, editRepresentation, renameRepresentation, modelRenSel, rrbDisabled
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
        color:#ffffff;
        height: 1.5rem;
        width: 1.5rem;
        font-size: 12px;
        margin: .3rem 0 0 .6rem;
        background:transparent;
        /*border:none;*/
    }
    #minisettings .repr-button.danger { position:absolute; right:.8rem; }
    #minisettings .repr-button:hover { background: #546974!important;}
    #minisettings .repr-button.danger:hover { background: #c75959!important;}

</style>