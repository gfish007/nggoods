<template>
    <v-app>
      <LoadingSpinner v-if="isLoading" />
      <NuxtPage />
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import LoadingSpinner from '~/components/LoadingSpinner.vue'
  
  const isLoading = ref(true)
  const router = useRouter()
  
  watch(router, (to, from, next) => {
    isLoading.value = true
    next()
  })
  
  onMounted(() => {
    isLoading.value = false
  })
  
  router.afterEach(() => {
    isLoading.value = false
  })
  </script>
  
  <style>
  @import '@mdi/font/css/materialdesignicons.min.css';
  @import 'vuetify/styles';
  </style>
  