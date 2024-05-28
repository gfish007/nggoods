<template>
  <div>
    <v-dialog width="300px" scrollable v-model="showIconSelector">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn :size="btnSize" color="brown" prepend-icon="mdi-earth" text="选择图标" variant="outlined" v-bind="activatorProps"></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card>
          <v-card-title>
            选择图标
            <v-spacer></v-spacer>
            <!-- <v-btn icon @click="isActive.value = false">
              <v-icon>mdi-close</v-icon>
            </v-btn> -->
          </v-card-title>

          <v-divider class="mt-3"></v-divider>

          <v-card-text class="px-4" style="height: 300px;">
            <v-radio-group v-model="selectedIcon" column>
              <v-radio
                v-for="icon in sortedIcons"
                :key="icon.code"
                :label="icon.name"
                :value="icon.code"
                class="d-flex align-center"
              >
                <template v-slot:label>
                  <span class="icon iconfont" v-html="icon.code" style="margin-right: 8px;"></span>
                  {{ icon.name }}
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text @click="isActive.value = false">关闭</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="surface-variant" text variant="flat" @click="isActive.value = false">保存</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  btnSize: {
    type: String,
    default: 'medium'
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const icons = ref([
  { code: '&#xe601;', name: 'qq会员' },
  { code: '&#xe6c2;', name: 'Discord' },
  { code: '&#xe60d;', name: '默认图标' },
  { code: '&#xe60e;', name: 'youtobe' },
  { code: '&#xe671;', name: 'WPS' },
  { code: '&#xe60a;', name: '腾讯视频' },
  { code: '&#xe6d7;', name: 'app' },
  { code: '&#xe666;', name: '微博' },
  { code: '&#xea04;', name: 'spotify' },
  { code: '&#xe637;', name: '小火箭' },
  { code: '&#xe612;', name: '百度网盘' },
  { code: '&#xe695;', name: '阿里云盘' },
  { code: '&#xe602;', name: '优酷' },
  { code: '&#xe606;', name: '哔哩哔哩' },
  { code: '&#xe60b;', name: '网易云音乐' },
  { code: '&#xe60c;', name: '京东@2x' },
  { code: '&#xe600;', name: 'openai' },
  { code: '&#xe71c;', name: 'Claude-v1' },
  { code: '&#xe614;', name: 'QQ音乐' },
  { code: '&#xe607;', name: '微信读书' },
]);

const selectedIcon = ref(props.modelValue);
const showIconSelector = ref(false);

const sortedIcons = computed(() => {
  return icons.value.slice().sort((a, b) => a.name.localeCompare(b.name));
});

watch(selectedIcon, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
.iconfont {
  font-family: "iconfont" !important;
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
