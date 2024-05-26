<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <h1>尼日利亚低价内购列表</h1>
            <v-row class="mt-5" style="margin-bottom: 10px;">
              <v-col cols="12">
                <v-card variant="flat" color="secondary">
                  <v-card-title>汇率信息</v-card-title>
                  <v-card-text>
                    <v-chip
                          class="ma-2"
                          label
                        >
                        美元USD 转 人民币CNY => {{ exchangeRates.usdToCny }}
                        </v-chip> 
                    
                      <v-chip
                          class="ma-2"
                          label
                        >
                        美元USD 转 拉NGN => {{ exchangeRates.usdToNaira }}
                        </v-chip> 
                      
                  <v-chip
                          class="ma-2"
                          label
                        >
                        美元USD 转 拉NGN => {{ exchangeRates.usdToJpy }}
                        </v-chip>  
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <SearchContainer  @search="handleSearch" @show-add-product-modal="showAddProductModal" />
            <ProductList :products="products" :exchange-rates="exchangeRates" @edit="editProduct" @update:modelValue="showModal = $event" @delete="deleteProduct" />
            <ProductModal :model-value="showModal" :isEdit="isEdit" :product="currentProduct" @update:modelValue="showModal = $event" @submit="loadProducts" />
            <v-overlay :model-value="loading" class="align-center justify-center">
              <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
            </v-overlay>
          </v-col>
        </v-row>
        
      </v-container>
    </v-main>
    <v-footer padless class="text-center" app>
      <v-col class="white--text" cols="12">
        &copy; {{ new Date().getFullYear() }} 
        <a href="https://home.midsass.com" target="_blank" class="white--text">陈跑跑</a> 
        All rights reserved |
        
        <a href="mailto:chenpaopao@56781234.xyz" class="white--text">
          <v-icon small>mdi-email</v-icon>
        </a>
        &nbsp;
        <a href="https://github.com/gfish007/nggoods" target="_blank" class="white--text">
          <v-icon small>mdi-github</v-icon>
        </a>
        &nbsp;
        <a href="https://t.me/mid_sass" target="_blank" class="white--text">
          <v-icon small>mdi-telegram</v-icon>
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SearchContainer from '~/components/SearchContainer.vue'
import ProductList from '~/components/ProductList.vue'
import ProductModal from '~/components/ProductModal.vue'
import { fetchProducts, fetchExchangeRates, deleteProductById, fetchUserPrivileges } from '~/utils/fetchFunctions'
import config from '~/config'

const products = ref([])
const exchangeRates = ref({})
const loading = ref(false)
const showModal = ref(false)
const isEdit = ref(false)
const currentProduct = ref({})
const isPrivileged = ref(false)

const getUidFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('uid')
}

const checkUserPrivileges = async (uid) => {
  try {
    console.log('checkUserPrivileges')
    const privileges = await fetchUserPrivileges(uid)
    if (privileges.isPrivilegedUser) {
      config.isPrivileged = true
      config.uid = uid
      isPrivileged.value = true
    } else {
      config.isPrivileged = false
      isPrivileged.value = false
    }
  } catch (error) {
    console.error('Failed to fetch user privileges:', error)
    config.isPrivileged = false
    isPrivileged.value = false
  }
}

const loadProducts = async () => {
  loading.value = true
  products.value = await fetchProducts()
  loading.value = false
}

onMounted(async () => {
  const uid = getUidFromUrl()

  if (uid) {
    await checkUserPrivileges(uid)
  }
  exchangeRates.value = await fetchExchangeRates()
  await loadProducts()
})

const handleSearch = async (query) => {
  loading.value = true
  products.value = await fetchProducts(query)
  loading.value = false
}

const showAddProductModal = () => {
  showModal.value = true
  isEdit.value = false
  currentProduct.value = {}
}

const editProduct = (product) => {
  isEdit.value = true
  currentProduct.value = product
  showModal.value = true
}

const deleteProduct = async (productId) => {
  loading.value = true
  try {
    await deleteProductById(productId)
    await loadProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
  } finally {
    loading.value = false
  }
}
</script>
