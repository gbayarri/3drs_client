<template>
  <Teleport to="body">
    <div ref="container" :class="containerClass" v-bind="$attrs">
      <transition-group name="p-toast-message" tag="div">
        <CustomToastMessage
          v-for="msg of messages"
          :key="msg.id"
          :message="msg"
          @close="remove($event)"
        />
      </transition-group>
    </div>
  </Teleport>
</template>
<script>
import Toast from "primevue/toast/Toast.vue";
import CustomToastMessage from "@/components/custom/CustomToastMessage.vue";

export default {
  extends: Toast,
  components: {
    CustomToastMessage,
  },
  setup() {

  }
};
</script>
