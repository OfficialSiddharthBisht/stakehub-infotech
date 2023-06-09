const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const express = require("express");
const { default: mongoose, Schema } = require("mongoose");
const app = express();
const Orders = require("./models/orderModel");
const completedOrdersSchema = require("./models/completedOrderModel");



// config
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 3005;

// Connect Database
connectDatabase();

const server = app.listen(port, () => {
  console.log();
  console.log(`Server is running on port ${port}`);
})

stakehub();
async function stakehub(){
  let orders = await Orders.find();
  orders.sort(function (a, b) {
  if (a.buyerPrice < b.sellerPrice) {
    return -1;
  }
  if (a.buyerPrice > b.sellerPrice) {
    return 1;
  }
  if(a.sellerPrice > b.sellerPrice){
    return -1;
  }
  if(a.sellerPrice < b.sellerPrice){
    return 1;
  }
  return 0;
});

const completedOrders = [];
for (let i = 0; i < orders.length; i++) {
  for (let j = i + 1; j < orders.length; j++) {
    const buyerOrder = orders[i];
    const sellerOrder = orders[j];
    if (buyerOrder) {
      if (
        buyerOrder.buyerPrice >= sellerOrder.sellerPrice ||
        buyerOrder.buyerQty <= sellerOrder.sellerQty
      ) {
        // Match found
        const matchedQty = Math.min(buyerOrder.buyerQty, sellerOrder.sellerQty);
        const completedOrder = {
          price: sellerOrder.sellerPrice,
          qty: matchedQty,
        };
        completedOrders.push(completedOrder);

        // Update the remaining quantities
        orders[i].buyerQty -= matchedQty;
        orders[j].sellerQty -= matchedQty;

        // Remove the orders with zero quantities
        if (orders[i].buyerQty === 0) {
          orders.splice(i, 1);
          i--;
        }
        if (orders[j].sellerQty === 0) {
          orders.splice(j, 1);
          j--;
        }
      }
    }
  }
}
// console.log("Orders",orders);

await completedOrdersSchema.create(completedOrders)
let temp = await completedOrdersSchema.find();
console.log("completed orders",temp);
// console.log("completed orders",completedOrders);
}


// let orders = [
//   { buyerQty: 10, buyerPrice: 99, sellerPrice: 100, sellerQty: 20 },
//   { buyerQty: 50, buyerPrice: 98, sellerPrice: 101, sellerQty: 20 },
//   { buyerQty: 70, buyerPrice: 97, sellerPrice: 102, sellerQty: 130 },
//   { buyerQty: 80, buyerPrice: 96, sellerPrice: 103, sellerQty: 150 },
//   { buyerQty: 10, buyerPrice: 96, sellerPrice: 104, sellerQty: 70 },
// ];





