<template>
  <v-dialog :model-value="localShow" @update:model-value="updateShow" max-width="800px">
    <v-card :title="isEdit ? '编辑商品' : '新增商品'">
       <v-divider class="mt-1"></v-divider>
      <v-card-text>
        <v-form ref="productForm" v-model="valid">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="product.name"
                label="商品名称"
                :rules="[v => !!v || '此字段为必填项']"
                variant="outlined"
                dense
                required
              />
            </v-col>
            <!-- 其他代码保持不变 -->
            <v-col cols="6">
              <v-autocomplete
                v-model="product.country"
                :items="chineseCountries"
                label="国家"
                item-title="chinese"
                item-value="chinese"
                :search-input.sync="search"
                :filter="customFilter"
                variant="outlined"
                dense
                required
              >
              <!-- <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.raw.chinese"
                ></v-chip>
              </template> -->
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.state"
                  :title="item.raw.chinese"
                ></v-list-item>
              </template>
              </v-autocomplete>

            </v-col>
          </v-row>
          
          <!-- 中、大屏幕显示 -->
          <v-row class="d-none d-md-flex">
            <v-col cols="4">
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
            <v-col cols="2">
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
            <v-col cols="4">
              <v-text-field
                v-model="product.discountPrice"
                label="外区优惠价"
                type="number"
                variant="outlined"
                dense
              />
            </v-col>
            <v-col cols="2">
              <v-select
                v-model="product.discountCurrency"
                :items="currencies"
                label="优惠价币种"
                variant="outlined"
                dense
              />
            </v-col>
          </v-row>
          <v-row class="d-none d-md-flex">
            <v-col cols="4">
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
            <v-col cols="2">
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
            <v-col cols="4">
              <IconSelector v-model="product.selectedIcon" btn-size="x-large" />
            </v-col>
            <v-col cols="2" v-if="product.selectedIcon" class="icon-preview">
              <span class="icon iconfont" v-html="product.selectedIcon"></span>
            </v-col>
          </v-row>
          <!-- 中、大屏幕显示END -->

          <!-- 小屏幕显示 -->
          <v-row class="d-flex d-md-none">
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

          <v-row class="d-flex d-md-none">
           
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

          <v-row class="d-flex d-md-none">
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

          <v-row class="d-flex d-md-none">
            <v-col cols="8">
              <IconSelector v-model="product.selectedIcon" btn-size="x-large" />
            </v-col>
            <v-col cols="4" v-if="product.selectedIcon" class="icon-preview">
              <span class="icon iconfont" v-html="product.selectedIcon"></span>
            </v-col>
          </v-row>
          <!-- 小屏幕显示END -->

          <v-divider class="mt-3"></v-divider>
          <label class="d-block mt-3" for="contactInfoEditor">联系方式(有想出售的可以填下):</label>
          <div id="contactInfoEditor"></div>
          <label class="d-block mt-3" for="tutorialEditor">教程</label>
          <div id="tutorialEditor"></div>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="tonal" text @click="updateShow(false)">关闭</v-btn>
        
        <v-btn variant="flat" color="primary" @click="submitProduct">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted, nextTick } from 'vue'
import { uploadImage, addProduct, modifiedProduct } from '~/utils/fetchFunctions'
import 'vditor/dist/index.css'
import IconSelector from './IconSelector.vue';
import { countries } from 'countries-list';
import { chineseCountries } from '~/components/countries.js' // 根据实际路径进行修改

// 动态导入 Vditor
let Vditor
if (process.client) {
  import('vditor').then(module => {
    Vditor = module.default
  })
}

const props = defineProps({
  modelValue: Boolean,
  isEdit: Boolean,
  product: Object,
})

const emit = defineEmits(['update:modelValue', 'submit', 'changeLoading'])

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

const search = ref('');
const countriesList = ref([])

onMounted(() => {
  // countriesList.value = Object.keys(countries).map(code => ({
  //   code,
  //   name: countries[code].name
  // }));
  countriesList.value = Object.keys(countries).map(code => countries[code].name);
})

const resetForm = () => {
  imageFile.value = null
  imageError.value = ''
  props.product.image = ''
  props.product.selectedIcon = '&#xe60d;'
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
  props.product.country = '尼日利亚'
}

/**
 * 自定义过滤器函数
 *
 * @param item 过滤目标对象
 * @param queryText 查询文本
 * @param itemText 目标对象的文本字段
 * @returns 如果目标对象的文本字段包含查询文本，则返回true，否则返回false
 */
const customFilter = (item, queryText, itemText) => {
  const text = itemText.toLowerCase();
  const query = queryText.toLowerCase();
  return text.indexOf(query) > -1;
};

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
  try{
    if (isFormValid) {
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
    // if (!isImageUploaded) {
    //   imageError.value = '请上传商品图片'
    // }
  }
  }finally {
    emit('changeLoading', false)
  }
  
}

const initEditors = () => {
  contactInfoEditor = new Vditor('contactInfoEditor', {
    height: 300,
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
    height: 300,
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

/* 你的样式 */
.icon-preview {
  display: inline-block;
  font-size: 34px;
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 34px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
