<template>
  <v-container fluid>
    <v-row justify="center" class="my-custom-row">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex justify-center my-custom-col"
      >
        <div class="product-wrapper">
          <ProductItem :product="product" :exchangeRates="exchangeRates" @changeLoading="changeLoading" @edit="editProduct" @delete="deleteProduct" @contact="contactProduct" />
        </div>
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

const emit = defineEmits(['edit', 'delete', 'loading'])

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

const changeLoading = (value) => {
  emit('loading', value)
}

const deleteProduct = async (productId) => {
  changeLoading(true)
  try {
    await deleteProductById(productId)
    await loadProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
  } finally{
    changeLoading(false)
  }
}

const contactProduct = (productId) => {
  console.log('Contact product with ID:', productId)
}
</script>

<style scoped>
.my-custom-row {
  margin-left: -5px;
  margin-right: -5px;
}

.my-custom-col {
  padding-left: 5px !important;
  padding-right: 5px !important;
}

.product-wrapper {
  width: 100%;
  min-width: 265px;
  padding: 5px;
}
</style>
