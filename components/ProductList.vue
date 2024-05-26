<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <ProductItem :product="product" :exchangeRates="exchangeRates" @edit="editProduct" @delete="deleteProduct" @contact="contactProduct" />
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import ProductItem from './ProductItem.vue'
import ProductModal from './ProductModal.vue'
import { fetchProducts, fetchExchangeRates, addProduct, modifiedProduct, deleteProductById } from '../utils/fetchFunctions.js'
import config from '~/config'

const products = ref([])
const exchangeRates = ref({})
const selectedProduct = ref(null)

const emit = defineEmits(['edit', 'delete'])

const loadProducts = async () => {
  try {
    products.value = await fetchProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}

const loadExchangeRates = async () => {
  try {
    exchangeRates.value = await fetchExchangeRates()
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
  }
}

onMounted(async () => {
  await loadProducts()
  await loadExchangeRates()
})

const editProduct = (product) => {
  emit('edit', product)
}


const deleteProduct = async (productId) => {
  try {
    await deleteProductById(productId)
    await loadProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

const contactProduct = (productId) => {
  console.log('Contact product with ID:', productId)
}
</script>

<style scoped>
/* 您的样式代码 */
</style>
