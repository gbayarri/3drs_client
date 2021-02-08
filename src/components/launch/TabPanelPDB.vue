<template>
    <p>{{ texts.desc }}</p>
    <form class="send-pdb" @submit.prevent="submitPDB">
    <div class="p-fluid p-formgrid p-grid">
        <div class="p-field p-col-12 p-md-6">
            <label for="pdbid">{{ texts.label }}</label>
            <AutoComplete 
            v-model="selectedStructures"
            :multiple="true" 
            :suggestions="filteredStructures" 
            @complete="searchStructure" 
            @item-select="selectItem" 
            @item-unselect="unselectItem" 
            />
        </div>
    </div>
    <hr />
    <Button type="submit" label="Submit" icon="pi pi-check" class="p-button" :disabled="formDisabled" />
    </form>
</template>

<script>
import { ref } from "vue"
import axios from 'axios'
export default {
    props: ['texts'],
    setup() {

        let selectedStructures = ref([])
        let filteredStructures = ref([])
        let formDisabled = ref(true)

        // call API to get PDB's with given query
        const searchStructure = (event) => {
            axios
                .get(process.env.VUE_APP_API_LOCATION + 'pdb/' + event.query.toLowerCase())
                .then(response => filteredStructures.value = response.data)
                .catch(err => console.log(err.message))
                .finally( /*() => console.log('done!')*/ )
        }

        // on select new item, check if form must be enabled
        const selectItem = () => {
            if(selectedStructures.value.length) formDisabled.value = false
        }

        // on unselect new item, check if form must be disabled
        const unselectItem = () => {
            if(!selectedStructures.value.length) formDisabled.value = true
        }

        // submit list of PDB's
        const submitPDB = () => {
            //console.log(Object.assign([], selectedStructures.value))
            axios.post(process.env.VUE_APP_API_LOCATION + 'upload/pdb/', {
                structures: Object.assign([], selectedStructures.value)
            })
            .then(function (response) {
                console.log(response);
            })
        }

        return { selectedStructures, filteredStructures, searchStructure, formDisabled, 
                selectItem, unselectItem, submitPDB }
    }
}
</script>

<style>

</style>