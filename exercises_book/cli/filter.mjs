import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });
import fs from "node:fs/promises";

// BASE REQUIREMENT: Function to verify if the input value is a valid positive number
function verifyInput(value) {
  return !isNaN(value) && value > 0;
}

// BASE REQUIREMENT: Function to convert the input string into an array of numbers
function convert(input) {
  try {
    let array = [];
    for (let i = 0; i < input.length; i++) {
      if (verifyInput(input[i])) {
        array.push(Number(input[i])); // Add valid numbers to array
      } else if (input[i] === " ") {
        continue; // Skip spaces
      } else {
        array.push(input[i]); // Add any other character as is
      }
    }
    return array;
  } catch (error) {
    console.log(error);
  }
}

// BASE REQUIREMENT: Function to filter even numbers from the array (no built-in filter)
function filterEvenNumbers(array) {
  let newString = "";
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 === 0) {
      newString += array[i] + " "; // Add even number to newString
    }
  }
  return newString;
}

// CHALLENGE: Function to read lines from a file and split each line into an array of strings
async function read() {
  try {
    const file = await fs.readFile("../files/filter_num.csv", "utf8");
    return file
      .split("\n")
      .map((line) => line.split(" "));
      // Optionally, you could convert to numbers here if needed:
      // .map((line) =>
      //   line.map((val) => Number(val)).filter((val) => val > 0 && !isNaN(val))
      // );
  } catch (error) {
    console.log(error);
  }
}

// BASE REQUIREMENT (commented out): Prompt user for input, convert, and print even numbers
// async function main() {
//   const question = prompt("Enter a list of numbers separated by spaces: ");
//   const array = convert(question);
//   const newString = filterEvenNumbers(array);
//   console.log(`The even numbers are: ${newString.trim()}.`);
// }


// CHALLENGE - function to run the program and print out only the even numbers from each line
// async function main() {
//   const file = await read();
//   file.forEach((element, index) => {
//     const newString = filterEvenNumbers(element);
//     console.log(`\nLine ${index + 1}:`);
//     console.log(`The even numbers are: ${newString.trim()}.\n`);
//   });
// }

// CHALLENGE: Read from file and print only the even-numbered lines (lines 2, 4, 6, ...)
async function main() {
  const file = await read();
  file.forEach((element, index) => {
    // Print only even-numbered lines (index is 0-based)
    if ((index + 1) % 2 === 0) {
      console.log(`Line ${index + 1}: ${element.join(" ")}`);
    }
  });
}

main(); // Start the program
