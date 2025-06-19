const prompt = require('prompt-sync')({sigint: true});

if (process.argv[2] != "calculate_principal" && process.argv[2] && "calculate_compound" && process.argv[2] === null) {
    console.log("Usage: node compound.js <calculate_principal> or <calculate_compound>")
    process.exit(1);
}

let principal = null, rate = null, time = null, compound = null;
// Function to validate input
function input(a,b,c,d){
    return !(isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || a <= 0 || b < 0 || c < 0 || d <= 0);
}
let isValid = false;

if (process.argv[2] === "calculate_compound") {
        do {
        principal = Number(prompt("What is the principal amount? "));
        rate = Number(prompt("What is the rate? "));
        time = Number(prompt("What is the number of years? "));
        compound = Number(prompt("What is the number of times the interest is compounded per year? "));
        // Check if the input values are valid
        isValid = input(principal, rate, time, compound);
        if (isValid === false) {
            console.log("Invalid input. Please enter positive numbers for principal, rate, and time.");
        }
    }while (isValid === false);


    let amount = principal * Math.pow((1 + (rate / (compound * 100))), (compound * time));

    // Format amount as US currency
    amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    console.log(`$${principal} invested at ${rate}% for ${time} years compounded ${compound} times per year is ${amount}.`);
}

if (process.argv[2] === "calculate_principal") {
    do {
        amount = Number(prompt("What is the final amount? "));
        rate = Number(prompt("What is the rate? "));
        time = Number(prompt("What is the number of years? "));
        compound = Number(prompt("What is the number of times the interest is compounded per year? "));
        // Check if the input values are valid
        isValid = input(amount, rate, time, compound);
        if (isValid === false) {
            console.log("Invalid input. Please enter positive numbers for final amount, rate, and time.");
        }
    }while (isValid === false);

    let principal = amount / Math.pow((1 + (rate / (compound * 100))), (compound * time));

    // Format amount as US currency
    principal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(principal);
    console.log(`The principal amount needed to reach $${amount} after ${time} years with a \n${rate}% interest rate compounded ${compound} times per year is ${principal}.`);
}

