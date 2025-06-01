// Import prompt-sync for user input handling
const prompt = require("prompt-sync")({ sigint: true });

// Display menu options to user
console.log("Press C to convert from Celsius");
console.log("Press F to convert from Fahrenheit");
let choice = prompt("Your choice: ").toLowerCase();

// Convert Celsius to Fahrenheit using formula (C × 9/5) + 32
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Convert Fahrenheit to Celsius using formula (F - 32) × 5/9
function fahrenheitTocelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// Get and validate temperature input from user
function promptforTemperature(message) {
    do {
        let temperature = Number(prompt(message));
        if (!isNaN(temperature)) {
            return temperature;
        }
        console.log("Please enter a valid number.");
    } while (true)
}

// Handle Celsius to Fahrenheit conversion
if (choice === 'c') {
    let temp = promptforTemperature("Please enter the temperature in Celsius: ");
    let convertedTemp = celsiusToFahrenheit(temp);
    console.log(`${temp}°C is ${convertedTemp.toFixed(2)}°F`);
// Handle Fahrenheit to Celsius conversion
}else{
    let temp = promptforTemperature("Please enter the temperature in Fahrenheit: ");
    let convertedTemp = fahrenheitTocelsius(temp);
    console.log(`${temp}°F is ${convertedTemp.toFixed(2)}°C`);
}