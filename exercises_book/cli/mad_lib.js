const prompt = require('prompt-sync')({sigint: true});

let noun = prompt('Enter a noun: ');
let verb = prompt('Enter a verb: ');
let adjective = prompt('Enter an adjective: ');
let adverb = prompt('Enter an adverb: ');

let templates = [
  `Do you ${verb} your ${adjective} ${noun} ${adverb}? That's hilarious!`,
  `The ${adjective} ${noun} tried to ${verb} ${adverb} through the forest.`,
  `Why did the ${noun} ${verb} so ${adverb}? Because it was too ${adjective}!`
];

let randomIndex = Math.floor(Math.random() * templates.length);
console.log(templates[randomIndex]);