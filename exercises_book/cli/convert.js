const prompt = require('prompt-sync')({sigint: true});


const countryCodes = Intl.supportedValuesOf("currency")

let base = null, amount = null, currency = null;
let invalidBase = false, invalidCurrency = false, invalidAmount = false;

do {
    base = prompt("What is the ISO for the currency you have? ").toUpperCase();
    const amountInput = prompt("How much do you have? ").trim();
    amount = Number(amountInput);
    const currencyInput = prompt("What is the ISO for the currency you want to convert to? ").trim();
    currency = currencyInput.toUpperCase();

    invalidBase = !base || !countryCodes.includes(base);
    invalidCurrency = !currency || !countryCodes.includes(currency);
    invalidAmount = !amountInput || isNaN(amount) || amount <= 0;

    if (invalidBase) console.log("Invalid base currency code.");
    if (invalidCurrency) console.log("Invalid target currency code.");
    if (invalidAmount) console.log("Amount must be a number greater than 0.");
} while (invalidBase || invalidCurrency || invalidAmount);

let baseName = new Intl.DisplayNames(['en'], {type: 'currency'}).of(base);
let currencyName = new Intl.DisplayNames(['en'], {type: 'currency'}).of(currency);


const url = "https://v6.exchangerate-api.com/v6"
const app_id = '855e6270dd6b11a7fbc9ca9c'

// This function fetches the exchange rate for the given base currency to the target currency.
// It uses the ExchangeRate-API and returns the conversion rate if available, or null in case of an error.
const rate  = async () => {
    try {
        const response = await fetch(`${url}/${app_id}/latest/${base}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.conversion_rates && data.conversion_rates[currency]) {
            return data.conversion_rates[currency];
        } else {
            console.error('Error: Target currency not found in the API response.');
            return null;
        }
    }
    catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}

const convert = async () => {
    const exchangeRate = await rate();
    if (exchangeRate === null) {
        console.log("Conversion could not be completed due to an error with the exchange rate.");
        return;
    }
    // Calculate the converted amount and format it for display
    const newAmount = amount * exchangeRate;
    base = new Intl.NumberFormat('en', { style: 'currency', currency: base }).format(amount);
    const formattedCurrency = new Intl.NumberFormat('en', { style: 'currency', currency: currency }).format(newAmount);
    console.log(`${base} at an exchange rate of ${exchangeRate} is\n${formattedCurrency} ${currencyName}`);
};


convert();