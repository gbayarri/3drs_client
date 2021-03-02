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
import { inject, ref } from "vue"
import useMessages from '@/modules/common/useMessages'
import useModals from '@/modules/common/useModals'
export default {
    props: ['texts'],
    setup() {

        const $axios = inject('$axios')
        const $router = inject('$router')
        const { setMessage } = useMessages()
        const { openModal, setBlockUI, closeModal } = useModals()

        const selectedStructures = ref([])
        const filteredStructures = ref([])
        const formDisabled = ref(true)

        // call API to get PDB's with given query
        const searchStructure = (event) => {
            $axios
                .get(process.env.VUE_APP_API_LOCATION + '/pdb/' + event.query.toLowerCase())
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

            setBlockUI('upload_pdb')
            openModal('block')

            let resp = null

            $axios
                .post(process.env.VUE_APP_API_LOCATION + '/upload/pdb/', {
                    structures: Object.assign([], selectedStructures.value)
                })
                .then(function (response) {
                    //console.log(response);
                    resp = response.data
                })
                .catch(err => console.error(err.message))
                .finally( () => {
                    if(resp.status === 'error') {
                        closeModal('block')
                        const msg = {
                            severity: 'error',
                            content: resp.message,
                            show: true
                        }
                        setMessage('launch', msg)
                        disableFileUpload.value = false
                    } else if(resp.status === 'success') {
                        setBlockUI('load')
                        $router.push({ name: 'Representation', params: { id: resp.id } }) 
                    }
                })
        }

        return { 
            selectedStructures, filteredStructures, searchStructure, 
            formDisabled, 
            selectItem, unselectItem, 
            submitPDB 
        }
    }
}
</script>

<style>
    .p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token {
        background: #6f96a9!important;
        color:#fff!important;
    }
</style>