const BASE_URL = 'https://dummyjson.com';

const CATALOG_FIELDS = 'id,title,category,price,discountPercentage,rating,stock,thumbnail';

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchProducts() {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/products?limit=0&select=${CATALOG_FIELDS}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch products (status ${response.status})`);
    }
    const data = await response.json();
    return data.products;
  } catch {
    const { fallbackProducts } = await import('./fallbackData.js');
    return fallbackProducts;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${id} (status ${response.status})`);
    }
    return response.json();
  } catch {
    const { fallbackProducts } = await import('./fallbackData.js');
    const fallback = fallbackProducts.find(p => p.id === Number(id));
    if (fallback) return fallback;
    throw new Error(`Product ${id} not found`);
  }
}

export async function fetchCategories() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories (status ${response.status})`);
    }
    const data = await response.json();
    return data.map(c => ({ slug: c.slug, name: c.name }));
  } catch {
    const { fallbackCategories } = await import('./fallbackData.js');
    return fallbackCategories;
  }
}
