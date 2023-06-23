const Cart = require('../model/cart.model');

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity, price, title, imageUrl } = req.body;

        const cart = await Cart.findOne({ user_id });
        if (cart) {
            // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng và giá
            const existingItem = cart.items.find(item => item.product_id == product_id);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.price = price;
            } else {
                cart.items.push({ product_id, quantity, price, title, imageUrl });
            }
            cart.updated_at = Date.now();
            await cart.save();
        } else {
            // Tạo giỏ hàng mới nếu chưa tồn tại
            const newCart = new Cart({
                user_id,
                items: [{ product_id, quantity, price, title, imageUrl }]
            });
            await newCart.save();
        }

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        const cart = await Cart.findOne({ user_id });

        if (cart) {
            const existingItemIndex = cart.items.findIndex(item => item.product_id == product_id);

            if (existingItemIndex !== -1) {
                const existingItem = cart.items[existingItemIndex];
                if (quantity === 0) {
                    cart.items.splice(existingItemIndex, 1);
                } else {
                    existingItem.quantity = quantity;
                }
                cart.updated_at = Date.now();
                await cart.save();
                res.status(200).json({ message: 'Cart item quantity updated' });
            } else {
                res.status(404).json({ error: 'Cart item not found' });
            }
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        const cart = await Cart.findOne({ user_id });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product_id == product_id);
            if (itemIndex !== -1) {
                cart.items.splice(itemIndex, 1);
                cart.updated_at = Date.now();
                await cart.save();
                res.status(200).json({ message: 'Cart item removed' });
            } else {
                res.status(404).json({ error: 'Cart item not found' });
            }
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCartDetails = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ user_id: userId }).exec();

        if (cart) {
            res.status(200).json({ cart });
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa tất cả các sản phẩm trong giỏ hàng của user
const emptyCart = async (req, res) => {
    try {
        const { user_id } = req.params;

        const cart = await Cart.findOne({ user_id });
        if (cart) {
            cart.items = []; // Xóa tất cả các sản phẩm trong giỏ hàng
            cart.updated_at = Date.now();
            await cart.save();
            res.status(200).json({ message: 'Cart emptied' });
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    getCartDetails,
    emptyCart
};
