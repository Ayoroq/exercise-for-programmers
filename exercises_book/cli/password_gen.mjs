import PromptSync from "prompt-sync";
const prompt = PromptSync({ sigint: true });
import clipboard from "clipboardy";

// Function to validate if input is a positive number
function validateInput(input) {
  return !isNaN(input) && input > 0;
}

// Arrays for possible characters in the password
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const specialCharacters = ["!", "@", "#", "$", "%", "^", "&", "*"];
const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// Map for converting vowels to numbers
const convertedVowel = new Map([
  ["e", 3],
  ["o", 0],
  ["i", 1],
  ["a", 4],
  ["u", 2],
]);

// Function to validate the values entered by the user
function validateValues(length, char, num) {
  length = Number(length);
  char = Number(char);
  num = Number(num);

  if (length < 8) {
    return false;
  }
  if (!char && !num) {
    return false;
  }
  if (char + num > length) {
    return false;
  }
  return true;
}

// Function to prompt the user for password requirements
function ask() {
  let length = prompt("What's the minimum length? ");
  let specialChar = prompt("How many special characters? ");
  let numbers = prompt("How many numbers? ");

  try {
    if (
      validateInput(length) &&
      validateInput(specialChar) &&
      validateInput(numbers)
    ) {
      if (validateValues(length, specialChar, numbers)) {
        return [length, specialChar, numbers];
      }
    }
    throw new Error(
      "Invalid input. Please make sure all inputs are numbers, greater than 0 and less than the length of the password."
    );
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Function to scramble the characters in a string
function scrambleString(string) {
  let newArray = [];
  let array = string.split("");

  while (array.length > 0) {
    let randomIndex = Math.floor(Math.random() * array.length);
    newArray.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return newArray.join("");
}

// Function to generate 5 password options
function generatePassword(length, specialChar, num) {
  try {
    let password = {};
    let alphabet = length - (specialChar + num);

    for (let i = 1; i <= 5; i++) {
      let passwordString = "";
      // Add special characters
      for (let i = 0; i < specialChar; i++) {
        passwordString +=
          specialCharacters[
            Math.floor(Math.random() * specialCharacters.length)
          ];
      }
      // Add numbers
      for (let i = 0; i < num; i++) {
        passwordString += numbers[Math.floor(Math.random() * numbers.length)];
      }
      // Add letters
      for (let i = 0; i < alphabet; i++) {
        passwordString += letters[Math.floor(Math.random() * letters.length)];
      }
      // Randomly convert vowels to numbers
      if (Math.random() * 1 > 0.5) {
        convertedVowel.forEach((value, key) => {
          const regex = new RegExp(key, "gi"); // 'g' = global, 'i' = case-insensitive
          passwordString = passwordString.replace(regex, value);
        });
      }
      // Scramble the password and store it
      password[i] = scrambleString(passwordString);
    }

    return password;
  } catch (e) {
    console.log(e);
  }
}

// Function to ask the user which password to copy
function confirmPassword() {
  let input = Number(prompt("Which password would you like to copy? "));
  if (input > 0 && input < 6) {
    return input;
  } else {
    throw new Error("Invalid input. Please enter a number between 1 and 5.");
  }
}

// Main function to run the program
async function main() {
  try {
    let values = ask();
    if (values) {
      let [length, specialChar, numbers] = values.map(Number);
      let password = generatePassword(length, specialChar, numbers);
      // Show the five password options
      console.log(`\nYou have been provided with five options for your password. as seen below\n
      1. ${password[1]}\n
      2. ${password[2]}\n
      3. ${password[3]}\n
      4. ${password[4]}\n
      5. ${password[5]}\n
      Please enter the id of the desired password to copy to your clipboard.\n`);
      // Ask which password to copy
      let input = confirmPassword();
      await clipboard.write(password[input]); // write password to clipboard
      console.log("Password copied to clipboard.");
    }
  } catch (e) {
    console.log(e);
  }
}

main(); // Run the program
