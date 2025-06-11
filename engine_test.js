import promptSync from 'prompt-sync';
const prompt = promptSync({ sigint: true });

import { Engine } from 'json-rules-engine';

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



const diagnosticRules = {
    silent: {
        condition: 'turnKey',
        yes: {
            question: 'Are the battery terminals corroded?',
            yes: 'Clean terminals and try starting again.',
            no: 'Replace cables and try again.'
        },
        no: {
            question: 'Does the car make a clicking noise?',
            yes: 'Replace the battery.',
            no: {
                question: 'Does the car crank up but fail to start?',
                yes: 'Check spark plug connections.',
                no: {
                    question: 'Does the engine start and then die?',
                    yes: {
                        question: 'Does your car have fuel injection?',
                        yes: 'Get it in for service.',
                        no: 'Check to ensure the choke is opening and closing.'
                    },
                    no: 'Get it in for service.'
                }
            }
        }
    }
};

class DiagnosticEngine {
    constructor(rules) {
        this.engine = new Engine(undefined, { allowUndefinedFacts: true });
        this.rules = rules;
    }

    async processDiagnostic() {
        try {
            const start = await this.yesOrNo('Is the car silent when you turn the key? ');
            let currentNode = this.rules.silent;
            
            return await this.traverseRules(currentNode, start);
        } catch (error) {
            console.error('Diagnostic error:', error);
            return 'Unable to complete diagnosis';
        }
    }

    async traverseRules(node, answer) {
        if (typeof node[answer] === 'string') {
            return node[answer];
        }

        if (node[answer]?.question) {
            const nextAnswer = await this.yesOrNo(node[answer].question);
            return this.traverseRules(node[answer], nextAnswer);
        }

        return 'Get it in for service.';
    }

    async yesOrNo(question) {
        while (true) {
            const answer = prompt(question).toLowerCase();
            if (answer === 'y' || answer === 'n') return answer;
            console.log("Please enter 'y' or 'n'.");
        }
    }
}

async function main() {
    try {
        const diagnostic = new DiagnosticEngine(diagnosticRules);
        const result = await diagnostic.processDiagnostic();
        console.log('\nDiagnosis:', result);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}