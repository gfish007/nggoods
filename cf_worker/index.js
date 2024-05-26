addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });

  async function handleRequest(request) {
    const url = new URL(request.url);
	const path = url.pathname;
    const method = request.method;

    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // 从 URL 获取 uid 参数
    const urlUid = url.searchParams.get('uid');

    if (url.pathname === '/check-uid') {
        const { uid } = await request.json();
        const isPrivilegedUser = (uid === '1122334455');
        return new Response(JSON.stringify({ isPrivilegedUser }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  } });
    }

    // 从请求头获取 uid
    const headerUid = request.headers.get('uid');

    // 使用 URL 中的 uid 或请求头中的 uid
    const uid = urlUid || headerUid;
    const isPrivilegedUser = (uid === '1122334455');

 
  if (path === '/products' && method === 'GET') {
    return handleGetProducts();
  } else if (path === '/product' && method === 'POST') {
    const body = await request.json();
    return handleAddProduct(body);
  } else if (path.startsWith('/product/') && method === 'DELETE') {
	if (!isPrivilegedUser) {
      return new Response('Forbidden', { status: 403 });
    }
    const id = path.split('/').pop();
    return handleDeleteProduct(id);
  } else if (path.startsWith('/product/') && method === 'PUT') {
	if (!isPrivilegedUser) {
      return new Response('Forbidden', { status: 403 });
    }
    const id = path.split('/').pop();
    const body = await request.json();
    return handleUpdateProduct(id, body);
  } else if (path.startsWith('/products/query') && method === 'GET') {
    const params = url.searchParams;
    const name = params.get('name');
    const reviewStatus = params.get('reviewStatus');
    const availabilityStatus = params.get('availabilityStatus');
    return handleQueryProducts(name, reviewStatus, availabilityStatus);
  } else if (path.startsWith('/approve-product/') && method === 'GET') {
	if (!isPrivilegedUser) {
      return new Response('Forbidden', { status: 403 });
    }
    const id = path.split('/').pop();
    return handleApproveProduct(id);
  } else if (path === '/products' && method === 'DELETE') {
	if (!isPrivilegedUser) {
      return new Response('Forbidden', { status: 403 });
    }
    return handleDeleteAllProducts();
  }

  return createResponse('Not Found', 404);
}

// 处理 OPTIONS 请求
function handleOptions() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Uid',
  };
  return new Response(null, { headers });
}

// 创建标准响应
function createResponse(body, status = 200, contentType = 'application/json') {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': contentType,
  };
  return new Response(body, { status, headers });
}

// 获取所有产品
async function handleGetProducts() {
  const keys = await PRODUCTS.list();
  const products = [];

  for (const key of keys.keys) {
    const product = await PRODUCTS.get(key.name, { type: 'json' });
    product.id = key.name; // 确保返回的产品数据包含 id
    products.push(product);
  }

  return createResponse(JSON.stringify(products));
}

// 复合查询产品
async function handleQueryProducts(name, reviewStatus, availabilityStatus) {
  const keys = await PRODUCTS.list();
  const products = [];

  for (const key of keys.keys) {
    const product = await PRODUCTS.get(key.name, { type: 'json' });
    product.id = key.name; // 确保返回的产品数据包含 id

    if (
      (!name || product.name.toLowerCase().includes(name.toLowerCase())) &&
      (!reviewStatus || product.reviewStatus === reviewStatus) &&
      (!availabilityStatus || product.availabilityStatus === availabilityStatus)
    ) {
      products.push(product);
    }
  }

  return createResponse(JSON.stringify(products));
}

// 添加新产品
async function handleAddProduct(product) {
  const id = crypto.randomUUID();
  product.id = id; // 确保返回的产品数据包含 id
  await PRODUCTS.put(id, JSON.stringify(product));
  await sendWeChatNotification(product, id);
  return createResponse(JSON.stringify(product), 201); // 返回包含 id 的产品数据
}

// 删除产品
async function handleDeleteProduct(id) {
  await PRODUCTS.delete(id);
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
}

// 删除所有产品
async function handleDeleteAllProducts() {
  const keys = await PRODUCTS.list();
  for (const key of keys.keys) {
    await PRODUCTS.delete(key.name);
  }
  return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
}

// 更新产品
async function handleUpdateProduct(id, updatedProduct) {
  updatedProduct.id = id; // 确保返回的产品数据包含 id
  await PRODUCTS.put(id, JSON.stringify(updatedProduct));
  return createResponse('Product updated');
}

// 审核通过产品
async function handleApproveProduct(id) {
  const product = await PRODUCTS.get(id, { type: 'json' });
  if (product) {
    product.reviewStatus = '审核通过';
    await PRODUCTS.put(id, JSON.stringify(product));
    return createResponse('Product approved');
  } else {
    return createResponse('Product not found', 404);
  }
}

// 发送企业微信机器人通知
async function sendWeChatNotification(product, id) {
  const approveLink = `https://product.fast.free.hr/approve-product/${id}?uid=1122334455`;
  const content = `
**新商品已提交审核：**

**商品名称：** ${product.name}
**原价：** ${product.originalPrice} ${product.originalCurrency}
**售价：** ${product.salePrice} ${product.saleCurrency}
**图片URL：** ${product.image}
**[点击此处审核通过](${approveLink})**
  `;

  await fetch('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXXXXXXXXXXXXXX', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        content
      }
    })
  });
}
