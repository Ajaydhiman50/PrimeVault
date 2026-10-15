import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';

const BROAD_CATEGORIES = {
  Electronics: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
  Clothing: ['tops', 'womens-dresses', 'womens-shoes', 'mens-shirts', 'mens-shoes'],
  Accessories: ['womens-watches', 'mens-watches', 'womens-bags', 'womens-jewellery', 'sunglasses'],
  'Home & Kitchen': ['furniture', 'home-decoration', 'kitchen-accessories'],
  'Beauty & Health': ['beauty', 'fragrances', 'skin-care'],
  Groceries: ['groceries'],
  'Sports & Outdoor': ['sports-accessories', 'motorcycle', 'vehicle'],
};

function getBroadCategory(slug) {
  for (const [broad, slugs] of Object.entries(BROAD_CATEGORIES)) {
    if (slugs.includes(slug)) return broad;
  }
  return 'Other';
}

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const broadCategories = useMemo(
    () => Object.keys(BROAD_CATEGORIES),
    []
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const productWithBroadCategory = useMemo(
    () =>
      products.map(p => ({
        ...p,
        broadCategory: getBroadCategory(p.category),
      })),
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products: productWithBroadCategory,
        categories,
        broadCategories,
        loading,
        error,
        getBroadCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
