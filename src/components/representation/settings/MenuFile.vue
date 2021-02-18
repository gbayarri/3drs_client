<template>
    <div id="file-buttons" class="margin-top-5">
        <!-- SEE REPRESENTATIONSETTINGS FOR BUTTONS' ACTIONS -->
        <Button icon="far fa-trash-alt" class="p-button-rounded p-button-text" />
        <Button icon="fas fa-eye" class="p-button-rounded p-button-text" />
    </div>
</template>

<script>
export default {

}
</script>

<style>
    #file-buttons { margin-left: 2.5%; width: 95%; margin-bottom:0px; }
    #file-buttons button { height: 1.8rem; width: 1.8rem; font-size: 13px; color:#fff; }

    #file-buttons button {
        height: 1.5rem;
        width: 1.5rem;
        font-size: 13px;
        margin: .3rem 0 0 .1rem;
        background:transparent;
        border:none;
    }
    #file-buttons button:hover { background: #546974;}
</style>