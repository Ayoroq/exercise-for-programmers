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



// import promptSync from 'prompt-sync';
// const prompt = promptSync({ sigint: true });

// import { Engine } from 'json-rules-engine';

// const engine = new Engine(undefined, {allowUndefinedFacts: true});

// // Helper function to ensure valid yes/no input from user
// function yesOrNo(question) {
//     while (true) {
//         const answer = prompt(question).toLowerCase();
//         if (answer === 'y' || answer === 'n') return answer;
//         console.log("Please enter 'y' or 'n'.");
//     }
// }

// engine.addRule({
//   conditions: {
//   all: [
//     { fact: 'start', operator: 'equal', value: 'turnKey' },
//     { fact: 'value', operator: 'equal', value: 'y' }
//   ]
// },
//   event: {
//     type: 'batteryCheck',
//     params: {
//       message: 'Are the battery terminals corroded? '
//     }
//   }
// });

// engine.addRule({
//   conditions: {
//   all: [
//     { fact: 'start', operator: 'equal', value: 'turnKey' },
//     { fact: 'value', operator: 'equal', value: 'n' }
//   ]
// },
//   event: {
//     type: 'batteryCheck',
//     params: {
//       message: 'Does the car make a clicking noise? '
//     }
//   }
// });

// // engine.addRule({
// //   conditions: {
// //   all: [
// //     { fact: 'step2y', operator: 'equal', value: 'batteryCheck' },
// //     { fact: 'value2', operator: 'equal', value: 'y' }
// //   ]
// // },
// //   event: {
// //     type: 'cableCheck',
// //     params: {
// //       message: 'Clean terminals and try starting again.'
// //     }
// //   }
// // });

// // engine.addRule({
// //   conditions: {
// //   all: [
// //     { fact: 'step2y', operator: 'equal', value: 'batteryCheck' },
// //     { fact: 'value2', operator: 'equal', value: 'n' }
// //   ]
// // },
// //   event: {
// //     type: 'cableCheck',
// //     params: {
// //       message: 'Replace cables and try again.'
// //     }
// //   }
// // });

// engine.addRule({
//   conditions: {
//   all: [
//     { fact: 'step2n', operator: 'equal', value: 'noiseClick' },
//     { fact: 'value', operator: 'equal', value: 'n' }
//   ]
// },
//   event: {
//     type: 'noiseClick',
//     params: {
//       message: 'Does the car crank up but fail to start? '
//     }
//   }
// });
// // engine.addRule({
// //   conditions: {
// //   all: [
// //     { fact: 'step2n', operator: 'equal', value: 'noiseClick' },
// //     { fact: 'value', operator: 'equal', value: 'y' }
// //   ]
// // },
// //   event: {
// //     type: 'noiseClick',
// //     params: {
// //       message: 'Replace the battery.'
// //     }
// //   }
// // });
// engine.addRule({
//   conditions: {
//   all: [
//     { fact: 'step3n', operator: 'equal', value: 'crankStart' },
//     { fact: 'value', operator: 'equal', value: 'n' }
//   ]
// },
//   event: {
//     type: 'crankStart',
//     params: {
//       message: 'Does the engine start and then die? '
//     }
//   }
// });

// engine.addRule({
//   conditions: {
//   all: [
//     { fact: 'step4', operator: 'equal', value: 'engineStart' },
//     { fact: 'value', operator: 'equal', value: 'y' }
//   ]
// },
//   event: {
//     type: 'engineStart',
//     params: {
//       message: 'Does your car have fuel injection?'
//     }
//   }
// });


// // Running the engie with the information at hand first
// let start = yesOrNo('Is the car silent when you turn the key? ');
// let facts 
// facts = { start: 'turnKey', value: start };
// const { events: firstEvents } = await engine.run(facts);


