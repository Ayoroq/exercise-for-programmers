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
    return data.results.slice(0, 7).map(item => ({
      id: item.id,
      title: item.original_title || item.title,
      poster: item.poster_path,
      backdrop: item.backdrop_path,
      overview: item.overview,
      releaseDate: item.release_date || '',
      voteAverage: item.vote_average,
  
    }));

  } catch (error) {
    console.error("Error searching media:", error);
  }
}

// id: 438631,
// to get the images 
// poster - https://image.tmdb.org/t/p/w45/d5NXSklXo0qyIYkgV94XAgMIckC.jpg
// backdrop - https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg

const results = await searchMedia("Dune");
console.log(results);

// async function test () {
//   const response = await fetch(`https://api.themoviedb.org/3/movie/438631/credits?api_key=${apiKey}`);
//    const data = await response.json();
//    console.log(data.cast.slice(0,10));
// }
// Replace with your actual API key
// Note: Ensure to handle the API key securely in production environments.

// await test();