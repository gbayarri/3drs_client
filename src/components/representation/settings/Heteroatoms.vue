<template>
    <Panel :toggleable="true" v-model:collapsed="isCollapsed">
        <template #header>
            <i class="fab fa-hubspot fa-lg"></i> <div class="p-panel-title">{{ header }}</div>
        </template>
        <template #icons>
            <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
        </template>

        <Listbox 
        v-model="selectedHets" 
        :options="heteros" 
        :multiple="true" 
        :filter="true" 
        :filterPlaceholder="filterPlaceholder"
        optionLabel="name" 
        listStyle="max-height:200px" 
        style="width:100%"
        @change="onChange">
            <template #option="slotProps">
                <div>{{slotProps.option.name}}</div>
                <i class="fab fas fa-eye"></i>
            </template>
        </Listbox>

    </Panel>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {

        const isCollapsed = ref(true)
        const header = "Heteroatoms"
        const filterPlaceholder = "Search heteroatom"

        const selectedHets = ref(null)
        const heteros =  [
            {name: 'FFP', code: 'FFP'},
            {name: 'LLP', code: 'LLP'},
            {name: 'CPB', code: 'CPB'},
            {name: 'IST', code: 'IST'},
            {name: 'PRS', code: 'PRS'},
            {name: 'PNC', code: 'PNC'}
        ]

        const onChange = (e) => {
            //console.log(e.value)
            console.log(selectedHets.value)
        }

        return { header, isCollapsed, filterPlaceholder, selectedHets, heteros, onChange }
    }
}
</script>

<style>
    
</style>