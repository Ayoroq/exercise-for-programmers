const prompt = require('prompt-sync')({sigint: true});

const taxRate = 0.055; // 5.5% tax rate

let totalItems;
if (process.argv[2] === undefined || isNaN(process.argv[2]) || Number(process.argv[2]) <= 0) {
    console.log("Please specify the number of items as a command line argument greater than 0.");
    process.exit(1);
} else {
  totalItems = Number(process.argv[2]);
}

const items = [];

for (let i = 1; i <= totalItems; i++) {
  const price = Number(prompt(`Enter the price of item ${i}: `));
  const quantity = Number(prompt(`Enter the quantity of item ${i}: `));
  if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
    console.log("Invalid input. Please enter positive numbers for price and quantity.");
    i--; // Decrement i to repeat this iteration
    continue;
  }
  items.push({ price, quantity });
}

let subTotal = 0;
let count = 1;
for (let item of items){
    item.total = Math.round((item.price * item.quantity)* 100) / 100;
    subTotal += item.total;
    console.log(`Item ${count}: ${item.quantity} × $${item.price} = $${item.total.toFixed(2)}`);
    count++;
}
const tax = Math.round((subTotal * taxRate) * 100) / 100;
const total = Math.round((subTotal + tax) * 100) / 100;

console.log(`Subtotal: $${subTotal}`);
console.log(`Tax: $${tax}`);
console.log(`Total: $${total}`);
