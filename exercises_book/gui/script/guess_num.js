// Initialize js-confetti
const jsConfetti = new JSConfetti()

// Get the difficulty value and table element
let totalAttempts = 0;
let value = document.getElementById("difficulty").value;
const table = document.getElementById("gameTable");

// setting the value of the maximum guesses allowed based on the difficulty level
const attempts = function (difficulty) {
    switch (difficulty) {
        case 10:
            return 3; // Easy
        case 50:
            return 5; // Medium
        case 100:
            return 7; // Hard
        default:
            return 3; // Default to easy if no valid difficulty is selected
    }
}
//generate the random number of the game based on the selected difficulty
function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTable(num) {
    const col = 10; // Number of columns per row
    const row = Math.ceil(num / col); // Calculate number of rows needed
    let html = `<caption>Select a number to register a guess</caption>`
    html += '<tr><th colspan="10" scope = "col"></th></tr>'; // Table header

    let current = 1;
    for (let i = 1; i <= row; i++) {
        html += `<tr>`;
        for (let j = 1; j <= col; j++) {
            if (current <= num) {
                html += `<td id='cell ${current}'>${current}</td>`;
                current++;
            } else {
                html += `<td></td>`; // Empty cell if we've reached the end
            }
        }
        html += `</tr>`;
    }
    table.innerHTML = html;
}

// Generate a random number based on the selected difficulty
let randomNumber = generateNumber(1, 10);

// function for checking the guess
function checkGuess(event) {
    try {
        let clickedCell = '';
        if (event.target.tagName === 'TD') {
            clickedCell = event.target;
            // increase the number of attempts made already
            totalAttempts++;
        }
        if (Number(clickedCell.textContent) === randomNumber) {
            clickedCell.classList.add('correct');
            jsConfetti.addConfetti({
                confettiColors: [
                    'blue',
                    'red',
                    'green',
                    'yellow',
                    'orange',
                ],
                confettiNumber: 1000,
                confettiDuration: 50000,
                confettiParticleShape: [
                    'circle',
                    'square',
                    'triangle',
                    'star',
                    'heart'
                ]
            })
            document.getElementById('popup').style.display = 'block'; // Show the popup
            document.getElementById('popup').style.backgroundColor = '#03fc6b'; // Set background color
            document.getElementById("result").textContent = `Congratulations! You guessed the number ${randomNumber} correctly!`;

             // Removing the hover effect from the table cells
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                cell.classList.add('no-hover');
            });

            document.getElementById("win").style.display = "block";
            document.getElementById("difficultyHeader").style.display = "none";
            table.removeEventListener("click", checkGuess); // Remove click event listener after correct guess
            // Remove click event listener after correct guess
            console.log(`Correct guess: ${clickedCell.textContent}`);
        } else if (Number(clickedCell.textContent) !== randomNumber) {
            if (value === 10) {
                if (Number(clickedCell.textContent) <= randomNumber + 3 && Number(clickedCell.textContent) >= randomNumber - 3) {
                    clickedCell.classList.add('almost-correct');
                } else {
                    clickedCell.classList.add('wrong');
                }
            } else if (value > 10) {
                if (Number(clickedCell.textContent) <= randomNumber + 5 && Number(clickedCell.textContent) >= randomNumber - 5) {
                    clickedCell.classList.add('almost-correct');
                } else {
                    clickedCell.classList.add('wrong');
                }
            } else {
                clickedCell.classList.add('wrong');
            }
        }
        // Check if the maximum number of attempts has been reached and it it has, display a game over message
        if (totalAttempts >= attempts(value) && Number(clickedCell.textContent) !== randomNumber) {
            document.getElementById('popup').style.display = 'block'; // Show the popup
            document.getElementById('popup').style.backgroundColor = '#e74c3c'; // Set background color
            // Show the game over block
            document.getElementById('gameover').style.display = 'block';
            document.getElementById("result").textContent = `The correct number was ${randomNumber}.`;

            // Removing the hover effect from the table cells
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                cell.classList.add('no-hover');
            });

            // Hide the difficulty selection dropdown
            document.getElementById("difficultyHeader").style.display = "none";
            table.removeEventListener("click", checkGuess); // Remove click event listener after maximum attempts reached
        }
    } catch (error) {
        console.error('Error in checkGuess:', error);
        alert('An error occurred while processing your guess. Please try again.');
    }
}



// function to display table and select difficulty and random number 
function gameStart() {
    try {
        // Get the difficulty value
        value = Number(this.value);
        // Then hide the instructions text
        document.getElementById("instructions").style.display = "none";
        // Generate a new random number based on the selected difficulty
        randomNumber = generateNumber(1, value);

        // adding the checkGuess event listener to the table
        table.addEventListener("click", checkGuess);

        // Get the number of attempts allowed based on the difficulty
        const maxAttempts = attempts(value);

        console.log(`You have ${maxAttempts} attempts to guess the number between 1 and ${value}.`);
        console.log(`Random number generated: ${randomNumber}`);

        // Create the game table with the new difficulty value
        createTable(value);
        table.style.display = "table"; // Show the table
    } catch (error) {
        console.error('Error in gameStart:', error);
        alert('An error occurred while starting the game. Please try again.');
    }
}

// Function to play again 
function yes() {
    try {
        // Reset the game and set to the current difficulty level
        totalAttempts = 0;
        value = document.getElementById("difficulty").value;
        gameStart.call(document.getElementById("difficulty")); // Call gameStart with the current context
        document.getElementById('popup').style.display = 'none'; // Hide the popup
        document.getElementById('gameover').style.display = 'none';
        document.getElementById("result").textContent = "";
        document.getElementById("difficultyHeader").style.display = "block";
    } catch (error) {
        console.error('Error in yes:', error);
        alert('An error occurred while restarting the game. Please try again.');
    }
}
function no() {
    location.reload(); // Reload the page to reset the game
}

// Event listener for difficulty selection
document.getElementById("difficulty").addEventListener("change", function () {
    gameStart.call(this); // Call gameStart with the current context
})
// event listener for the yes and no buttons in the popup
document.getElementById("yes").addEventListener("click", yes);
document.getElementById("no").addEventListener("click", no);