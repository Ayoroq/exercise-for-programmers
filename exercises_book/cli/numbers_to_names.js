// Import required module for user input
const prompt = require('prompt-sync')({sigint: true});

// Define supported languages array
let languages = ['english', 'french', 'spanish', 'yoruba'];
let param;

// Validate command line language parameter
if (process.argv[2] === undefined) {
    console.log("Please specify the second parameter as one of the supported languages english, french, spanish, or yoruba.");
    process.exit(1);
} else if (!languages.includes(process.argv[2].toLowerCase())) {
    console.log("Please specify the language as either 'english', 'french', 'spanish', or 'yoruba' as second parameter.");
    process.exit(1);
} else {
    param = process.argv[2].toLowerCase();
}

// Get month number from user
function isValidMonth(num) {
    return !isNaN(num) && num >= 1 && num <= 12;
}

let num = prompt("Please enter the number of the month: ").trim();
if (!isValidMonth(Number(num))) {
    console.log("Please enter a valid month number (1-12)");
    process.exit(1);
}

// Define month names in different languages using Map
// [English, French, Spanish, Yoruba]
const months = new Map([
    ['1',  ['January','Janvier','Enero','Ṣẹ́rẹ́']],
    ['2',  ['February','Février','Febrero','Èrèlè']],
    ['3',  ['March','Mars','Marzo','Ẹrẹ̀nà']],
    ['4',  ['April','Avril','Abril','Ìgbé']],
    ['5',  ['May','Mai','Mayo','Ẹ̀bibi']],
    ['6',  ['June','Juin','Junio','Òkúdu']],
    ['7',  ['July','Juillet','Julio','Agẹmọ']],
    ['8',  ['August','Août','Agosto','Ògún']],
    ['9',  ['September','Septembre','Septiembre','Owewe']],
    ['10', ['October','Octobre','Octubre','Ọ̀wàrà']],
    ['11', ['November','Novembre','Noviembre','Bélú']],
    ['12', ['December','Décembre','Diciembre','Ọ̀pẹ̀']]
]);

// Get language index and output translated month name
let language = languages.indexOf(param);
console.log(months.has(num) ? 
    `The name of the month is ${months.get(num)[language]}.` : 
    `Invalid month number`
);