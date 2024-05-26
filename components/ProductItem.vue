<template>
  <v-card class="mx-auto" style="padding: 0px;">
    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>
      <v-icon
        class="me-1 pb-1"
        color="error"
        icon="mdi-alert"
        size="18"
      ></v-icon>
      价格仅参考使用
    </v-card-subtitle>
    <v-card-text class="py-0" style="margin-bottom: 5px;">
      <v-row align="center" no-gutters>
        <v-col class="text-right d-none d-md-flex" cols="3">
          <v-img :src="product.image" :alt="product.name" max-width="70" contain></v-img>
        </v-col>
        <v-col class="text-h6" cols="9">
          <v-card-subtitle>
            原价 {{ product.originalCurrency }}
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <v-icon small class="me-1" color="primary" v-bind="attrs" v-on="on">mdi-information</v-icon>
              </template>
              <span v-html="getExchangeRate(product.originalPrice, product.originalCurrency)"></span>
            </v-tooltip>
            {{ getCurrencySymbol(product.originalCurrency) }}{{ product.originalPrice }}
          </v-card-subtitle>
          <v-card-subtitle v-if="product.discountPrice">
            折扣 {{ product.discountCurrency }}
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <v-icon small class="me-1" color="primary" v-bind="attrs" v-on="on">mdi-information</v-icon>
              </template>
              <span v-html="getExchangeRate(product.discountPrice, product.discountCurrency)"></span>
            </v-tooltip>
            {{ getCurrencySymbol(product.discountCurrency) }}{{ product.discountPrice }}
          </v-card-subtitle>
          <v-card-subtitle>
            售价{{ product.saleCurrency }}
            <v-tooltip activator="parent" location="top">
              <template v-slot:activator="{ on, attrs }">
                <v-icon small class="me-1" color="primary" v-bind="attrs" v-on="on">mdi-information</v-icon>
              </template>
              <span v-html="getExchangeRate(product.salePrice, product.saleCurrency)"></span>
            </v-tooltip>
            {{ getCurrencySymbol(product.saleCurrency) }}{{ product.salePrice }}
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-end">
      <v-btn v-if="isPrivileged" icon @click.stop="editProduct(product)">
        <v-icon >mdi-pencil</v-icon>
      </v-btn>
      <v-btn v-if="isPrivileged" icon @click.stop="deleteProduct(product.id)">
        <v-icon ripple>mdi-delete</v-icon>
      </v-btn>

      <v-btn elevation="2" color="orange" @click.stop="openContactDialog" >联系</v-btn>
      <v-btn elevation="2" color="orange" @click.stop="openTutorialDialog" >教程</v-btn>
      
    </v-card-actions>

    <MarkdownDialog
      v-model="showContactDialog"
      :title="'联系方式'"
      :markdownContent="contactInfo"
    />

    <MarkdownDialog
      v-model="showTutorialDialog"
      :title="'教程'"
      :markdownContent="tutorial"
    />
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import config from '~/config'
import MarkdownDialog from '~/components/MarkdownDialog.vue'

const props = defineProps({
  product: Object,
  exchangeRates: Object,
})

const emit = defineEmits(['edit', 'delete', 'contact'])

const isPrivileged = config.isPrivileged

const showContactDialog = ref(false)
const showTutorialDialog = ref(false)

const contactInfo = computed(() => props.product.contactInfo || '暂未提供联系方式')
const tutorial = computed(() => props.product.tutorial || '暂未提供教程')

const editProduct = (product) => {
  emit('edit', product)
}

const deleteProduct = async (productId) => {
  emit('delete', productId)
}

const openContactDialog = () => {
  showContactDialog.value = true
}

const openTutorialDialog = () => {
  showTutorialDialog.value = true
}

const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    CNY: '¥',
    NGN: '₦',
    JPY: '¥',
  }
  return symbols[currency] || currency
}

const getCurrencyName = (currency) => {
  const names = {
    USD: '美元',
    CNY: '人民币',
    NGN: '奈拉',
    JPY: '日元',
  }
  return names[currency] || currency
}

const convertToUSD = (amount, currency) => {
  const rates = props.exchangeRates
  const rateMap = {
    CNY: 1 / rates.usdToCny,
    NGN: 1 / rates.usdToNaira,
    JPY: 1 / rates.usdToJpy,
    USD: 1,
  }
  return amount * (rateMap[currency] || 1)
}

const getExchangeRate = (price, currency) => {
  const usdPrice = convertToUSD(price, currency)
  const rateInfo = {
    美元: usdPrice.toFixed(2),
    人民币: (usdPrice * props.exchangeRates.usdToCny).toFixed(2),
    奈拉: (usdPrice * props.exchangeRates.usdToNaira).toFixed(2),
    日元: (usdPrice * props.exchangeRates.usdToJpy).toFixed(2),
  }

  const message = `
    原始价格: ${getCurrencySymbol(currency)}${price} ${getCurrencyName(currency)}<br>
    汇率换算如下：<br>
    &nbsp;&nbsp;人民币: ${rateInfo.人民币}<br>
    &nbsp;&nbsp;美&nbsp;&nbsp;&nbsp;&nbsp;元: ${rateInfo.美元}<br>
    &nbsp;&nbsp;奈&nbsp;&nbsp;&nbsp;&nbsp;拉: ${rateInfo.奈拉}<br>
    &nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;元: ${rateInfo.日元}
  `
  return message.trim()
}
</script>

<style scoped>
.v-card-title {
  margin-bottom: 0.5rem;
}
.v-card-subtitle {
  margin-bottom: 0.25rem;
}
.v-avatar {
  flex-shrink: 0;
}
</style>
