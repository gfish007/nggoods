<template>
  <v-form>
    <v-row justify="end">
      <!-- 商品名称输入框 -->

      <v-text-field  density="comfortable " variant="plain" max-width="200px" v-model="search.name" label="商品名称" />
        <v-select density="comfortable " max-width="200px" v-model="search.reviewStatus" v-if="isPrivileged" variant="plain" :items="reviewStatusOptions" label="审核状态" />
        <v-select density="comfortable " max-width="200px" v-model="search.availabilityStatus" v-if="isPrivileged" variant="plain" :items="availabilityStatusOptions" label="上下架状态" />
        <v-btn-toggle v-model="toggle" variant="plain" divided>
          <v-btn @click="searchProducts">搜索</v-btn>
          <v-btn @click="showAddProductModal">新增商品</v-btn>
        </v-btn-toggle>
     

     
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import config from '~/config'
const isPrivileged = config.isPrivileged
const search = ref({
  name: null,
  reviewStatus: null,
  availabilityStatus: null
})

const reviewStatusOptions = ['审核中', '审核通过', '审核驳回']
const availabilityStatusOptions = ['上架', '下架']

const emit = defineEmits(['search', 'show-add-product-modal'])

const searchProducts = () => {
  emit('search', search.value)
}

const showAddProductModal = () => {
  emit('show-add-product-modal')
}
</script>
