<script setup lang="ts">
import MainTopBar from "./main-top-bar.vue";
</script>

<template>
  <MainTopBar></MainTopBar>
  <div class="content-container">
    <div class="side-space"></div>
    <div class="content">
      <router-view />
    </div>
    <div class="side-space"></div>
  </div>
</template>

<style scoped>
.content-container {
  display: flex;
  justify-content: flex-start;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px);
}
.content{
  width: 100%;
}
</style>
