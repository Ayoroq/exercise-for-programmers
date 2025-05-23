// Import prompt-sync for user input
const prompt = require('prompt-sync')({ sigint: true });

// Initialize variables for principal, rate, and time
let principal = null, rate = null, time = null;

// Loop until valid values are entered
do {
    principal = Number(prompt("Enter the principal: "));
    rate = Number(prompt("Enter the rate of interest percentage: "));
    time = Number(prompt("Enter the number of years: "));
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate < 0 || time < 0) {
        console.log("Invalid input. Please enter positive numbers for principal, rate, and time.");
    }
} while (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate < 0 || time < 0);

// Function to calculate amount using simple interest
function calculateSimpleInterest(principal, rate, time) {
    return principal + (principal * rate * time / 100);
}

// Calculate and display the investment value each year
for (let i = 1; i <= time; i++) {
    let interest = calculateSimpleInterest(principal, rate, i);
    // Format amount as US currency
    interest = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(interest);
    console.log(`After ${i} year(s) at ${rate}%, the invesment will be worth ${interest}.`);
}