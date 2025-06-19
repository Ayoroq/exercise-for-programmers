// Get user input from command line
const prompt = require('prompt-sync')({sigint: true});

// Make sure input is a valid positive number
function inputValidation(question) {
    while(true) {
        let input = Number(prompt(question));
        // Check if input is not a number
        if (isNaN(input)) {
            console.log("Sorry. That's not a valid input.");
            continue;
        }
        // Check if input is zero or negative
        if (input <= 0) {
            console.log("Sorry. 0 is not allowed. Please enter a positive number.");
            continue;
        }
        return input;
    }
}

// Calculate years to double investment using Rule of 72
function rule(n){
    return Math.ceil(72/n);
}

// Main program logic
function main(){
    try {
        // Get rate of return from user
        const rate = inputValidation('What is the rate of return? ');
        // Calculate years needed
        const years = rule(rate);
        console.log(`It will take approximately ${years} years to double your initial investment.`)
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Start the program
if (require.main === module) {
    main();
}