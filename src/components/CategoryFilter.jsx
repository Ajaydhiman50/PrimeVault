import { useProducts } from '../context/ProductContext';

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  broadCategories,
  categories,
  label = 'Category',
}) {
  const { categories: allCategories } = useProducts();

  const items = categories || broadCategories || allCategories;

  const formatName = (item) => {
    if (typeof item === 'string') return item;
    return item.name || item.slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const getValue = (item) => {
    if (typeof item === 'string') return item;
    return item.slug || item.name || item;
  };

  return (
    <div className="category-filter">
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
      >
        <option value="">All {label === 'Category' ? 'Categories' : label + 's'}</option>
        {items.map(item => (
          <option key={getValue(item)} value={getValue(item)}>
            {formatName(item)}
          </option>
        ))}
      </select>
    </div>
  );
}
