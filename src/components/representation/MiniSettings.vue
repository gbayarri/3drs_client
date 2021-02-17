<template>
    <div id="minisettings">
        
        <Button 
        @click="unfoldRepresentations" 
        id="unfold-button">
            <i class="pi pi-angle-double-up"></i>
        </Button>
        
        <!-- representation -->
        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_repr }}</label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <Dropdown 
                v-model="representationsList" 
                :options="reprType" 
                optionLabel="name" 
                @change="onChangeRepresentation"
                style="max-width: 12rem;"/>
            </div>
            <div class="p-col-fixed"  style="width:3.5rem; ">
                <Button icon="pi pi-plus" @click="newRepresentation" class="p-button-nr" v-tooltip.right="ttp" />
            </div>
        </div>

        <div v-if="!isCollapsed">

            <hr />
            
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

            <!-- opacity -->
            <div class="p-grid double-col">
                <div class="p-col">
                    <label>{{ label_opacity }}</label>
                </div>
                <div class="p-col slider-value">
                    <label>{{ opacity }}</label>
                </div>
            </div>
            <div class="p-grid">
                <div class="p-col">
                    <Slider v-model="opacity" :min="0" :max="100" :step="1" />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, watch } from 'vue'
import globals from '@/globals'
export default {
    setup() {

        let isCollapsed = ref(true)
        const header = "Main Structure"

        const unfoldRepresentations = (e) => {
            // TRY TO ANIMATE TRANSITION (VUE TRANSITION?)
            isCollapsed.value = !isCollapsed.value

            if(!isCollapsed.value)
                document.getElementById("unfold-button").innerHTML = '<i class="pi pi-angle-double-down"></i>'
            else
                document.getElementById("unfold-button").innerHTML = '<i class="pi pi-angle-double-up"></i>'
        }

        // representation
        const label_repr = "Select representation"
        const ttp = "Create new representation"
        const reprType =  [
            { name: 'Representation asfda sda sdasdasdda 1', id: '1' },
            { name: 'Representation 2', id: '2' },
            { name: 'Representation 3', id: '3' },
            { name: 'Representation 4', id: '4' }
        ]
        let representationsList = ref({ name: 'Representation 1', id: '1' })

        const onChangeRepresentation = (e) => {
            hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
        }

        const newRepresentation = () => {
            console.log("New representation!!!")
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
        const label_opacity = "Select opacity"
        let opacity = ref(100)

        return { header, isCollapsed, unfoldRepresentations,
        label_repr, ttp, reprType, representationsList, onChangeRepresentation, newRepresentation,
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
        z-index: 3; 
        /*left: calc(2% + 50px); */
        left: 1%;
        bottom: 0;
        width: 20%;
        /* MODIFY ON FOLD / UNFOLD!!! */
        padding:0.2rem 0 1rem 0;
        background-color: rgb(123 141 160 / 0.95); 
        border-radius: 5px 5px 0 0;
        -webkit-box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.6);
        -moz-box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.6);
        box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.7);
    }
    #minisettings .double-col { margin: -0.5rem -0.25rem 0 -0.25rem; }
    /* buttons */
    #minisettings .p-button-nr { background: #fff; border-color: #fff; color:#6f96a9; margin-left: -.5rem; padding: .35rem 0; width: 2.2rem; }
    #minisettings .p-button-nr:hover { background: #6f96a9; color:#fff; border-color: #fff; }
    /* label */
    #minisettings label { margin:0 2.5%; color:#fff;}
    /* label */
    #minisettings .p-slider.p-slider-horizontal { width: 90%; margin: 0 5%; background: #ccc; }
    #minisettings .p-slider .p-slider-range { background: #fff; }
    #minisettings .p-slider .p-slider-handle { border-color: #b4cce6; }
    #minisettings .p-slider:not(.p-disabled) .p-slider-handle:hover { background: #6f96a9;  border-color: #fff; }
    #minisettings .slider-value { text-align:right; font-weight: 700;}

    #minisettings #unfold-button {
        z-index:4;
        position: absolute;
        right: 2rem;
        top: -2rem;
        cursor: pointer;
        /*transform: translateY(-50%);*/
        background: rgb(123 141 160 / 0.95); 
        color: #fff;
        padding: .5rem 1rem 0.5rem 1rem;
        width: 3rem;
        font-size: 20px;
        border-radius: 5px 5px 0 0;
        border:none;
        /*-webkit-box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6);
        -moz-box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6);
        box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6);*/
    }
    #minisettings #unfold-button:focus { 
        -webkit-box-shadow: 0px -1px 2px rgba(32, 8, 8, 0.6)!important;
        -moz-box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6)!important;
        box-shadow: 0px -1px 2px rgba(50, 50, 50, 0.6)!important;
    }
    /*#minisettings #unfold-button:hover { border:none; }*/
</style>