// src/main.js
import { createApp } from 'vue'
import App from './app.vue'
import { fetchUserPrivileges } from './utils/fetchFunctions'
import config from './config'

const app = createApp(App)

// 从 URL 获取 uid 参数
const getUidFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('uid')
}

// 检查用户是否为特权用户
const checkUserPrivileges = async (uid) => {
  try {
    const privileges = await fetchUserPrivileges(uid)
    if (privileges.isPrivileged) {
      config.isPrivileged = true
      config.uid = uid
    } else {
      config.isPrivileged = false
    }
  } catch (error) {
    console.error('Failed to fetch user privileges:', error)
    config.isPrivileged = false
  }
}

// 初始化应用
const initApp = async () => {
  console.log(11123)
  const uid = getUidFromUrl()
  if (uid) {
    await checkUserPrivileges(uid)
  }
  app.mount('#app')
}

initApp()
