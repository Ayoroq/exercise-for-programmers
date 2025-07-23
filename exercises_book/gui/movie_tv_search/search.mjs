import { apiKey } from './config.mjs';

// Function to search for movies or TV shows
async function searchMedia(query) {
  try {
    query = query?.trim();
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data.results
  } catch (error) {
    console.error("Error searching media:", error);
  }
}

// to get the images 
// poster - https://image.tmdb.org/t/p/w45/d5NXSklXo0qyIYkgV94XAgMIckC.jpg
// backdrop - https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg

const results = await searchMedia("Rye Lane");
console.log(results);
// Replace with your actual API key
// Note: Ensure to handle the API key securely in production environments.