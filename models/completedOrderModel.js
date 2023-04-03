const mongoose = require('mongoose');

const completedOrderSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("completedOrders", completedOrderSchema);
