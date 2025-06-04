const prompt = require('prompt-sync')({sigint:true});

// Validate input count
let total;
do {
    total = Number(prompt("How many numbers do you want to compare? "));
    if (isNaN(total) || total <= 0) {
        console.log("Please enter a valid positive number.");
    }
} while (isNaN(total) || total <= 0);

// this is to determine ordinals of the numbers being entered
function getOrdinal(n) {
    if (n <= 0) return n;
    const suffixes = new Map([[1, 'st'], [2, 'nd'], [3, 'rd']]);
    const mod10 = n % 10;
    const mod100 = n % 100;
    return n + (
        mod100 >= 11 && mod100 <= 13 ? 'th' :
        suffixes.get(mod10) || 'th'
    );
}


// checking for duplicate
let values = {}
let duplicate = false;
let allNumbers = [];

// Get and validate input numbers
for (let i = 0; i < total; i++){
    try{
        let num = Number(prompt(`Enter the ${getOrdinal(i+1)} number: `));
        if (isNaN(num)) {
            throw new Error("Please enter a valid number");
        }
        allNumbers.push(num);
        values[allNumbers[i]] >= 1 ? duplicate = true : values[allNumbers[i]] = 1
        if (duplicate){
        console.log("You already entered that number. Please enter a different number.");
        duplicate = false;
        allNumbers.pop();
        i--;
    }
    }catch (error) {
        console.error(`Error: ${error.message}`);
        i--;
    }
}

// finding the largest number
let highest = allNumbers[0];
for (let i = 0; i < allNumbers.length; i++){
    if (allNumbers[i] > highest){
        highest = allNumbers[i];
    }
}

// displaying the largest number
console.log(`The largest number is ${highest}`);