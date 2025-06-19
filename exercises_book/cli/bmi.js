const prompt = require('prompt-sync')({sigint: true});

let unit;
if (process.argv[2] === undefined) {
    console.log("Please specify the unit of measurement as either 'metric' or 'imperial' as third parameter.");
    process.exit(1);
} else if (process.argv[2].toLowerCase() !== "metric" && process.argv[2].toLowerCase() !== "imperial") {
    console.log("Please specify the unit of measurement as either 'metric' or 'imperial' as third parameter.");
    process.exit(1);
} else {
    unit = process.argv[2].toLowerCase();
}

class BMICalculator {
    constructor(weight = 0, height = 0) {
        this.weight = weight;
        this.height = height;
    }

    validateInput() {
        let attempts = 0;
        const maxAttempts = 5;

        do {
            this.weight = parseFloat(prompt(`What is your weight in ${unit === 'imperial' ? 'pounds' : 'kilograms'}: `));
            this.height = parseFloat(prompt(`What is your height in ${unit === 'imperial' ? 'inches' : 'centimeters'}: `));
            if (isNaN(this.weight) || isNaN(this.height) || this.weight <= 0 || this.height <= 0) {
                console.log("Invalid input. Please enter valid numbers for weight and height.");
                attempts++;
                if (attempts >= maxAttempts) {
                    console.log("Maximum attempts reached. Exiting program.");
                    process.exit(1);
                }
            }
        } while (isNaN(this.weight) || isNaN(this.height) || this.weight <= 0 || this.height <= 0);
    }

    calculateBMI() {
        if (unit === 'imperial') {
            return (this.weight / (this.height * this.height)) * 703;
        } else if (unit === 'metric') {
            return (this.weight / (this.height * this.height)) * 10000;
        }
    }

    getCategory(bmi) {
        if (bmi >= 18.5 && bmi < 24.9) {
            return "You are in the normal weight range.";
        } else if (bmi < 18.5) {
            return "You are underweight. You should see your doctor.";
        } else {
            return "You are overweight. You should see your doctor.";
        }
    }
    
    
    run() {
        try {
            this.validateInput();
            const bmi = this.calculateBMI();
            console.log(`Your BMI is ${bmi.toFixed(2)}`);
            console.log(this.getCategory(bmi));
            
        } catch (error) {
           console.error("An error occurred while calculating BMI. Please ensure your inputs are valid numbers and try again. Error details:", error.message);
            return;
        }
    }

}

const bmiCalc = new BMICalculator();
bmiCalc.run()