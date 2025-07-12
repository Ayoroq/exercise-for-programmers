import Prompt from "prompt-sync";
const prompt = Prompt({ sigint: true });

import countryList from "iso-3166-country-list";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const apiKey = process.env.WEATHER_API_KEY;

const windDirectionMap = new Map([
  [10, "North wind"],
  [20, "North-northeast wind"],
  [30, "North-northeast wind"],
  [40, "Northeast wind"],
  [50, "Northeast wind"],
  [60, "East-northeast wind"],
  [70, "East-northeast wind"],
  [80, "East wind"],
  [90, "East wind"],
  [100, "East wind"],
  [110, "East-southeast wind"],
  [120, "East-southeast wind"],
  [130, "Southeast wind"],
  [140, "Southeast wind"],
  [150, "South-southeast wind"],
  [160, "South-southeast wind"],
  [170, "South wind"],
  [180, "South wind"],
  [190, "South wind"],
  [200, "South-southwest wind"],
  [210, "South-southwest wind"],
  [220, "Southwest wind"],
  [230, "Southwest wind"],
  [240, "West-southwest wind"],
  [250, "West-southwest wind"],
  [260, "West wind"],
  [270, "West wind"],
  [280, "West wind"],
  [290, "West-northwest wind"],
  [300, "West-northwest wind"],
  [310, "Northwest wind"],
  [320, "Northwest wind"],
  [330, "North-northwest wind"],
  [340, "North-northwest wind"],
  [350, "North wind"],
  [360, "North wind"],
]);

// function to get the LAT and LONG for cities
async function getLatLong(city, countryCode) {
  try {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=5&appid=${apiKey}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const lat = data[0].lat;
    const lon = data[0].lon;
    return { lat, lon };
  } catch (error) {
    console.log(error);
  }
}

// function to get the current weather information for a city
async function getCurrentWeather(city, countryCode) {
  try {
    const { lat, lon } = await getLatLong(city, countryCode);
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
  const time = date.toLocaleTimeString({hour12: false });
  //const time = date.toUTCString() //This can be changed to return utc time. For the purpose of this exercise, sticking to local time
  return time;
}
// get wind direction
function getWindDirection(degree) {
  const roundedDegree = Math.round(degree / 10) * 10;
  return windDirectionMap.get(roundedDegree);
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
    const countryName = countryList.name(data.sys.country) === undefined ? "Unknown" : data.sys.country;

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
    return { information, longestKey, longestValue, weatherMessage, cityName, countryName};
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
    console.log("\nPlease enter the city and country code (e.g. Toronto, Canada): \n");
    const location = prompt("Where are you? ");
    const [city, countryName] = location.split(",").map((str) => str.trim());
    return { city, countryName };
  } catch (e) {
    console.log(e);
  }
}

// function to process user's data to confirm the country code is valid
function validateUserInput() {
  try {
    let { city, countryName } = getUserLocation();
    countryName = countryName.trim().toLowerCase().charAt(0).toUpperCase() + countryName.trim().toLowerCase().slice(1);
    const isCountryValid = countryList.names.includes(countryName);
    if (!isCountryValid) {
      console.log("Invalid country name. Please try again.");
      return validateUserInput();
    }
    const countryCode = countryList.code(countryName);
    return { city, countryCode };
  } catch (error) {
    console.log(error);
  }
}

// main function
async function main() {
  const { city, countryCode } = validateUserInput();
  const data = await getCurrentWeather(city, countryCode);
  printWeatherInfo(data);
}

// start the program
main();

//console.log(countryList.names.includes("Togo"))