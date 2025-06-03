// Import prompt-sync for user input
const prompt = require('prompt-sync')({sigint: true});

// Tax rates and rules for different states/provinces
const taxRates = {
    wisconsin: {
        base: 0.05,
        counties: {
            "eau claire": 0.005,
            dunn: 0.004
        }
    },
    illinois: {
        base: 0.08
    },
    ontario: {
        base: 0.13,
        cities: {
            toronto: 0.022,
            mississauga: 0.01
        }
    }
};

// State/Province code mapping
const stateValue = {
    wisconsin: 'wisconsin',
    illinois: 'illinois',
    ontario: 'ontario',
    il: 'illinois',
    wi: 'wisconsin',
    on: 'ontario'
}

// Get user input for order amount and location
let rawAmount, amount;
do {
    rawAmount = prompt("What is the order amount? ");
    amount = Number(rawAmount);
    if (rawAmount.trim() === "" || isNaN(amount) || amount < 0) {
        console.log("Invalid amount. Please enter a non-negative number.");
    }
} while (rawAmount.trim() === "" || isNaN(amount) || amount < 0);
let state = prompt("What is the state? ").toLowerCase();

let tax = 0.05; // Default tax rate

// Calculate applicable tax rate based on location
if (state in stateValue) {
    // Get base tax rate for state/province
    tax = taxRates[stateValue[state]].base;
    
    // Ask for city/county if applicable
    const subRegion = 'cities' in taxRates[stateValue[state]] ? 
        prompt('What city do you live in? ').toLowerCase() :
        'counties' in taxRates[stateValue[state]] ? 
        prompt('What county do you live in? ').toLowerCase() : '';

    // Add additional local tax if applicable
    const addedTax = 'cities' in taxRates[stateValue[state]] && 
        subRegion in taxRates[stateValue[state]].cities ?
        taxRates[stateValue[state]].cities[subRegion] : 
        'counties' in taxRates[stateValue[state]] && 
        subRegion in taxRates[stateValue[state]].counties ?
        taxRates[stateValue[state]].counties[subRegion] : 0;
    
    // Add local tax to base rate
    tax += addedTax;
}

// Calculate final amounts
let taxAmount = amount * tax;
let total = amount + taxAmount;

// Format currency outputs
const convertedTaxAmount = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: 'USD' }).format(taxAmount);
const convertedTotal = new Intl.NumberFormat('en-US', 
    { style: 'currency', currency: 'USD' }).format(total);

// Display results
console.log(`The tax is ${convertedTaxAmount}\nThe total is ${convertedTotal}`);