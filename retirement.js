const prompt = require('prompt-sync')({sigint: true});

let currentAge = Number(prompt("What is your current age? "));
let retirementAge = Number(prompt("At what age would you like to retire? "));
let currentyear = new Date().getFullYear();
let retirementYear
if (currentAge < retirementAge){
    let yearsLeft = retirementAge - currentAge;
    retirementYear = currentyear + yearsLeft;
    console.log(`You have ${yearsLeft} years left until you can retire.\nIt's ${currentyear}, so you can retire in ${retirementYear}.`);
}
else {
    let yearsRetired = currentAge - retirementAge;
    console.log("You can already retire!");
    retirementYear = currentyear - yearsRetired;
    console.log(`You have been retired for ${-yearsRetired} years.\nIt's ${currentyear}, so you retired in ${retirementYear}.`);
}

