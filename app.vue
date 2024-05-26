<template>
  <v-app>
    <NuxtPage />
  </v-app>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  titleTemplate: '低价内购',
  meta: [
    { name: 'description', content: '低价正规外区内购，整理合集' },
    { name: 'author', content: '陈跑跑' },
    { name: 'keywords', content: '低价内购, 优惠商品, 正规购买, 便宜外区' },
  ],
  link: [
    { rel: 'canonical', href: 'https://home.midsass.com' },
  ]
})
</script>

<style>
@import '@mdi/font/css/materialdesignicons.min.css';
@import 'vuetify/styles';
</style>
