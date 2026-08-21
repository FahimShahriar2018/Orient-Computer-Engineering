import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please specify the product brand'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please assign a category'],
      ref: 'Category',
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please specify the regular price in BDT'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'Please provide a unique product SKU'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image'],
      default: [],
    },
    shortSpecs: {
      type: [String],
      default: [],
    },
    technicalSpecs: {
      type: Map,
      of: String,
      default: {},
    },
    warranty: {
      type: String,
      default: 'Official Brand Warranty',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDealOfTheDay: {
      type: Boolean,
      default: false,
    },
    dealEndTime: {
      type: Date,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      enum: ['', 'HOT', 'SALE', 'NEW', 'GAMING', 'OFFER', 'FEATURED'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for inStock boolean
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Text index for fast full-text searching
productSchema.index({
  title: 'text',
  brand: 'text',
  shortSpecs: 'text',
  sku: 'text',
});

const Product = mongoose.model('Product', productSchema);

export default Product;
