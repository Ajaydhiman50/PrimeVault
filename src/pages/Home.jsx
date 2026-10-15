import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Loading from '../components/Loading';
import Button from '../components/Button';

export default function Home() {
  const { products, categories, broadCategories, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBroadCategory, setSelectedBroadCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  let filteredProducts = products;

  // Filter by broad category
  if (selectedBroadCategory) {
    filteredProducts = filteredProducts.filter(
      p => p.broadCategory === selectedBroadCategory
    );
  }

  // Filter by sub-category
  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.category === selectedCategory
    );
  }

  // Filter by search term
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Sort by price
  if (sortOrder === 'low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  // Default sort: clothing first
  if (!sortOrder) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aIsClothing = a.broadCategory === 'Clothing' ? 0 : 1;
      const bIsClothing = b.broadCategory === 'Clothing' ? 0 : 1;
      return aIsClothing - bIsClothing;
    });
  }

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Something went wrong</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const subCategories = selectedBroadCategory
    ? categories.filter(c => products.some(p => p.category === c.slug && p.broadCategory === selectedBroadCategory))
    : categories;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Our Products</h1>
        <p>Browse our collection of {products.length} amazing products</p>
      </div>

      <div className="home-controls">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryFilter
          selectedCategory={selectedBroadCategory}
          onCategoryChange={setSelectedBroadCategory}
          broadCategories={broadCategories}
          label="Category"
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={subCategories}
          label="Sub-Category"
        />
        <div className="sort-filter">
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
