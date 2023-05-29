
const administratorRouter = require("./admin.router")
const userRouter = require("./user.router")
const productRouter = require("./product.router")
const categoryRouter = require("./category.router")
const cartRouter = require("./cart.router")
const orderRouter = require("./order.router")

function setRoute(server) {

    server.use('/api/admin', administratorRouter)

    server.use('/api/user', userRouter)

    server.use('/api/product', productRouter)

    server.use('/api/category', categoryRouter)

    server.use('/api/cart', cartRouter)

    server.use('/api/order', orderRouter)

}

module.exports = setRoute;