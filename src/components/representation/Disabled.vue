<template>
  <div id="container">
    <div id="message">
      The representation editor is only available for resolutions over 768
      pixels wide (tablet, laptop or desktop computer).
    </div>
  </div>
</template>

<style>
#container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #f1f1f1;
}
#message {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
</style>