import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Sparkles,
  ChevronRight,
  Share2,
  Cpu,
  Zap,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/formatters';
import ProductCard from '../components/Product/ProductCard';
import api from '../services/api';

export default function ProductDetailPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews'

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${idOrSlug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          if (res.data.product.images?.length > 0) {
            setSelectedImage(res.data.product.images[0]);
          }
        }
      } catch (err) {
        console.error('Error loading product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-400">
        <div className="h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading authentic hardware specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-white">Product Not Found</h2>
        <p className="text-sm text-slate-400">The requested computer hardware item does not exist or has been discontinued.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl">
          Back to Store Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const inStock = product.stock > 0;
  const finalPrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

  const savings = product.discountPrice && product.discountPrice < product.price
    ? product.price - product.discountPrice
    : 0;

  const discountPercent = savings > 0
    ? Math.round((savings / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, false);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      const res = await api.post(`/products/${product._id}/reviews`, { rating, comment });
      if (res.data.success) {
        setProduct((prev) => ({
          ...prev,
          rating: res.data.rating,
          numReviews: res.data.numReviews,
          reviews: res.data.reviews,
        }));
        setComment('');
        setReviewMessage({ type: 'success', text: 'Thank you! Your verified review has been published.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error submitting review';
      setReviewMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link to="/shop" className="hover:text-cyan-400">Hardware Catalog</Link>
        {product.category?.name && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-cyan-400">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-slate-200 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Col: High-Res Image Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          <div className="h-80 sm:h-96 w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 flex items-center justify-center relative overflow-hidden shadow-xl">
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-extrabold uppercase tracking-wider">
                {product.badge}
              </span>
            )}
            <img
              src={selectedImage || product.images?.[0] || 'https://via.placeholder.com/400'}
              alt={product.title}
              className="max-h-full max-w-full object-contain rounded-xl"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images?.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl p-1 bg-slate-900 border transition-all flex-shrink-0 flex items-center justify-center ${
                    selectedImage === img
                      ? 'border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Product Info, Pricing & Purchase Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3 pb-6 border-b border-slate-800">
            {/* Brand & SKU */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-cyan-400 uppercase tracking-wider">{product.brand}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">SKU: {product.sku}</span>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                  inWishlist
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${inWishlist ? 'fill-rose-400' : ''}`} />
                <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Rating & Availability */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-amber-400 text-sm">
                  {product.rating ? Number(product.rating).toFixed(1) : '5.0'}
                </span>
                <span className="text-slate-400">({product.numReviews || 0} verified reviews)</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`h-2.5 w-2.5 rounded-full ${inStock ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`font-semibold ${inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {inStock ? `In Stock (${product.stock} units available)` : 'Currently Out of Stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-orange-400">
                {formatPrice(finalPrice)}
              </span>
              {savings > 0 && (
                <>
                  <span className="text-sm sm:text-base text-slate-500 line-through">
                    Regular: {formatPrice(product.price)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                    Save {formatPrice(savings)} ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Price includes all official import duties and VAT.</p>
          </div>

          {/* Quick Specifications Bullet Points */}
          {product.shortSpecs && product.shortSpecs.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Key Hardware Highlights</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {product.shortSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start space-x-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <Check className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Purchase Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-slate-300">Quantity:</span>
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-sm font-bold text-white px-2 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                disabled={!inStock}
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>

              <button
                disabled={!inStock}
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />
                <span>Buy Now (Instant Checkout)</span>
              </button>
            </div>
          </div>

          {/* Official Warranty & Assurances Banner */}
          <div className="p-4 rounded-xl bg-[#0B1120] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span>{product.warranty || 'Official Brand Warranty'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-orange-400 flex-shrink-0" />
              <span>Fast Shipping in BD</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Tabs: Technical Specs Table & Customer Reviews */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        {/* Tab Headers */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all ${
              activeTab === 'specs'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Technical Specifications Table
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all ${
              activeTab === 'reviews'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {/* Tab 1: Comprehensive Technical Specifications Table */}
        {activeTab === 'specs' && (
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-heading font-bold text-white flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <span>Complete Hardware Technical Data</span>
            </h3>

            {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-800">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(product.technicalSpecs).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-slate-900/80' : 'bg-[#0F172A]'}>
                        <td className="py-3 px-4 font-bold text-cyan-300 w-1/3 border-r border-slate-800">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-slate-200">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Standard technical specifications apply.</p>
            )}
          </div>
        )}

        {/* Tab 2: Verified Customer Reviews & Submission */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-heading font-bold text-white">Verified Customer Ratings</h3>

              {product.reviews?.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0F172A] border border-slate-800 text-center text-slate-400 text-xs">
                  No customer reviews yet. Be the first to review this genuine product!
                </div>
              ) : (
                <div className="space-y-3">
                  {product.reviews.map((rev, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                            {rev.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{rev.name}</div>
                            <div className="text-[10px] text-slate-500">{formatDate(rev.createdAt)}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3.5 w-3.5 ${
                                idx < rev.rating ? 'fill-amber-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review Submission Form (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <h4 className="font-heading font-bold text-base text-white">Write a Product Review</h4>
              <p className="text-xs text-slate-400">
                Share your hardware testing results and experiences with the community.
              </p>

              {reviewMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    reviewMessage.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{reviewMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={5}>5 Stars - Outstanding Performance</option>
                    <option value={4}>4 Stars - Great Hardware</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Subpar</option>
                    <option value={1}>1 Star - Poor Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe build quality, temperatures, framerates, delivery speed..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Recommendation Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-slate-800">
          <div>
            <h3 className="text-xl font-heading font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span>Frequently Bought Together & Related Gear</span>
            </h3>
            <p className="text-xs text-slate-400">Compatible components recommended for this configuration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} viewMode="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
