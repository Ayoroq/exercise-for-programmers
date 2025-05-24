// Import prompt-sync for user input
const prompt = require('prompt-sync')({ sigint: true });

// Get order amount and state from user
let order = Number(prompt('What is the order amount? '));
let state = prompt('What is the state? ').toLowerCase().trim();

// Set tax rate constant
const taxRate = 0.055
let total = order

// Initialize output string
let output = ''

// Check if state is Wisconsin
if (state === 'wisconsin' || state === 'wi') {
    // Calculate and format tax
    let tax = order * taxRate
    total = order + tax
    tax = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tax)
    output += `The tax is ${tax}.\n`
}

// Format total as currency and display results
total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)
output += `The total is ${total}.`
console.log(output)