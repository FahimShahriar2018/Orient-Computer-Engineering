import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Create new customer order
// @route   POST /api/orders
// @access  Public / Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      return next(new Error('No order items provided.'));
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      res.status(400);
      return next(new Error('Please provide complete shipping address details.'));
    }

    let orderUser = req.user;
    let autoCreatedToken = null;

    if (!orderUser) {
      // Handle guest checkout by finding existing user or creating a customer account
      const cleanPhone = (shippingAddress.phone || '').replace(/[^0-9+]/g, '');
      const guestEmail = (
        shippingAddress.email ||
        `guest_${cleanPhone.replace(/[^0-9]/g, '') || Date.now()}@orientcomputers.com.bd`
      ).toLowerCase();

      let user = await User.findOne({
        $or: [
          { email: guestEmail },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      });

      if (!user) {
        const randomSecret = Math.random().toString(36).slice(-8);
        user = await User.create({
          name: shippingAddress.fullName,
          email: guestEmail,
          password: `Orient#${randomSecret}2026`,
          phone: cleanPhone || '',
          address: {
            division: shippingAddress.division || 'Dhaka',
            district: shippingAddress.district || 'Dhaka',
            street: shippingAddress.address || '',
            postalCode: shippingAddress.postalCode || '',
            country: 'Bangladesh',
          },
          role: 'customer',
        });
      }

      orderUser = user;
      autoCreatedToken = generateToken(user._id);
    }

    const order = new Order({
      user: orderUser._id,
      orderItems,
      shippingAddress,
      deliveryMethod: deliveryMethod || 'standard_inside_dhaka',
      paymentMethod: paymentMethod || 'COD',
      paymentResult: paymentResult || {},
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      discountPrice: Number(discountPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      isPaid: paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'card',
      paidAt: paymentMethod !== 'COD' ? new Date() : null,
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();

    // Decrement stock inventory for purchased products
    for (const item of orderItems) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -Number(item.qty || 1) },
        });
      }
    }

    const responsePayload = {
      success: true,
      message: 'Order created successfully',
      order: createdOrder,
    };

    if (autoCreatedToken) {
      responsePayload.token = autoCreatedToken;
      responsePayload.user = {
        _id: orderUser._id,
        name: orderUser.name,
        email: orderUser.email,
        role: orderUser.role,
        phone: orderUser.phone,
        address: orderUser.address,
        avatar: orderUser.avatar,
      };
    }

    res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order by public tracking number
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
export const trackOrder = async (req, res, next) => {
  try {
    const { trackingNumber } = req.params;

    const order = await Order.findOne({
      trackingNumber: trackingNumber.trim().toUpperCase(),
    }).select(
      'trackingNumber orderStatus statusHistory deliveryMethod shippingAddress itemsPrice shippingPrice totalPrice paymentMethod isPaid createdAt orderItems'
    );

    if (!order) {
      res.status(404);
      return next(new Error(`No order found matching tracking number: ${trackingNumber}`));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by Order ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      res.status(404);
      return next(new Error('Order not found.'));
    }

    // Verify ownership or admin access
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to access this order.'));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all store orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'All') {
      query.orderStatus = req.query.status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'id name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & add fulfillment note (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    if (!status) {
      res.status(400);
      return next(new Error('Please specify new order status'));
    }

    order.orderStatus = status;

    if (status === 'Delivered' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status} by admin`,
    });

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order status transitioned to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard analytics & KPI overview
// @route   GET /api/orders/analytics/overview
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    const totalProducts = await Product.countDocuments({});
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Aggregate Total Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      analytics: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
