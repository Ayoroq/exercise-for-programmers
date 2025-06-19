const prompt = require('prompt-sync')({ sigint: true });


let num1
let num2

function output(a,b){
    let sum = a + b
    let sub = a - b
    let mult = a * b
    let div = b === 0 ? 'undefined' : (a / b).toFixed(2);
    console.log(`${a} + ${b} = ${sum}\n${a} - ${b} = ${sub}\n${a} * ${b} = ${mult}\n${a} / ${b} = ${div}`);
}

do{
    num1 = parseFloat(prompt('What is the first number? '))
    num2 = parseFloat(prompt('What is the second number? '))
    if (isNaN(num1) ||num1 < 0 ||isNaN(num2) || num2 < 0) {
        console.log('Please enter only positive numbers.');
    }
}while (isNaN(num1) ||num1 < 0 ||isNaN(num2) || num2 < 0)

output(num1, num2)


// do {
//   num1 = parseFloat(prompt('What is the first number? '));
//   if (isNaN(num1) || num1 < 0) {
//     console.log('Please enter a positive number.');
//   }
// } while (isNaN(num1) || num1 < 0);

// do {
//   num2 = parseFloat(prompt('What is the second number? '));
//   if (isNaN(num2) || num2 < 0) {
//     console.log('Please enter a positive number.');
//   }
// } while (isNaN(num2) || num2 < 0);

// output(num1, num2);