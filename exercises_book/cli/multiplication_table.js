// Get user input from command line
const prompt = require('prompt-sync')({sigint: true});

// Check if input is between 1 and 20
function validateInput(question) {
    while(true) {
        let input = Number(prompt(question));
        if (isNaN(input) || input <= 0 || input > 20) {
            console.log("Please enter a number between 1 and 20.");
            continue;
        }
        return input;
    }
}

// Generate multiplication table
function multiply(num){
    // Setup table formatting
    let table = []
    const columnWidth = 4;          // Width for each number
    const separatorWidth = 3;       // Width for ' | ' separator
    const totalColumns = num + 2;   // Total columns including headers
    const totalWidth = totalColumns * (columnWidth + separatorWidth) - separatorWidth;

    // Create header row
    for (let i = 0; i <= num; i++){
        table.push(i)
    }

    // Format header numbers
    for (let k = 0; k < table.length; k++){
        table[k] = table[k].toString().padStart(4, ' ')
    }
    
    // Add empty cell for row labels
    table.unshift('    ')
    
    // Print header row and separator
    console.log(table.join(' | '))
    console.log('-'.repeat(totalWidth))

    // Generate and print each row
    for (let i = 0; i <= num; i++){
        let row = []
        // Calculate products for this row
        for (let j = 0; j <= num; j++){
            row.push(i * j)
        }
        // Format numbers in row
        for (let k = 0; k < row.length; k++){
            row[k] = row[k].toString().padStart(4, ' ')
        }
        // Add row label
        row.unshift(i.toString().padStart(4, ' '))
        // Print row and separator
        console.log(row.join(' | '))
        console.log('-'.repeat(totalWidth));
    }
}

// Main program logic
function main(){
    try {
        let num = validateInput("Enter a number between 1 and 20: ")
        console.log(`\n Multiplication table up to ${num}\n`)
        multiply(num)
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

// Start the program
if (require.main === module) {
    main();
}