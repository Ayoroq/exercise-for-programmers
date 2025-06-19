// Get user input from command line
const prompt = require('prompt-sync')({sigint: true});

// Check if input is within valid range
function inputValidation(question, min = 0, max = 220) {
    while (true) {
        let input = Number(prompt(question));
        if (!isNaN(input) && input > min && input <= max) {
            return input;
        }
        console.log(`Please enter a number between ${min} and ${max}.`);
    }
}

// Calculate target heart rate using Karvonen formula
function calculateKarvonenHeartRate(age, restingHeartRate, intensity) {
    const maxHeartRate = 220 - age;
    const heartRateReserve = maxHeartRate - restingHeartRate;
    const targetHeartRate = restingHeartRate + (heartRateReserve * intensity);
    return Math.round(targetHeartRate);
}

// Main program logic
function main() {
    try {
        // Get user inputs
        const age = inputValidation("Enter your age: ");
        const restingHeartRate = inputValidation("Enter your resting heart rate: ");

        // Display header info
        console.log("Resting Pulse: " + restingHeartRate + " Age: " + age);

        // Print table header
        console.log("Intensity | Rate");
        console.log("----------|--------");

        // Calculate and display heart rates for different intensities
        for (let intensity = 55; intensity <= 95; intensity += 5) {
            const targetHeartRate = calculateKarvonenHeartRate(age, restingHeartRate, intensity / 100);
            console.log(`${(intensity + "%").padEnd(10)}| ${String(targetHeartRate).padEnd(4)} bpm`);
        }
    } catch (error) {
        console.error("An error occurred: " + error.message);
    }
}

// Start the program if this is the main module
if (require.main === module) {
    main();
}