import PromptSync from 'prompt-sync';  
const prompt = PromptSync({sigint: true});
import fs from 'node:fs/promises'

// Function to check if input is a valid non-negative number
function validateNumber(input) {
    return !isNaN(input) && input >= 0;
}

// Function to calculate the mean (average)
function mean(array) {
    let sum = 0;
    array.forEach(number => {
        sum += number;
    });
    return (sum / array.length).toFixed(2);
}

// Function to find the maximum value in the array
function max(array) {
    let max = array[0];
    array.forEach(number => {
        if (number > max) {
            max = number;
        }
    });
    return max;
}

// Function to find the minimum value in the array
function min(array) {
    let min = array[0];
    array.forEach(number => {
        if (number < min) {
            min = number;
        }
    });
    return min;
}

// Function to calculate the sample standard deviation
function standardDeviation(array) {
    let avg = mean(array);
    let sum = 0;
    array.forEach(number => {
        sum += (number - avg) ** 2;
    });
    return Math.sqrt(sum / ((array.length) - 1)).toFixed(2);
}

// Function to keep asking for numbers until 'done' is entered
function question(question, array){
    while (true) {
        let input = prompt(question);
        if (input === 'done') {
            break;
        }
        if (validateNumber(input)) {
            array.push(Number(input));
        } else {
            console.log('Invalid input');
        }
    }
}

// Function to print all numbers in the array
function printArray(array) {
    console.log(`Numbers: ${array.join(', ')}`)
}

// Function to read and parse numbers from file, each line becomes an array of numbers
async function readNumbersFromFile() {
    const file = await fs.readFile('../files/numbers.csv', 'utf8');
    // Split lines, then split each line by comma, trim, and convert to numbers for each line
    return file
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line =>
            line
                .split(',')
                .map(val => Number(val.trim()))
                .filter(val => !isNaN(val))
        );
}

// Function to print statistics for an array of numbers
function calculateStatistics(array) {
    console.log(`The average is: ${mean(array)}`);
    console.log(`The maximum is: ${max(array)}`);
    console.log(`The minimum is: ${min(array)}`);
    console.log(`The sample standard deviation is: ${standardDeviation(array)}`);
}

// Main function to run the program
async function main() {
    try {
        // Read numbers from file, each line as an array
        const fileArray = await readNumbersFromFile();
        // For each line, print the numbers and their statistics
        fileArray.forEach((array, index) => {
            console.log(`\nLine ${index + 1}:`);
            printArray(array); // show the numbers on this line
            calculateStatistics(array);
        });
    } catch (error) {
        console.error(`Error reading file:, ${error.message}`);
    }
}

await main(); // Run