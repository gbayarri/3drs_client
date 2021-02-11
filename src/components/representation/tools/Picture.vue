<template>
  <Button icon="fas fa-camera-retro" v-tooltip.right="ttp" @click="handleClick"  />
</template>

<script>
export default {
  props: ['stage'],
  setup(props) {

    const ttp = "Take a picture of the representation"

    let stage = props.stage

    const handleClick = () => {
      stage.makeImage( {
          factor: 4,
          antialias: true,
          trim: false,
          transparent: true
      } ).then( function( blob ){
          let link = document.createElement('a');
          link.download = 'screenshot.png';
          let reader = new FileReader();
          reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
          reader.onload = function() {
            link.href = reader.result; // data url
            link.click();
          };
      } );
    }

    return { ttp, handleClick }
  }
}
</script>

<style>

</style>