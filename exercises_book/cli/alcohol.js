// Import prompt-sync for user input
const prompt = require('prompt-sync')({sigint: true});

let param;
// Check if the user has provided a valid unit of measurement
if (process.argv[2] === undefined) {
    console.log("Please specify the unit of measurement as either 'metric' or 'imperial' as third parameter.");
    process.exit(1);
} else if (process.argv[2].toLowerCase() !== "metric" && process.argv[2].toLowerCase() !== "imperial") {
    console.log("Please specify the unit of measurement as either 'metric' or 'imperial' as third parameter.");
    process.exit(1);;
} else {
    param = process.argv[2].toLowerCase();
}

// Declare variables for BAC calculation
let weight, gender, numDrinks, country ,abv = 0, hours = 0;

if (param === 'imperial') {
    console.log("You have chosen the Imperial system (pounds and ounces).");
} else {
    console.log("You have chosen the Metric system (kilograms and liters).");
} 

const bacLimitsByCountry = new Map([
  ["Afghanistan", 0.00],
  ["Albania", 0.05],
  ["Algeria", 0.02],
  ["Andorra", 0.05],
  ["Angola", 0.06],
  ["Argentina", 0.05],
  ["Armenia", 0.08],
  ["Australia", 0.05],
  ["Austria", 0.05],
  ["Azerbaijan", 0.00],
  ["Bahamas", 0.08],
  ["Bangladesh", 0.00],
  ["Barbados", 0.08],
  ["Belarus", 0.03],
  ["Belgium", 0.05],
  ["Belize", 0.08],
  ["Benin", 0.05],
  ["Bhutan", 0.08],
  ["Bolivia", 0.05],
  ["Bosnia and Herzegovina", 0.03],
  ["Botswana", 0.08],
  ["Brazil", 0.02],
  ["Bulgaria", 0.05],
  ["Cambodia", 0.05],
  ["Cameroon", 0.08],
  ["Canada", 0.05],
  ["Chile", 0.03],
  ["China", 0.02],
  ["Colombia", 0.04],
  ["Costa Rica", 0.05],
  ["Croatia", 0.05],
  ["Cuba", 0.05],
  ["Cyprus", 0.05],
  ["Czech Republic", 0.00],
  ["Denmark", 0.05],
  ["Dominican Republic", 0.05],
  ["Ecuador", 0.03],
  ["Egypt", 0.05],
  ["Estonia", 0.02],
  ["Ethiopia", 0.08],
  ["Finland", 0.05],
  ["France", 0.05],
  ["Germany", 0.05],
  ["Greece", 0.05],
  ["Guatemala", 0.08],
  ["Honduras", 0.07],
  ["Hungary", 0.00],
  ["Iceland", 0.05],
  ["India", 0.03],
  ["Indonesia", 0.00],
  ["Iran", 0.00],
  ["Ireland", 0.05],
  ["Israel", 0.05],
  ["Italy", 0.05],
  ["Japan", 0.03],
  ["Jordan", 0.08],
  ["Kenya", 0.08],
  ["Latvia", 0.05],
  ["Lebanon", 0.05],
  ["Lithuania", 0.04],
  ["Luxembourg", 0.05],
  ["Malaysia", 0.08],
  ["Malta", 0.08],
  ["Mexico", 0.08],
  ["Morocco", 0.06],
  ["Netherlands", 0.05],
  ["New Zealand", 0.05],
  ["Nigeria", 0.05],
  ["Norway", 0.02],
  ["Pakistan", 0.00],
  ["Panama", 0.00],
  ["Paraguay", 0.08],
  ["Peru", 0.05],
  ["Philippines", 0.05],
  ["Poland", 0.02],
  ["Portugal", 0.05],
  ["Qatar", 0.00],
  ["Romania", 0.00],
  ["Russia", 0.00],
  ["Saudi Arabia", 0.00],
  ["Serbia", 0.03],
  ["Singapore", 0.08],
  ["Slovakia", 0.00],
  ["Slovenia", 0.05],
  ["South Africa", 0.05],
  ["South Korea", 0.05],
  ["Spain", 0.05],
  ["Sri Lanka", 0.08],
  ["Sweden", 0.02],
  ["Switzerland", 0.05],
  ["Thailand", 0.05],
  ["Turkey", 0.05],
  ["Ukraine", 0.02],
  ["United Arab Emirates", 0.00],
  ["United Kingdom", 0.08],
  ["United States", 0.08],
  ["Uruguay", 0.03],
  ["Venezuela", 0.08],
  ["Vietnam", 0.00],
  ["Zimbabwe", 0.08]
]);

