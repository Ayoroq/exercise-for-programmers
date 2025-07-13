import Prompt from "prompt-sync";
const prompt = Prompt({ sigint: true });
import { select } from "@inquirer/prompts";

import countryList from "iso-3166-country-list";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const apiKey = process.env.WEATHER_API_KEY;

const windDirections = [
  "North", "North-northeast", "Northeast", "East-northeast",
  "East", "East-southeast", "Southeast", "South-southeast",
  "South", "South-southwest", "Southwest", "West-southwest",
  "West", "West-northwest", "Northwest", "North-northwest"
];

// function to get the LAT and LONG for cities
async function getLatLong(city, countryCode) {
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

//function to select a choice if multiple options
async function selectCity(cityArrayData) {
  try {
    let choice = [];
    cityArrayData.forEach((cityArray) => {
      choice.push({
        name: `${cityArray[0]}, ${cityArray[1]}, ${cityArray[2]}`,
        value: cityArray,
      });
    });
    const answer = await select({
      message: "Multiple cities were found. Please select the desired city:",
      choices: choice,
    });
    return answer;
  } catch (error) {
    console.log(error);
  }
}

//function to confirm the number of data points
async function validateDataResult(data) {
  try {
    if (data.length === 1) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      return { lat, lon };
    }
    let dataResults = [];
    if (data.length > 1) {
      for (let i = 0; i < data.length; i++) {
        dataResults.push([data[i].name, data[i].state, data[i].country, data[i].lat, data[i].lon]);
      }
    }
    const answer = await selectCity(dataResults);
    const lat = answer[3];
    const lon = answer[4];
    return { lat, lon };
  } catch (error) {
    console.log(error);
  }
}

// function to get the current weather information for a city
async function getCurrentWeather(city, countryCode) {
  try {
    const geoData = await getLatLong(city, countryCode);
    if (!geoData || geoData.length === 0) {
      throw new Error("No data found for the given city. Please try again.");
    }
    const { lat, lon } = await validateDataResult(geoData);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// convert temp to fahrenheit
function convertToFahrenheit(temp) {
  return (Number(temp) * 9) / 5 + 32;
}

// convert to sunrise and sunset times
function getSunriseSunsetTime(unixTime) {
  const date = new Date(unixTime * 1000);
  const time = date.toLocaleTimeString({ hour12: false });
  //const time = date.toUTCString() //This can be changed to return utc time. For the purpose of this exercise, sticking to local time
  return time;
}
// get wind direction
function getWindDirection(degree) {
  const index = Math.round((degree % 360) / 22.5) % 16;
  return `${windDirections[index]} wind`;
}

// function to get weather message
function getWeatherMessage(tempCelsius, description) {
  const desc = description.toLowerCase();

  if (tempCelsius >= 20 && tempCelsius <= 25 && desc.includes("clear")) {
    return `It's a nice day out!`;
  }

  if (tempCelsius >= 28 && desc.includes("sun")) {
    return `It's sunny and hot — stay hydrated!`;
  }

  if (tempCelsius < 10 && desc.includes("clear")) {
    return `It's chilly but clear — grab a jacket!`;
  }

  if (desc.includes("rain")) {
    return `Don't forget your umbrella — it's rainy!`;
  }

  if (desc.includes("snow")) {
    return `Bundle up! It's snowy outside.`;
  }

  if (desc.includes("cloud") && tempCelsius > 15) {
    return `A bit cloudy, but still decent!`;
  }

  if (desc.includes("cloud") && tempCelsius <= 15) {
    return `Cloudy and cool — might want a sweater.`;
  }

  if (desc.includes("storm")) {
    return `Stormy weather — better stay indoors.`;
  }

  return "Weather's a bit hard to read — stay prepared!";
}

// process data
function processData(data) {
  try {
    let information = {};
    information["Temperature Celsius"] = data.main.temp + "°C";
    information["Temperature Fahrenheit"] = convertToFahrenheit(data.main.temp).toPrecision(4) + "°F";
    information.Sunrise = getSunriseSunsetTime(data.sys.sunrise);
    information.Sunset = getSunriseSunsetTime(data.sys.sunset);
    information.Humidity = data.main.humidity;
    information["Weather Description"] = data.weather[0].description;
    information["Wind Speed"] = data.wind.speed + " m/s";
    information["Wind Direction"] = getWindDirection(data.wind.deg);
    const cityName = data.name;
    const countryName = countryList.name(data.sys.country) || data.sys.country;

    let longestKey = 0;
    let longestValue = 0;
    for (let [key, value] of Object.entries(information)) {
      if (key.length > longestKey) {
        longestKey = key.length;
      }
      if (value.toString().length > longestValue) {
        longestValue = value.toString().length;
      }
    }
    const weatherMessage = getWeatherMessage(data.main.temp, data.weather[0].description);
    return { information, longestKey, longestValue, weatherMessage, cityName, countryName };
  } catch (error) {
    console.log(error);
  }
}

// function to print information to screen
function printWeatherInfo(data) {
  try {
    let { information, longestKey, longestValue, weatherMessage, cityName, countryName } = processData(data);
    console.log(`\nWeather Information for ${cityName}, ${countryName}: \n`);
    console.log("Current Weather".padEnd(longestKey, " ") + " | " + "Value".padEnd(longestValue, " "));
    console.log("-".padEnd(longestKey, "-") + " | " + "-".padEnd(longestValue, "-"));
    for (let [key, value] of Object.entries(information)) {
      console.log(key.padEnd(longestKey, " ") + " | " + value.toString().padEnd(longestValue, " "));
    }
    console.log("\n" + weatherMessage + "\n");
  } catch (error) {
    console.log(error);
  }
}

// function to get the city and country code from the user
function getUserLocation() {
  try {
    console.log("\nPlease enter the city and country code (e.g. Toronto, CA): \n");
    const location = prompt("Where are you? ");
    const userInputs = location.split(",").map((str) => str.trim());
    if (userInputs.length !== 2) {
      console.log("\nInvalid input. Please try again.");
      return getUserLocation();
    }
    const city = userInputs[0];
    const countryCode = userInputs[1];
    return { city, countryCode };
  } catch (e) {
    console.log(e);
  }
}

// function to process user's data to confirm the country code is valid
function validateUserInput() {  
  while (true) {
    try {
      let { city, countryCode } = getUserLocation();
      const isCountryValid = countryList.codes.includes(countryCode.toUpperCase());
      if (isCountryValid) {
        return { city, countryCode };
      }
      console.log("\nInvalid country code. Please try again.");
    } catch (error) {
      console.log(error);
    }
  }
}

// main function
async function main() {
  try {
    const { city, countryCode } = validateUserInput();
    const data = await getCurrentWeather(city, countryCode);
    if (data) {
      printWeatherInfo(data);
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
}

// start the program
main();