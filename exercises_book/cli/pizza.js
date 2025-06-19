const prompt = require('prompt-sync')({ sigint: true });

let version
if (process.argv[2] === undefined) {
    console.log("Please specify the version as either 'v1' or 'v2' as third parameter");
    process.exit(1);
} else if (process.argv[2].toLowerCase() != "v1" && process.argv[2].toLowerCase() != "v2") {
    console.log("Please specify the version as either 'v1' or 'v2' as second parameter.");
    process.exit(1);
}else {
    version = process.argv[2].toLowerCase();
}

let people;
let pizzas;
let slicesPerPizza;
const SLICES_PER_PIZZA = 8;

function isInvalidInput(people, pizzas, slicesPerPizza) {
    return isNaN(pizzas) || pizzas <= 0 || isNaN(people) || people <= 0 || isNaN(slicesPerPizza) || slicesPerPizza <= 0;
}

if (version === "v1") {
        do {
        people = Number(prompt("How many people? "));
        pizzas = Number(prompt("How many pizzas do you have? "));
        slicesPerPizza = Number(prompt("How many slices in each pizza? "));
        if (isInvalidInput(people, pizzas, slicesPerPizza)) {
            console.log("Invalid input. Please enter positive numbers for number of people, pizzas, and slices per pizza.");
        }
    } while (isInvalidInput(people, pizzas, slicesPerPizza));

    // Calculations involved in determining the number of slices per person

    let totalSlices = pizzas * slicesPerPizza;
    let slicesPerPerson = Math.floor(totalSlices / people);
    console.log(slicesPerPerson === 0 
        ? "There are not enough pizzas for each person to have a slice." 
        : `Each person gets ${slicesPerPerson} piece${slicesPerPerson > 1 ? "s" : ""} of pizza.`);

    let leftoverSlices = totalSlices % people;
    console.log(leftoverSlices === 0 
        ? "There are no leftover pieces." 
        : leftoverSlices === 1 
        ? "There is 1 leftover piece." 
        : `There are ${leftoverSlices} leftover pieces.`);
}

let piecesPerPerson;

function isInvalidV2Input(people, piecePerPerson) {
    return isNaN(people) || people <= 0 || isNaN(piecePerPerson) || piecePerPerson <= 0;
}

if (version === "v2") {
    
    do{
        people = Number(prompt("How many people? "));
        piecesPerPerson = Number(prompt("How many pieces per person? "));

        if (isInvalidV2Input(people, piecesPerPerson)) {
            console.log("Invalid input. Please enter positive numbers for number of people and pieces per person.");
        }
    } while (isInvalidV2Input(people, piecesPerPerson));

    let totalPieces = people * piecesPerPerson;
    let fullPizza = Math.floor(totalPieces / SLICES_PER_PIZZA);
    let leftoverPieces = totalPieces % SLICES_PER_PIZZA;
    console.log(leftoverPieces === 0 ? 
        `There will be a total of ${fullPizza} pizzas with no leftover pieces.` :
        `There will be a total of ${fullPizza} pizzas with ${leftoverPieces} leftover pieces.`);

}

// The program calculates pizza distribution and leftovers.