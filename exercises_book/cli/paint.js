const prompt = require('prompt-sync')({ sigint: true });
const gallonPerSquareFeet = 1/350;

let shape;
if (process.argv[2] === undefined) {
    console.log("Please specify the shape as either 'standard','l-shape' or 'round' as third parameter.");
    process.exit(1);
} else if (process.argv[2].toLowerCase() != "standard" && process.argv[2].toLowerCase() != "round" && process.argv[2].toLowerCase() != "l-shape") {
    console.log("Please specify the shape as either 'standard','l-shape' or 'round' as third parameter.");
    process.exit(1);
} else {
    shape = process.argv[2].toLowerCase();
}

let length,width,area,radius
if (shape === "standard") {
    
    do {
        length = Number(prompt("What is the length of the room in feet? "));
        width = Number(prompt("What is the width of the room in feet? "));
        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            console.log("Invalid input. Please enter positive numbers for length and width.");
        }
    }
    while (isNaN(length) || isNaN(width) || length <= 0 || width <= 0);
    area = length * width;
}

if(shape === "round") {
    do {
        radius = Number(prompt("What is the radius of the room in feet? "));
        if (isNaN(radius) || radius <= 0) {
            console.log("Invalid input. Please enter a positive number for radius.");
        }
    }while (isNaN(radius) || radius <= 0)
    area = Math.PI * Math.pow(radius, 2);
}

if(shape === "l-shape"){
    console.log("Please enter the values of the two rectangles that make up the L-shape");
    let l1,w1,l2,w2;
    do {
        l1 = Number(prompt("What is the length of the first rectangle in feet? "));
        w1 = Number(prompt("What is the width of the first rectangle in feet? "));
        if (isNaN(l1) || isNaN(w1) || l1 <= 0 || w1 <= 0) {
            console.log("Invalid input. Please enter positive numbers for length and width.");
        }
    }
    while (isNaN(l1) || isNaN(w1) || l1 <= 0 || w1 <= 0);
    do {
        l2 = Number(prompt("What is the length of the second rectangle in feet? "));
        w2 = Number(prompt("What is the width of the second rectangle in feet? "));
        if (isNaN(l2) || isNaN(w2) || l2 <= 0 || w2 <= 0) {
            console.log("Invalid input. Please enter positive numbers for length and width.");
        }
    }while (isNaN(l2) || isNaN(w2) || l2 <= 0 || w2 <= 0);
    area = (l1 * w1) + (l2 * w2);
}


let gallonsneeded = Math.ceil(area * gallonPerSquareFeet);
console.log("You will need to purchase " + gallonsneeded + " gallons of paint to cover " + area.toFixed(2) + " square feet.");