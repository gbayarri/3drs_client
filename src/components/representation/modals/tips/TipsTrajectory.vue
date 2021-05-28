<template>
  <div>
    <p>List of <strong>features available</strong> in Trajectories:</p>
    <ul>
      <li><strong>Range:</strong> initially set from the first to the last frame of the trajectory, defines a <strong>range of frames</strong> with which the trajectory will be played.</li>
      <li><strong>Step:</strong> defines the number of frames between playing steps.</li>
      <li><strong>Interpolation:</strong> type of interpolation between steps. Possible values: None, Linear or Spline.</li>
      <li><strong>Timeout:</strong> timeout between playing frames. Actually this slider is in a logarithmic scale from <strong>50</strong> to <strong>10000</strong> milliseconds, but it has been set from 0 to 100 for the sake of simplicity.</li>
      <li><strong>Loop:</strong> if enabled plays the trajectory indefinitely.</li>
      <li><strong>Autoplay:</strong> if enabled plays the trajectory automatically.</li>
      <li><strong>Bounce:</strong> if enabled plays in rock / bounce mode (back and forth).</li>
    </ul>  
    <p>More information in the <a href="https://3drs-documentation.readthedocs.io/en/latest/edit.html#trajectories" target="_blank">official documentation</a>.</p>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {

    function changeModalTitle() {
      emit('change-modal-title', 'Tips for Trajectories')
    }

    changeModalTitle()
  }
}
</script>

<style>

</style>