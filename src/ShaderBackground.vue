<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { startShader } from "./shader.js";

const canvas = ref(null);
let stopShader;

onMounted(() => {
  stopShader = startShader(canvas.value);
});
onBeforeUnmount(() => stopShader?.());
</script>

<template>
  <canvas ref="canvas" class="shader-background" aria-hidden="true"></canvas>
</template>
