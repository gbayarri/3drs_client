<template>
    <p>{{ texts.desc }}</p>
    <!--<FileUpload 
    name="files[]"
    url="upload/file/"
    @uploader="null"
    @upload="onUpload" 
    :customUpload="false"
    :multiple="true" 
    accept=".pdb" 
    :maxFileSize="1000000"
    chooseLabel="Select">
        <template #empty>
            <p v-html="texts.int_desc"></p>
        </template>
    </FileUpload>-->
    <FileUpload 
    id="kk"
    name="files[]"
    url=""
    @uploader="uploader"
    @upload="onUpload" 
    :customUpload="true"
    :multiple="true" 
    accept=".pdb" 
    :maxFileSize="1000000"
    chooseLabel="Select">
        <template #empty>
            <p v-html="texts.int_desc"></p>
        </template>
    </FileUpload>
</template>

<script>
import axios from 'axios'
export default {
    props: ['texts'],
    data() {
		return {
      
		}
  },
	methods: {
        uploader(e) {
            // TO FINISH!!!!!
            console.log(Object.assign([], e.files)[0])
            let formData = new FormData();
            formData.append('file1', Object.assign([], e.files)[0])
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
            }
            axios.post(process.env.VUE_APP_API_LOCATION + 'upload/file/', formData)
            .then(function (response) {
                console.log(response);
            })
        },
        onUpload() {
        // muntar la api o una api mock per tractar tot aquest tema
        console.log('uploaded!!!!')
        }
    }
    /*setup() {

        const uploader = (e) => {

            console.log(e.files)

            //let formData = new FormData();

       //for (const item in e.files) {
        //   console.log(e.files[item])
       //    formData.append('files[' + item + ']', e.files[item])
       // }

        //formData.append('files[0]', Object.assign([], e.files)[0])

            //console.log(formData)

            //console.log(Object.assign([], e.files))
            axios.post(process.env.VUE_APP_API_LOCATION + 'upload/file/', e.files)
            .then(function (response) {
                console.log(response);
            })
            
        }

        // upload files
        const onUpload = (e) => {
            console.log(e)
        }

        return { uploader, onUpload }
    }*/
}
</script>

<style>

</style>