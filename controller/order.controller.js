const Order = require('../model/order.model');

// Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const { user_id, items, phoneNumber, address, email, customerName } = req.body;

    if (!phoneNumber || !address) {
      return res.status(400).json({
        'message': "Phone number and address are required!",
      })
    }

    const newOrder = new Order({
      user_id,
      items,
      phoneNumber,
      address,
      customerName,
      email
    });

    await newOrder.save();

    res.status(200).json({ message: 'Order created', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xem chi tiết đơn hàng
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).exec();

    if (order) {
      res.status(200).json({ order });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isPaid = async (req, res, next) => {
  const id = req.body.id;
  if (!id) return res.status(400).send('Order not found');

  try {
    // Update the matching document to set the `state` field to `true`
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isPaid: true },
      { new: true } // Return the updated document
    );

    return res.send(updatedOrder);
  } catch (error) {
    res.status(500).json({ 'message': 'Error!' })
  }
}

const removePaid = async (req, res, next) => {
  const id = req.body.id;
  if (!id) return res.status(400).send('Order not found');

  try {
    // Update the matching document to set the `state` field to `true`
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isPaid: false },
      { new: true } // Return the updated document
    );

    return res.send(updatedOrder);
  } catch (error) {
    res.status(500).json({ 'message': 'Error!' })
  }
}

module.exports = {
  createOrder,
  getOrderDetails,
  getOrders,
  isPaid,
  removePaid
};
