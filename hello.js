const prompt = require('prompt-sync')({sigint: true});
// getting the user's name
let name = prompt("What is your name? ");
if (name.toLowerCase() > 'm') {
    console.log(`Hello, ${name}, nice to meet you!`);
}else {
    console.log(`Hello, ${name}, it's so beautiful to meet you again!`);
}
//output  = ;  
// printing the output
//console.log(output);

//console.log(`Hello, ${prompt("What is your name? ")}, nice to meet you!`);