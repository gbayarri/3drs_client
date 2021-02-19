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
            <div class="p-col-9" style="padding-right:0">
                <Dropdown 
                v-model="representationSelected" 
                :options="reprType" 
                optionLabel="name" 
                @change="onChangeRepresentation"
                />
            </div>
            <div class="p-col-3" style="padding-left:0; text-align: center;">
                <Button 
                icon="far fa-trash-alt" 
                class="p-button-rounded repr-button" 
                v-on:dblclick="removeRepresentation"
                v-tooltip.top="ttprr" v-if="representationSelected.id != 1" />
                <Button 
                icon="far fa-eye" 
                class="p-button-rounded repr-button" 
                v-tooltip.top="ttphr" />
            </div>
        </div>

        <div v-if="!isCollapsed">

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
            
            <div v-if="representationSelected.id != 1">
            
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
                        <Slider v-model="radius" :min="0" :max="500" :step="5" />
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
                    <Slider v-model="opacity" :min="0" :max="100" :step="1" />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import globals from '@/globals'
export default {
    setup() {

        let isCollapsed = ref(true)

        // TODO: SPECIAL MENU FOR REPRESENTATION 1 => NO MOL REPR / RADIUS AND 
        // ALLOW MOL REPR SEPARATELY???
        // SHOW / HIDE STRUCTURE, BASES (CHECK IF NA in getResidues()), HETERO, IONS & WATERS.
        // ALLOW TO MODIFY OPACITY BUT NO COLORSCHEME

        // fold / unfold
        let ttpu = ref("Unfold representation settings")

        const unfoldRepresentations = (e) => {
            ttpu.value = isCollapsed.value ? 'Fold representation settings' : 'Unfold representation settings'
            isCollapsed.value = !isCollapsed.value
        }

        // representation
        const label_repr = "Select representation"
        const label_new_repr = "Create new representation"
        const reprType =  [
            { name: 'Representation 1', id: 1 },
            { name: 'Representation 2', id: 2 },
            { name: 'Representation 3', id: 3 },
            { name: 'Representation 4', id: 4 }
        ]
        let representationSelected = ref({ name: 'Representation 1', id: 1 })

        const onChangeRepresentation = (e) => {
            hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
        }

        // REMOVE REPRESENTATION 
        /* stage.getComponentsByName('first_str').list[0].dispose() */
        const ttprr = "Remove representation (double click)"
        const removeRepresentation = () => {
            console.log("double click!!")
        }

        let ttphr = ref("Hide representation")

        // SET VISIBILITY
        /*stage.getComponentsByName('first_str').list[0].setVisibility( false )*/

        let modelNewSel = ref('')
        let nrbDisabled = computed(() => !modelNewSel.value.length)
        const placeholderNewSel = "Insert new name"
        const newRepresentation = () => {
            console.log("New representation " + modelNewSel.value + "!!!")
        }

        // representation
        const label_mol_repr = "Select molecular representation"
        const molReprType =  globals.representation_str
        let molRepresentation = ref({ name: 'Cartoon', id: 'cartoon' })

        const onChangeMolRepresentation = (e) => {
            hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
        }

        // radius
        const label_radius = "Select radius"
        let hasRadius = ref(true)
        let radius = ref(100)

        // color
        const label_color = "Select color scheme"
        const colorScheme =  globals.colorScheme
        let colorUniform = ref(false)
        let color = ref('#6f96a9')
        let mainStructureColor = ref({ name: 'Secondary structure', id: 'sstruc' })

        const onChangeColorScheme = (e) => {
            colorUniform.value = (e.value.id == 'uniform')
        }

        watch(color, (color, prevColor) => {
            console.log(color, prevColor)
        })

        // opacity
        /*stage.getComponentsByName('first_str').list[0].reprList.forEach( function( repre ){
              //repre.setParameters( { opacity: 0.5} )
            } )*/
        const label_opacity = "Select opacity"
        let opacity = ref(100)

        return { isCollapsed, 
        ttpu, unfoldRepresentations,
        label_repr, label_new_repr, reprType, representationSelected, onChangeRepresentation, 
        ttprr, removeRepresentation, ttphr,
        nrbDisabled, modelNewSel, placeholderNewSel, newRepresentation,
        label_mol_repr, molReprType, molRepresentation, onChangeMolRepresentation,
        label_radius, radius, hasRadius,
        label_color, colorScheme, mainStructureColor, onChangeColorScheme, colorUniform, color,
        label_opacity, opacity }
    }
}
</script>

<style>
    #minisettings { 
        position: absolute; 
        z-index: 2; 
        /*left: calc(2% + 50px); */
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