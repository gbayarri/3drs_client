<template>
  <div>
    <p>Please visit the <a v-bind:href="nglURL" target="_blank">Selection language</a> section of the NGL Viewer manual <strong>before starting</strong> with this section.</p>
    <p>Write the NGL code in the textarea and then click the <strong>save button</strong>. For removing the selection, please click the <strong>remove button</strong>.</p>
    <p>Note that <strong>custom selection is not compatible with manual selection</strong>, so even though the selections made in the manual selection section will not be removed, they won’t be visible in the stage. If users want to <strong>restore a previously made manual selection</strong>, just removing the custom selection will do the trick.</p>
    <p>More information in the <a v-bind:href="`${docsURL}edit.html#custom-selection`" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Custom selection')
    }

    changeModalTitle()

    const docsURL = process.env.VUE_APP_HELP_URL
    const nglURL = process.env.VUE_APP_NGL_HELP_URL

    return { nglURL, docsURL }

  }
}
</script>

<style>

</style>