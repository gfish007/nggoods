// utils/fetchFunctions.js
import config from '../config'

// 上传图片到服务器
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${config.imageBaseUrl}/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return `${config.imageBaseUrl}${data[0].src}`; // 追加图片域名
}


// 获取用户权限
export async function fetchUserPrivileges(uid) {
  const response = await fetch(`${config.apiBaseUrl}/check-uid?uid=${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user privileges')
  }

  return await response.json()
}

// 获取商品列表
export async function fetchProducts(query = {}) {
  const response = await fetch(`${config.apiBaseUrl}/products?${new URLSearchParams(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'uid': config.uid
    }
  });
  return await response.json();
}

// 新增商品
export async function addProduct(product) {
  const response = await fetch(`${config.apiBaseUrl}/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'uid': config.uid
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  return await response.json();
}

// 更新商品
export async function modifiedProduct(product) {
  const response = await fetch(`${config.apiBaseUrl}/product/${product.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'uid': config.uid
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    throw new Error('Failed to add product');
  }
  // return await response.json();
  return;
}

// 删除商品
export async function deleteProductById(productId) {
  const response = await fetch(`${config.apiBaseUrl}/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'uid': config.uid
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

// 获取汇率
export async function fetchExchangeRates() {
  const apiKey = config.exchangeRateApiKey;
  const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  const data = await response.json();
  return {
    usdToNaira: data.conversion_rates.NGN,
    usdToCny: data.conversion_rates.CNY,
    usdToJpy: data.conversion_rates.JPY
  };
}
