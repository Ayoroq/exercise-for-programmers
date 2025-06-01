const prompt = require("prompt-sync")({ sigint: true });

console.log("Press C to convert from Celsius");
console.log("Press F to convert from Fahrenheit");
let choice = prompt("Your choice: ").toLowerCase();

function celciusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitToCelcius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function promptforTemperature(message) {
    do {
        let temperature = Number(prompt(message));
        if (!isNaN(temperature)) {
            return temperature;
        }
        console.log("Please enter a valid number.");
    } while (true)
}

if (choice === 'c') {
    let temp = promptforTemperature("Please enter the temperature in Celsius: ");
    convertedTemp = celciusToFahrenheit(temp);
    console.log(`${temp}°C is ${convertedTemp.toFixed(2)}°F`);
}else{
    let temp = promptforTemperature("Please enter the temperature in Fahrenheit: ");
    convertedTemp = fahrenheitToCelcius(temp);
    console.log(`${temp}°F is ${convertedTemp.toFixed(2)}°C`);
}