import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  X,
  RotateCcw,
  Search,
  Star,
  Check,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { formatPrice } from '../utils/formatters';
import api from '../services/api';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Metadata from backend for filter sidebar
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 400000 });

  // Selected filters from URL search params
  const categoryParam = searchParams.get('category') || '';
  const subcategoryParam = searchParams.get('subcategory') || '';
  const brandParam = searchParams.get('brand') || '';
  const keywordParam = searchParams.get('keyword') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const ratingParam = searchParams.get('rating') || '';
  const sortParam = searchParams.get('sort') || 'newest';

  // UI state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState(minPriceParam);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam);

  // Load filter metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get('/products/filters');
        if (res.data.success) {
          setAvailableBrands(res.data.brands || []);
          setCategories(res.data.categories || []);
          if (res.data.priceRange) {
            setPriceBounds(res.data.priceRange);
          }
        }
      } catch (err) {
        console.error('Error fetching filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.total);
          setPage(res.data.page);
          setPages(res.data.pages);
        }
      } catch (err) {
        console.error('Error fetching catalog products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Atomic helper to update multiple or single search params without race conditions
  const updateFilters = (updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined || value === false) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      next.delete('page'); // Reset to page 1 on filter change
      return next;
    });
  };

  const updateFilter = (key, value) => {
    updateFilters({ [key]: value });
  };

  const toggleBrand = (brandName) => {
    const currentBrands = brandParam ? brandParam.split(',') : [];
    let updated;
    if (currentBrands.includes(brandName)) {
      updated = currentBrands.filter((b) => b !== brandName);
    } else {
      updated = [...currentBrands, brandName];
    }
    updateFilter('brand', updated.join(','));
  };

  const handleApplyPrice = (e) => {
    e.preventDefault();
    updateFilters({
      minPrice: localMinPrice || '',
      maxPrice: localMaxPrice || '',
    });
  };

  const handleClearAllFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const selectedBrands = brandParam ? brandParam.split(',') : [];

  // Sidebar Filter Content component
  const FilterSidebarContent = () => (
    <div className="space-y-6 text-xs text-slate-300">
      {/* 1. Header & Clear Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="font-heading font-bold text-sm text-white uppercase tracking-wider flex items-center space-x-2">
          <Filter className="h-4 w-4 text-blue-500" />
          <span>Filters</span>
        </span>
        <button
          onClick={handleClearAllFilters}
          className="text-[11px] text-slate-400 hover:text-rose-400 font-semibold flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 2. Categories Hierarchy */}
      <div className="space-y-3">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Department
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => updateFilters({ category: '', subcategory: '' })}
            className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
              !categoryParam
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <span>All Hardware</span>
            {!categoryParam && <Check className="h-3.5 w-3.5" />}
          </button>
          {categories.map((cat) => {
            const isCatActive = categoryParam === cat.slug || categoryParam === cat._id;
            return (
              <div key={cat.slug || cat._id} className="space-y-1">
                <button
                  onClick={() => {
                    updateFilters({ category: cat.slug, subcategory: '' });
                  }}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    isCatActive
                      ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{cat.name}</span>
                  {isCatActive && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </button>

                {/* Subcategories */}
                {isCatActive && cat.subcategories?.length > 0 && (
                  <div className="pl-3.5 space-y-1 border-l border-slate-800 ml-2 mt-1">
                    {cat.subcategories.map((sub) => {
                      const isSubActive = subcategoryParam === sub.slug;
                      return (
                        <button
                          key={sub.slug}
                          onClick={() => updateFilter('subcategory', isSubActive ? '' : sub.slug)}
                          className={`w-full text-left py-1 px-2 rounded-md text-[11px] transition-colors flex items-center justify-between ${
                            isSubActive
                              ? 'text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <span>• {sub.name}</span>
                          {isSubActive && <Check className="h-3 w-3 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Brands Checkboxes */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Brand
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const checked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300 hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleBrand(brand)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className={checked ? 'text-blue-400 font-semibold' : ''}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Price Range Filter (in ৳ BDT) */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Price Range (৳ BDT)
        </h4>
        <form onSubmit={handleApplyPrice} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Min ৳</label>
              <input
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Max ৳</label>
              <input
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                placeholder="500,000"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-blue-300 font-semibold rounded-lg text-xs transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* 5. Availability (In Stock) */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Availability
        </h4>
        <label className="flex items-center space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateFilter('inStock', e.target.checked)}
            className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 h-4 w-4"
          />
          <span className="text-xs text-slate-300">Exclude Out of Stock</span>
        </label>
      </div>

      {/* 6. Customer Rating */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => updateFilter('rating', ratingParam === String(stars) ? '' : stars)}
              className={`w-full text-left py-1.5 px-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                ratingParam === String(stars)
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-[11px]">& Up</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link to="/shop" className="hover:text-blue-400 transition-colors text-slate-300">
          Hardware Catalog
        </Link>
        {categoryParam && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-blue-400 font-semibold uppercase">{categoryParam}</span>
          </>
        )}
        {subcategoryParam && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-slate-200 uppercase">{subcategoryParam}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (Left Col) */}
        <aside className="hidden lg:block lg:col-span-1 p-5 rounded-2xl bg-[#0F172A] border border-slate-800 sticky top-28 shadow-md">
          <FilterSidebarContent />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs bg-[#0F172A] border-r border-slate-800 h-full overflow-y-auto p-5 shadow-2xl">
              <div className="flex justify-end pb-3">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterSidebarContent />
            </div>
            <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
          </div>
        )}

        {/* Main Catalog View (Right 3 Cols) */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Control Bar */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Mobile Filter Button & Counter */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-blue-400 flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <div className="text-xs text-slate-300">
                Showing <span className="font-bold text-white">{products.length}</span> of{' '}
                <span className="font-bold text-blue-400">{total}</span> hardware items
              </div>
            </div>

            {/* View Switcher & Sorting */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortParam}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Grid / List Switcher */}
              <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {(categoryParam || subcategoryParam || selectedBrands.length > 0 || keywordParam || minPriceParam || maxPriceParam || inStockParam || ratingParam) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium mr-1">Active:</span>

              {keywordParam && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-blue-300">
                  <span>Search: "{keywordParam}"</span>
                  <button onClick={() => updateFilter('keyword', '')} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              )}

              {categoryParam && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-blue-300">
                  <span>Department: {categoryParam}</span>
                  <button onClick={() => updateFilters({ category: '', subcategory: '' })} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              )}

              {subcategoryParam && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-blue-300">
                  <span>Subcategory: {subcategoryParam}</span>
                  <button onClick={() => updateFilter('subcategory', '')} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-blue-300">
                  <span>{b}</span>
                  <button onClick={() => toggleBrand(b)} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              ))}

              {inStockParam && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                  <span>In Stock Only</span>
                  <button onClick={() => updateFilter('inStock', false)} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
              )}

              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold ml-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid / List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-12 text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Search className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-white">No matching products found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your filter keywords, selecting a different department, or clearing active filters.
                </p>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode="list" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              {Array.from({ length: pages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter('page', pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
