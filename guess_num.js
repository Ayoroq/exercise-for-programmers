const prompt = require('prompt-sync')({ sigint: true });

// Check if input is a valid number
function validateInput(question) {
    while (true) {
        let input = Number(prompt(question))
        if (isNaN(input) || input < 0) {
            console.log("Please enter a valid number.")
        } else {
            return input
        }
    }
}

// Get random number within range
function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set game difficulty and range
function difficulty(num) {
    if (num !== 1 && num !== 2 && num !== 3) {
        console.log("Please enter (1, 2, or 3).")
        return false
    }
    let min, max;
    switch (num) {
        case 1:
            min = 1; max = 10;    // Easy
            break;
        case 2:
            min = 1; max = 100;   // Medium
            break;
        case 3:
            min = 1; max = 1000;  // Hard
            break;
        default:
            console.log("Invalid difficulty level.")
    }
    return { valid: true, min: min, max: max };
}

// Ask player to play again
function playAgain() {
    const answer = prompt("Play again? ").toLowerCase();
    if (answer === 'y') return true;
    if (answer === 'n') {
        console.log("Goodbye!");
        return false;
    }
    console.log("Please enter 'y' or 'n'.");
    return playAgain();
}

// Messages for different guess counts
const guessMessages = {
    1: `You're a mind reader!`,
    2: "Most impressive!",
    3: `Most impressive!`,
    4: `You can do better than that`,
    5: `You can do better than that`,
    6: `You can do better than that`,
};

// Get message based on number of guesses
function displayGuessMessage(guesses) {
    return guessMessages[guesses] || "Better luck next time";
}

// Main game logic
function main() {
    console.log("Let's play Guess the Number.");
    let play = true;
    try {
        while (play) {
            // Set up game
            let difficultyLevel = validateInput("Enter a difficulty level (1, 2, or 3): ");
            let { valid, min, max } = difficulty(difficultyLevel);
            if (!valid) continue;

            // Initialize game variables
            let randomNumber = generateNumber(min, max);
            let guesses = 0;
            let guessedNumber = [];
            let guess = 0;

            // First guess
            guess = prompt(`I have my number. What's your guess? `);
            guessedNumber.push(guess);
            guesses++;

            // Main guess loop
            while (Number(guess) !== randomNumber) {
                let adjustedGuessedNumber = guessedNumber.slice(0, -1)
                
                // Handle different guess scenarios
                if (guess < randomNumber) {
                    if (adjustedGuessedNumber.includes(guess)) {
                        console.log("You already guessed that number. Try again.");
                        guess = prompt("What's your guess? ");
                    } else {
                        guess = prompt("Too low. Guess again: ");
                    }
                } else if (guess > randomNumber) {
                    if (adjustedGuessedNumber.includes(guess)) {
                        console.log("You already guessed that number. Try again.");
                        guess = prompt("What's your guess? ");
                    } else {
                        guess = prompt("Too high. Guess again: ");
                    }
                } else if (isNaN(guess)) {
                    console.log("Invalid input. Please enter a number.");
                    guess = prompt("What's your guess? ");
                } else {
                    break;
                }
                
                // Track guesses
                guessedNumber.push(guess);
                guesses++;
            }
            
            // Show results and ask to play again
            console.log(`You guessed it in ${guesses} attempt(s)! ${displayGuessMessage(guesses)}`);
            play = playAgain();
        }
    } catch (error) {
        console.error("An error occurred: " + error.message);
    }
}

// Start the game
if (require.main === module) {
    main();
}