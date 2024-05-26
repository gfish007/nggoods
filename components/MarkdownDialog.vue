<template>
    <v-dialog v-model="show" max-width="800px">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <div id="preview"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeDialog">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits, onMounted, nextTick } from 'vue'
  
  // 动态导入 Vditor
  let Vditor
  if (process.client) {
    import('vditor').then(module => {
      Vditor = module.default
      initPreview()
    })
  }
  
  const props = defineProps({
    modelValue: Boolean,
    title: String,
    markdownContent: String,
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const show = ref(props.modelValue)
  
  const initPreview = async () => {
    if (Vditor && show.value) {
      await nextTick()
      Vditor.preview(document.getElementById('preview'), props.markdownContent, {
        cdn: 'https://cdn.jsdelivr.net/npm/vditor@latest'
      })
    }
  }
  
  watch(() => props.modelValue, (newVal) => {
    show.value = newVal
    if (newVal) {
      initPreview()
    }
  })
  
  const closeDialog = () => {
    emit('update:modelValue', false)
  }
  
  onMounted(() => {
    if (show.value) {
      initPreview()
    }
  })
  </script>
  
  <style scoped>
  .v-card-text {
    max-height: 70vh;
    overflow-y: auto;
  }
  </style>
  