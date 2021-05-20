<template>
  <div id="caption" v-if="!hideCaption">
    <div>
    <div id="capt-title">
      <span id="tit">{{ settings.title }}</span>
      <Button
        v-if="!hideButton"
        :icon="showCaption ? 'fas fa-minus' : 'fas fa-plus'" 
        class="p-button-rounded p-button-outlined repr-button"
        @click="handleClick"
        v-tooltip.top="ttp"
      />
    </div>
    <div
      id="capt-description"
      v-html="settings.caption"
      v-if="showCaption"
    ></div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue"
import useProjectSettings from "@/modules/structure/useProjectSettings"
export default {
    setup() {
        const { getProjectSettings } = useProjectSettings()

        const settings = computed(() => getProjectSettings())
        const hideCaption = computed(() => settings.value.title === null || settings.value.title === "")
        const hideButton = computed(() => settings.value.caption === null || settings.value.caption === "")

        const showCaption = ref(false)
        const ttp = computed(() => showCaption.value ? 'Hide caption' : 'Show caption')

        const handleClick = () => {
            showCaption.value = !showCaption.value
        }

        return { settings, hideCaption, hideButton, showCaption, ttp, handleClick }
    }
}
</script>

<style>
#caption {
  position: absolute;
  z-index: 2;
  border-radius: 4px;
  left: 1%;
  bottom: 1.5%;
  background-color: rgb(123 141 160 / 0.95);
  color: #fff;
  padding: 10px 15px;
  max-width: 30%;
}
@media (max-width: 768px) {
    #caption { left: 3.5rem; bottom: auto; top:1.5%; max-width: calc(3.5rem + 60%); /*max-height: 200px;*/  }
    #caption div { text-align: center; }
    #capt-description { max-height: 6rem; overflow-y: auto; overflow-x: hidden; }
}
@media (max-width: 600px) {
    #caption { left: 1.5%; max-width: 97%;  }
}
#capt-title { font-weight: 900; text-align: left!important; }
#capt-title span#tit { position: relative; top: -2px; font-size: 18px; margin-right: .5rem; }
#capt-title .repr-button {
    color:#ffffff;
    height: 1.5rem;
    width: 1.5rem;
    font-size: 12px;
    margin: .3rem 0 0 .6rem;
    background:transparent;
    border-color:#fff;
}
#capt-title .repr-button:hover { background: #546974!important;}
#capt-description {
  background-color: rgb(153 171 191 / 0.5);
  margin-top: 0.5rem;
  padding: 0.5rem 0.5rem;
  /*max-height: 6rem;*/
  text-align: left!important;
}
#capt-description p { margin: 0.5rem 0; }
#capt-description a { color:#fff; font-weight: 700;}
</style>