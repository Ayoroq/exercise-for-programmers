const prompt = require("prompt-sync")();

function getValues() {
    while (true) {
        const bill = parseFloat(prompt("Enter the bill amount: "));
        const tipPercentage = parseFloat(prompt("Enter the tip percentage (e.g., 15 for 15%): "));
        if (!isNaN(bill) && !isNaN(tipPercentage) && bill > 0 && tipPercentage >= 0) {
            return { bill, tipPercentage };
        }
        console.log("Invalid input. Please enter positive numbers for bill and tip percentage.");
    }
}

function calculateTip(bill, tipPercentage) {
  const tip = bill * (tipPercentage / 100);
  const total = Math.round(bill + tip) * 100 / 100;
  return { tip, total };
}

// Main program
const { bill, tipPercentage } = getValues();
const { tip, total } = calculateTip(bill, tipPercentage);


console.log(`Tip: $${tip}`);
console.log(`Total: $${total}`);