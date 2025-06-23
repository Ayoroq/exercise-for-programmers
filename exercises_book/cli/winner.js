const prompt = require("prompt-sync")({ sigint: true });

let values = []; // Array to store contestant names

// Function to get user input
function getUserInput() {
  let input = prompt("Enter a name: ");
  return input;
}

// Function to add user input to the array
function addToArray(input) {
  values.push(input);
}

// Function to select a random winner from the array
function selectWinner() {
  let winner = values[Math.floor(Math.random() * values.length)];
  return winner;
}

// Function to remove the winner from the array
function removeWinner(winner, array) {
  array = array.filter((value) => value !== winner);
  return array;
}

// The main function
function main() {
  // Loop to get user input and add to array
  while (true) {
    let input = getUserInput();
    if (input === "") {
      break; // Stop if input is blank
    }
    addToArray(input);
  }

  // Pick a random winner
  let winner = selectWinner();
  // Remove the winner from the array
  values = removeWinner(winner, values);
  // Show the winner
  console.log(`The winner is... ${winner}`);
}

// Call the main function to start the program
main();