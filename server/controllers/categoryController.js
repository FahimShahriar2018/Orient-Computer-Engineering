import Category from '../models/Category.js';

// @desc    Get all product categories with subcategories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ orderIndex: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(404);
      return next(new Error(`Category not found for slug: ${req.params.slug}`));
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      return next(new Error('Category not found'));
    }

    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Category removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
