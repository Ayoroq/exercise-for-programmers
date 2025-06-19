const prompt = require('prompt-sync')({sigint: true});

let param
if (process.argv[2] === undefined) {
    console.log("Please specify the unit of measurement as either 'feet' or 'meters' as third parameter.");
    process.exit(1);
    }else if (process.argv[2].toLowerCase() != "feet" && process.argv[2].toLowerCase() != "meters") {
        console.log("Please specify the unit of measurement as either 'feet' or 'meters' as third parameter.");
        process.exit(1);
    }else {
        param = process.argv[2].toLowerCase();
    }

let length, width;

do {
    let length = Number(prompt(`What is the length of the room in ${param}? `));
    let width = Number(prompt(`What is the width of the room in ${param}? `));
    if(isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
        console.log("Invalid input. Please enter positive numbers for length and width.");
    }
}
while (isNaN(length) || isNaN(width) || length <= 0 || width <= 0);

function calculateArea(length, width, unit) {
    if (unit === "feet") {
        let areaInSquareFeet = length * width;
        let areaInSquareMeters = parseFloat((areaInSquareFeet * 0.09290304).toFixed(2));
        console.log(`You entered dimensions of ${length} feet by ${width} feet.\nThe area is\n${areaInSquareFeet} square feet\n${areaInSquareMeters} square meters.`);
    } else {
        let areaInSquareMeters = length * width;
        let areaInSquareFeet = parseFloat((areaInSquareMeters / 0.09290304).toFixed(2));
        console.log(`You entered dimensions of ${length} meters by ${width} meters.\nThe area is\n${areaInSquareMeters} square meters\n${areaInSquareFeet} square feet.`);
    }
}

calculateArea(length, width, param);