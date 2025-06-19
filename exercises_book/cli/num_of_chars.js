const prompt = require('prompt-sync')({sigint: true});

// getting the input string

let input
do {
    input = prompt('What is the input String? ')
    if (!input.trim()) {
        console.log('Please enter a non-empty string.');
    }
}while(!input.trim())
console.log(`${input} has ${input.length} characters.`);