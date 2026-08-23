import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Fetch products with dynamic multi-filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Keyword search (regex matching title, brand, sku, or shortSpecs)
    if (req.query.keyword) {
      const keywordRegex = { $regex: req.query.keyword.trim(), $options: 'i' };
      query.$or = [
        { title: keywordRegex },
        { brand: keywordRegex },
        { sku: keywordRegex },
        { shortSpecs: keywordRegex },
      ];
    }

    // 2. Category filtering (by ObjectId or slug)
    if (req.query.category) {
      if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        query.category = req.query.category;
      } else {
        const catSlug = req.query.category.trim().toLowerCase();
        const foundCategory = await Category.findOne({ slug: catSlug });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          query.category = new mongoose.Types.ObjectId();
        }
      }
    }

    // 3. Subcategory filtering
    if (req.query.subcategory) {
      const subSlug = req.query.subcategory.trim().toLowerCase();
      query.subcategory = { $regex: new RegExp(`^${subSlug}$`, 'i') };
    }

    // 4. Brand filtering (supports single or comma-separated list: "Asus,MSI,Intel")
    if (req.query.brand) {
      const brands = req.query.brand.split(',').map((b) => b.trim());
      query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, 'i')) };
    }

    // 5. Price range filtering in BDT (৳)
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 6. In-Stock filter
    if (req.query.inStock === 'true' || req.query.inStock === true) {
      query.stock = { $gt: 0 };
    }

    // 7. Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // 8. Sorting options
    let sortOptions = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1, numReviews: -1 };
          break;
        case 'popular':
          sortOptions = { numReviews: -1, rating: -1 };
          break;
        case 'discount':
          sortOptions = { discountPrice: -1 };
          break;
        case 'newest':
        default:
          sortOptions = { createdAt: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products, deal of the day, and new arrivals for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ isFeatured: true })
      .populate('category', 'name slug icon')
      .limit(8);

    const dealOfTheDay = await Product.findOne({ isDealOfTheDay: true })
      .populate('category', 'name slug icon');

    const newArrivals = await Product.find({ isNewArrival: true })
      .populate('category', 'name slug icon')
      .limit(8);

    const bestSellers = await Product.find({})
      .populate('category', 'name slug icon')
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      featured,
      dealOfTheDay,
      newArrivals,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter metadata (all available brands, price bounds, category counts)
// @route   GET /api/products/filters
// @access  Public
export const getProductFilterMeta = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand');
    const categories = await Category.find({}).sort({ orderIndex: 1, name: 1 });

    const priceBounds = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      brands: brands.sort(),
      categories,
      priceRange: {
        min: priceBounds[0]?.minPrice || 0,
        max: priceBounds[0]?.maxPrice || 500000,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ObjectId or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let product;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug icon subcategories');
    } else {
      product = await Product.findOne({ slug: idOrSlug }).populate('category', 'name slug icon subcategories');
    }

    if (!product) {
      res.status(404);
      return next(new Error('Product not found.'));
    }

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(4)
      .select('title slug price discountPrice images brand rating numReviews stock badge');

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product customer review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error('Product not found.'));
    }

    if (!rating || !comment) {
      res.status(400);
      return next(new Error('Please provide both rating score and review comment.'));
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      product.reviews.push(review);
    }

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review recorded successfully',
      rating: product.rating,
      numReviews: product.numReviews,
      reviews: product.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    // Generate slug from title if not explicitly provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      return next(new Error('Product not found'));
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Product removed from catalog',
    });
  } catch (error) {
    next(error);
  }
};
