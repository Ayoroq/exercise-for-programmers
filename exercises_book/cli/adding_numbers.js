// Import prompt-sync for handling user input
const prompt = require('prompt-sync')({sigint: true});

/**
 * Validates user input to ensure it's a positive number
 * @param {string} question - The prompt to display to the user
 * @returns {number} - The validated positive number
 */
function inputValidation(question){
    while(true){
        let input = Number(prompt(question).trim());
        // Check if input is not a number or is negative/zero
        if (isNaN(input) || input <= 0) {
            console.log("Please enter a positive number.");
            continue;
        }
        return input; // Return valid input
    }
}

/**
 * Sums up a specified number of user-input values
 * Silently ignores non-numeric inputs but counts them as attempts
 * @param {number} value - Number of values to sum
 * @returns {number} - The sum of all valid numeric inputs
 */

function sumValues(value){
    let sum = 0;
    // Loop for the specified number of inputs
    for (let i = 1; i <= value; i++){
        let answer = Number(prompt(`Enter number ${i}: `).trim());
        
        // Only add valid numbers to sum
        if(!isNaN(answer)){
            sum += answer;
        }
        // Invalid entries still count as attempts
    }
    return sum;
}

/**
 * Main program execution
 * Gets count of numbers to add and calculates their sum
 */
function main() {
    try {
        // Get number of values to add
        const count = inputValidation("How many numbers do you want to add? ");
        // Calculate sum of input values
        const sum = sumValues(count);
        // Display result
        console.log(`\nThe total is ${sum}.`);
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Run program if this is the main module
if (require.main === module) {
    main();
}