// if (start === 'y') {
//     const q2 = yesOrNo(firstEvents[0]?.params.message);
//     // Separate fact names to prevent reuse of 'value' in multiple steps
//     if (q2 === 'y'){
//         console.log('Clean terminals and try starting again.');
//     }else if (q2 === 'n'){
//         console.log('Replace cables and try again.');
//     }
// }else{
//     const q2 = yesOrNo(firstEvents[0]?.params.message);
//     facts = { 
//         step2n: 'noiseClick', 
//         value: q2 
//     };
//     let { events: secondEventsNo } = await engine.run(facts);
//     if (q2 === 'y'){
//         console.log('Replace the battery.');
//     }else if (q2 === 'n'){
//         const q3 = yesOrNo(secondEventsNo[0]?.params.message);
//         facts = {
//             step3n: 'crankStart',
//             value: q3
//         };
//         let { events: thirdEventsNo } = await engine.run(facts);
//         if(q3 === 'y'){
//             console.log('Check spark plug connections');
//         }
//         else if(q3 === 'n'){
//             const q4 = yesOrNo(thirdEventsNo[0]?.params.message);
//             facts = {
//                 step4: 'engineStart',
//                 value: q4
//             };
//             let { events: fourthEventsyes } = await engine.run(facts);
//             if(q4 === 'y'){
//                 const q5 = yesOrNo(fourthEventsyes[0]?.params.message);
//                 if(q5 === 'y'){
//                     console.log('Get it in for service.');
//                 }else if(q5 === 'n'){
//                     console.log('Check to ensure the choke is opening and closing.');
//                 }
//             }
//             else if(q4 === 'n'){
//                 console.log('Get it in for service.');
//             }
//         }
//     }
// }



// Nested decision tree object representing car diagnostic logic.
// Each branch corresponds to a yes/no question and leads to further questions or final advice.
// Mot of the code below was generated after finishing my initial approach above. 
// sort of a way to see how this could be implemented better

const diagnosticRules = {
    silent: {
        // Root of the tree: car is silent when key is turned
        condition: 'turnKey',
        yes: {
            // 'yes' path: user answered 'y' to previous question
            question: 'Are the battery terminals corroded? ',
            yes: 'Clean terminals and try starting again.', // 'yes' path: user answered 'y'
            no: 'Replace cables and try again.' // 'no' path: user answered 'n'
        },
        no: {
            // 'no' path: user answered 'n' to previous question
            question: 'Does the car make a clicking noise? ',
            yes: 'Replace the battery.', // 'yes' path: user answered 'y'
            no: {
                // 'no' path: user answered 'n'
                question: 'Does the car crank up but fail to start? ',
                yes: 'Check spark plug connections.', // 'yes' path: user answered 'y'
                no: {
                    // 'no' path: user answered 'n'
                    question: 'Does the engine start and then die? ',
                    yes: {
                        // 'yes' path: user answered 'y'
                        question: 'Does your car have fuel injection? ',
                        yes: 'Get it in for service.', // 'yes' path: user answered 'y'
                        no: 'Check to ensure the choke is opening and closing.' // 'no' path: user answered 'n'
                    },
                    no: 'Get it in for service.' // 'no' path: user answered 'n'
                }
            }
        }
    }
};

// Class that encapsulates the rule traversal and user interaction logic
class DiagnosticEngine {
    constructor(rules) {
        this.engine = new Engine(undefined, { allowUndefinedFacts: true });
        this.rules = rules;
    }

    
    async traverseRules(node, answer) {
        // Base case: we've reached a final advice message
        if (typeof node[answer] === 'string') {
            return node[answer];
        }

        // Recursive case: ask the next question and continue traversing
        if (node[answer]?.question) {
            const nextAnswer = await this.yesOrNo(node[answer].question);
            return this.traverseRules(node[answer], nextAnswer);
        }

        // Fallback in case of unexpected input or structure
        return 'Get it in for service.';
    }

    async processDiagnostic() {
        try {
            // Begin diagnosis with the initial question
            const start = await this.yesOrNo('Is the car silent when you turn the key? ');
            let currentNode = this.rules.silent;
            return await this.traverseRules(currentNode, start);
        } catch (error) {
            console.error('Diagnostic error:', error);
            return 'Unable to complete diagnosis';
        }
    }

    async yesOrNo(question) {
        let answer = ''
        // Helper method to ensure user answers with 'y' or 'n'
        while (true) {
            answer = prompt(question).toLowerCase();
            if (answer === 'y' || answer === 'n') return answer === 'y' ? 'yes' : 'no';
            console.log("Please enter 'y' or 'n'.");
        }
    }
}

async function main() {
    // Initialize and run the diagnostic process
    try {
        const diagnostic = new DiagnosticEngine(diagnosticRules);
        const result = await diagnostic.processDiagnostic();
        console.log('\nDiagnosis:', result);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

main();