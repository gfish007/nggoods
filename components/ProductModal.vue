<template>
  <v-dialog :model-value="localShow" @update:model-value="updateShow" max-width="800px">
    <v-card>
      <v-card-title>{{ isEdit ? '编辑商品' : '新增商品' }}</v-card-title>
      <v-card-text>
        <v-form ref="productForm" v-model="valid">
          <v-text-field
            v-model="product.name"
            label="商品名称"
            :rules="[v => !!v || '此字段为必填项']"
            variant="outlined"
            dense
            required
          />
          
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="product.originalPrice"
                label="原价"
                type="number"
                :rules="[v => !!v || '此字段为必填项']"
                variant="outlined"
                dense
                required
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="product.originalCurrency"
                :items="currencies"
                label="原价币种"
                :rules="[v => !!v || '此字段为必填项']"
                variant="outlined"
                dense
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="product.discountPrice"
                label="外区优惠价"
                type="number"
                variant="outlined"
                dense
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="product.discountCurrency"
                :items="currencies"
                label="优惠价币种"
                variant="outlined"
                dense
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="product.salePrice"
                label="建议售价"
                type="number"
                :rules="[v => !!v || '此字段为必填项']"
                variant="outlined"
                dense
                required
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="product.saleCurrency"
                :items="currencies"
                label="售价币种"
                :rules="[v => !!v || '此字段为必填项']"
                variant="outlined"
                dense
                required
              />
            </v-col>
          </v-row>

          <v-file-input
            v-model="imageFile"
            label="商品图片"
            @change="handleImageUpload"
            :rules="[v => !!v || '此字段为必填项']"
            variant="outlined"
            dense
            required
            :error-messages="imageError"
          />
          <v-img :src="product.image" alt="商品图片" v-if="product.image" class="mt-2" max-height="100" style="margin-bottom: 10px;" />

          <label class="d-block mt-3">联系方式</label>
          <div id="contactInfoEditor"></div>

          <label class="d-block mt-3">教程</label>
          <div id="tutorialEditor"></div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="flat" color="primary" @click="submitProduct">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, nextTick } from 'vue'
import { uploadImage, addProduct, modifiedProduct } from '~/utils/fetchFunctions'

// 动态导入 Vditor
let Vditor
if (process.client) {
  import('vditor').then(module => {
    Vditor = module.default
  })
}

import 'vditor/dist/index.css'

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  product: Object,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const localShow = ref(props.modelValue)
const currencies = ['USD', 'CNY', 'NGN', 'JPY']
const imageFile = ref(null)
const imageError = ref('')
const valid = ref(false)
const productForm = ref(null)

let contactInfoEditor
let tutorialEditor

watch(() => props.modelValue, async (newVal) => {
  localShow.value = newVal
  if (newVal && !props.isEdit) {
    resetForm()
  }
  if (newVal) {
    await nextTick()
    initEditors()
  }
})

const updateShow = (value) => {
  localShow.value = value
  emit('update:modelValue', value)
}

const resetForm = () => {
  imageFile.value = null
  imageError.value = ''
  props.product.image = ''
  // 重置其他字段
  props.product.name = ''
  props.product.originalPrice = ''
  props.product.originalCurrency = ''
  props.product.salePrice = ''
  props.product.saleCurrency = ''
  props.product.discountPrice = ''
  props.product.discountCurrency = ''
  props.product.contactInfo = ''
  props.product.tutorial = ''
}

const handleImageUpload = async () => {
  imageError.value = ''
  if (imageFile.value) {
    try {
      const imageUrl = await uploadImage(imageFile.value)
      props.product.image = imageUrl
    } catch (error) {
      imageError.value = '图片上传失败，请重试。'
    }
  }
}

const submitProduct = async () => {
  const isFormValid = (await productForm.value.validate()).valid
  const isImageUploaded = !!props.product.image

  if (isFormValid && isImageUploaded) {
    props.product.contactInfo = contactInfoEditor.getValue()
    props.product.tutorial = tutorialEditor.getValue()
    if (props.product.id) {
      await modifiedProduct(props.product)
    } else {
      await addProduct(props.product)
    }
    emit('submit', props.product)
    updateShow(false)
  } else {
    if (!isImageUploaded) {
      imageError.value = '请上传商品图片'
    }
  }
}

const initEditors = () => {
  contactInfoEditor = new Vditor('contactInfoEditor', {
    height: 200,
    value: props.product.contactInfo || '',
    mode: 'ir',
    placeholder: '在此输入联系方式...',
    toolbarConfig: {
      pin: true,
    },
    cache: {
      id: 'contactInfoEditor',
      enable: false,
    },
  })

  tutorialEditor = new Vditor('tutorialEditor', {
    height: 200,
    value: props.product.tutorial || '',
    mode: 'ir',
    placeholder: '在此输入教程...',
    toolbarConfig: {
      pin: true,
    },
    cache: {
      id: 'tutorialEditor',
      enable: false,
    },
  })
}

onMounted(() => {
  if (localShow.value) {
    initEditors()
  }
})
</script>

<style scoped>
.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}
.input-field {
  max-height: 40px; /* 调整输入框高度 */
  font-size: 14px;  /* 调整输入框字体大小 */
}
.vditor {
  margin-top: 10px;
}
</style>