// Function to collect and validate user inputs
const values = () => {
    // Get and validate weight
    do {
        weight = Number(prompt(`What is your weight in ${param === 'imperial' ? 'lb' : 'kg'}? `));
        if (isNaN(weight) || weight <= 0) {
            console.log("Invalid weight. Please enter a positive number.");
        }
        if (weight > 1000) {
            console.log("Weight seems unusually high. Please verify.");
        }
    } while (isNaN(weight) || weight <= 0 || weight > 1000)

    // Get and validate gender
    do {
        gender = prompt("What is your gender? (M or F) ").toUpperCase();
        if (gender !== "M" && gender !== "F") {
            console.log("Invalid gender. Please enter 'M' or 'F'.");
        }
    } while (gender !== "M" && gender !== "F")

    // Get and validate number of drinks
    do {
        numDrinks = Number(prompt("How many drinks did you have? "));
        if (isNaN(numDrinks) || numDrinks < 0) {
            console.log("Invalid number of drinks. Please enter a non-negative number.");
        }
    } while (isNaN(numDrinks) || numDrinks < 0);

    // Get and validate ABV percentage
    if (numDrinks > 0) {
        // Get and validate ABV percentage only if drinks were consumed
        do {
            abv = Number(prompt("What is the average ABV (%) of the drink(s)? "));
            if (isNaN(abv) || abv < 0 || abv > 100) {
                console.log("Invalid ABV. Please enter a percentage between 0 and 100.");
            }
        } while (isNaN(abv) || abv < 0 || abv > 100);

        // Get and validate hours spent drinking only if drinks were consumed
        do {
            hours = Number(prompt("How many hours have you been drinking? "));
            if (isNaN(hours) || hours < 0) {
                console.log("Invalid hours. Please enter a non-negative number.");
            }
        } while (isNaN(hours) || hours < 0);
        
        // Get and validate country
        do {
            country = String(prompt("What country are you from? "));
            if (country === "" || !bacLimitsByCountry.has(country)) {
                console.log("Invalid country. Please enter a valid country name.");
            }
        } while (country === "" || !bacLimitsByCountry.has(country));
    }
    
    return { weight, gender, numDrinks, abv, country, hours };
}

// Calculate BAC using Widmark formula
const calculateBAC = ({ weight, gender, numDrinks, abv, hours }) => {
    let bac = 0;
    // Set alcohol distribution ratio based on gender
    if (numDrinks === 0) {
        return 0;
    }
    if (param === 'imperial') {
    let r = (gender === "M" ? 0.73 : 0.66);
    // Calculate BAC: ((drinks * abv * 5.14) / (weight * r)) - (0.015 * hours)
    bac = ((numDrinks * abv * 5.14) / (weight * r)) - (0.015 * hours);
    }else {
        let r = (gender === "M" ? 0.68 : 0.55);
        bac = ((numDrinks * abv * 5.14) / (weight * r)) - (0.015 * hours);
    }
    return bac;
}


function interpretBAC(bac,country) {
    const legalLimit = bacLimitsByCountry.get(country);
    if (bac >= legalLimit) {
        return `You are at/over legal limit and not fit to drive in ${country}`;
    } else if (bac < legalLimit) {
    return `Below legal limit and fit to drive in ${country}`
    } else if (bac === 0) {
        return `You have not consumed any drinks, so your BAC is 0.00. You are fit to drive in any country.`;
    }
}

// Collect user inputs
const input = values();
if (input.numDrinks === 0) {
    console.log("You have not consumed any drinks, so your BAC is 0.00. You are fit to drive in any country.");
    process.exit(0);
}else {
    const bacValue = calculateBAC(input);
    console.log(`\nYou have consumed ${input.numDrinks} drink(s) with an average ABV of ${input.abv}%.`);
    console.log(`Your BAC is ${bacValue.toFixed(4)}`);
    console.log(interpretBAC(bacValue,input.country));
}
