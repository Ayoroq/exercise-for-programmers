// NOTE: This file contains both the current implementation (class-based)
// and a legacy version (commented out) to show the evolution of the solution.

// This program helps the user diagnose common car startup issues
// based on a decision tree. It prompts the user with relevant questions
// and gives advice depending on their answers.

const prompt = require('prompt-sync')({sigint: true});

// --------------------------------------------------------------------
// LEGACY IMPLEMENTATION (commented out for reference only)
// This earlier version used imperative do/while loops and a shared flag
// to prompt the user and validate input. It has been replaced with a
// cleaner, class-based implementation using a helper function.
// --------------------------------------------------------------------

// let val = true
// function verifyValue(value){
//     if (value != 'y' && value != 'n'){
//         return console.log("Please enter 'y' or 'n'.");
//     }else{
//         val = false;
//     }
// }

// let start = prompt('Is the car silent when you turn the key? ');
// if (start === 'y'){  
//     do {
//         // Legacy prompt and validation loop using 'verifyValue' and 'val' flag.
//         var second = prompt('Are the battery terminals corroded? ');
//         verifyValue(second);
//     }while (val != false);
//     if (second === 'y'){
//         console.log('Clean terminals and try starting again.');
//     }else if (second === 'n'){
//         console.log('Replace cables and try again.');
//     }
// }else if (start === 'n'){
//   do {
//     // Legacy prompt and validation loop using 'verifyValue' and 'val' flag.
//     var third = prompt('Does the car make a clicking noise? ');
//     verifyValue(third);
//   }while (val != false);
//   if (third === 'y'){
//     console.log('Replace the battery.');
//   }else if (third === 'n'){
//     do {
//         // Legacy prompt and validation loop using 'verifyValue' and 'val' flag.
//         var fourth = prompt('Does the car crank up but fail to start? ');
//         verifyValue(fourth);
//     }while (val != false);
//     if (fourth === 'y'){
//         console.log('Check spark plug connections.');
//     }else if (fourth === 'n'){
//         do {
//             // Legacy prompt and validation loop using 'verifyValue' and 'val' flag.
//             var fifth = prompt('Does the engine start and then die? ');
//             verifyValue(fifth);
//         }while (val != false);
//         if (fifth === 'y'){
//             console.log('Does your car have fuel injection? ');
//             var sixth = prompt('Enter y or n: ');
//             if (sixth === 'y'){
//                 console.log('Get it in for service.');
//             }else if (sixth === 'n'){
//                 console.log('Check to ensure the choke is opening and closing.');
//             }else{
//                 console.log('Please enter y or n.');
//             }
//         }else if (fifth === 'n'){
//             console.log('Get it in for service.');
//         }else{
//             console.log('Please enter y or n.');
//         }
//     }
//   }
// }else{
//     console.log('Please enter y or n.');
// }


// Helper function to ensure valid yes/no input from user
function yesOrNo(question) {
    while (true) {
        const answer = prompt(question).toLowerCase();
        if (answer === 'y' || answer === 'n') return answer;
        console.log("Please enter 'y' or 'n'.");
    }
}

// Class that encapsulates the car issue diagnosis logic
class carIssues {
    diagnose() {
        // First question: is the car silent when the key is turned?
        const start = yesOrNo('Is the car silent when you turn the key? ');

        if (start === 'y') {
            // If silent, check battery terminals
            return yesOrNo('Are the battery terminals corroded? ') === 'y'
                ? 'Clean terminals and try starting again.'
                : 'Replace cables and try again.';
        }

        // If not silent, check if car makes clicking noise
        if (yesOrNo('Does the car make a clicking noise? ') === 'y') {
            return 'Replace the battery.';
        }

        // If no clicking, check if car cranks but doesn't start
        if (yesOrNo('Does the car crank up but fail to start? ') === 'y') {
            return 'Check spark plug connections.';
        }

        // If it cranks and starts then dies, check for fuel injection
        if (yesOrNo('Does the engine start and then die? ') === 'y') {
            return yesOrNo('Does your car have fuel injection? ') === 'y'
                ? 'Get it in for service.'
                : 'Check to ensure the choke is opening and closing.';
        }

        // Default fallback if no prior condition is met
        return 'Get it in for service.';
    }
}

// Create an instance of carIssues and run the diagnosis
const car = new carIssues();
console.log(car.diagnose());