<template>
  <div id="container">
    <Curtains />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Curtains from './components/Curtains.vue'
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  user-select: none;
  -webkit-user-select: none;
}

#container{
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
}
</style>
