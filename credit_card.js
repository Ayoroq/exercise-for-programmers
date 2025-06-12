// Import prompt-sync for handling user input
const prompt = require("prompt-sync")({sigint: true});

// Base class for credit card calculations
class alpha{
    constructor(){
        this.prompt = prompt;
    }

    // Validate numeric input from user
    inputValidation(question){
        while(true){
            let input = Number(prompt(question));
            if (input <= 0 || isNaN(input)) {
                console.log("Please enter a valid value.");
                continue;
            }
            return input;
        }
    }

    // Validate command line arguments for calculation type
    argumentValidation(args){
        let param;
        if (process.argv[2] === undefined){
            throw new Error("Please specify 'm' for monthly payment or 't' for time until paid off as the second parameter")
        }else if (process.argv[2].toLowerCase() != "m" && process.argv[2].toLowerCase() != "t"){
            throw new Error("Please specify 'm' for monthly payment or 't' for time until paid off as the second parameter")
        }else{
            param = process.argv[2].toLowerCase();
        }
        return param;
    }

    // Main execution method that determines calculation type
    run(){
        try{
            const param = this.argumentValidation();
            if (param === "m"){
                // Calculate monthly payment amount
                const credit = new creditAmount();
                credit.run();
            }else{
                // Calculate time to pay off
                const credit = new creditTime();
                credit.run();
            }
        }catch(error){
            console.error(`Error: ${error.message}`);
        }    
        process.exit(0);
    }   
}

// Class for calculating monthly payment amount
class creditAmount extends alpha{
    constructor(){
        super();
    }

    // Get required inputs from user
    input(){
        const balance = this.inputValidation("What is your balance: $");
        const months = this.inputValidation("In how many months do you want to pay off the card? ");
        const APR = this.inputValidation("What is the APR on the card (as a percent) ");
        return [months, APR, balance];
    }

    // Calculate required monthly payment
    amountToPay(months, APR, balance){
        const monthlyRate = (APR / 100) / 12;  // Convert APR to monthly rate
        const monthlyPayment = (balance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
        return monthlyPayment;
    }

    // Execute monthly payment calculation
    run(){
        try{
            const [months, APR, balance] = this.input();
            const monthlyPayment = this.amountToPay(months, APR, balance);
            console.log(`You will have to pay $${monthlyPayment.toFixed(2)} per month to pay off $${balance} in ${months} months.`);
        }catch(error){
            console.error(`Error: ${error.message}`);
        }
    }
}

// Class for calculating time until paid off
class creditTime extends alpha{
    constructor(){
        super();
    }

    // Get required inputs from user
    input(){
        const balance = this.inputValidation("What is your balance: $");
        const APR = this.inputValidation("What is the APR on the card (as a percent) ");
        const monthlyPayment = this.inputValidation("What is your monthly payment: $");
        return [balance, APR, monthlyPayment];
    }

    // Calculate months needed to pay off balance
    calculateMonthsUntilPaidOff(balance, APR, monthlyPayment){
        const dailyRate = (APR / 100) / 365;  // Convert APR to daily rate
        // Formula: n = -(1/30) * log(1 + B/P * (1 - (1 + i)^30)) / log(1 + i)
        // where n is months, B is balance, P is payment, i is daily rate
        const n = -1/30 * Math.log(1 + balance/monthlyPayment * (1 - (1 + dailyRate)**30)) / Math.log(1 + dailyRate);
        return Math.ceil(n);  // Round up to nearest month
    }

    // Execute time calculation
    run(){
        try{
            const [balance, APR, monthlyPayment] = this.input();
            const months = this.calculateMonthsUntilPaidOff(balance, APR, monthlyPayment);
            console.log(`It will take you ${months} months to pay off this card.`);
        }catch(error){
            console.error(`Error: ${error.message}`);
        }
    }
}

// Run the program if executed directly
if (require.main === module) {
    const checker = new alpha();
    checker.run();
}

// Export classes for testing
module.exports = {
    CreditCalculator: alpha,
    PaymentCalculator: creditAmount,
    TimeCalculator: creditTime
};