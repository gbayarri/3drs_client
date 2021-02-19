<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fas fa-dna"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" v-tooltip.top="'ttp'" />
        </template>

        <!-- representation -->
        <div class="p-grid">
            <div class="p-col">
                <label>{{ label_repr }}</label>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col">
                <Dropdown 
                v-model="mainStructureRepresentation" 
                :options="reprType" 
                optionLabel="name" 
                @change="onChangeRepresentation"/>
            </div>
        </div>

        <!-- radius -->
        <div class="p-grid" v-if="hasRadius" >
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
            <div class="p-col-fixed" v-if="colorUniform" style="width:3rem">
                <ColorPicker v-model="color" />
            </div>
        </div>

        <!-- opacity -->
        <div class="p-grid">
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
      
    </Panel>
</template>

<script>
import { ref, watch } from 'vue'
import globals from '@/globals'
export default {
    setup() {

        const isCollapsed = ref(true)
        const header = "Main Structure"

        // representation
        const label_repr = "Select representation"
        const reprType =  globals.representation_str
        const mainStructureRepresentation = ref({ name: 'Ribbon', id: 'ribbon' })

        const onChangeRepresentation = (e) => {
            hasRadius.value = !(e.value.id == 'line' || e.value.id == 'surface')
        }

        // radius
        const label_radius = "Select radius"
        const hasRadius = ref(true)
        const radius = ref(100)

        // color
        const label_color = "Select color scheme"
        const colorScheme =  globals.colorScheme
        const colorUniform = ref(false)
        const color = ref('#6f96a9')
        const mainStructureColor = ref({ name: 'Secondary structure', id: 'sstruc' })

        const onChangeColorScheme = (e) => {
            colorUniform.value = (e.value.id == 'uniform')
        }

        watch(color, (color, prevColor) => {
            console.log(color, prevColor)
        })

        // opacity
        const label_opacity = "Select opacity"
        const opacity = ref(100)

        return { header, isCollapsed, 
        label_repr, reprType, mainStructureRepresentation, onChangeRepresentation,
        label_radius, radius, hasRadius,
        label_color, colorScheme, mainStructureColor, onChangeColorScheme, colorUniform, color,
        label_opacity, opacity }
    }
}
</script>

<style>

</style>