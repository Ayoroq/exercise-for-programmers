import { apiKey } from "./config.mjs";

// Function to search for movies or TV shows
async function searchMedia(query) {
  try {
    query = query?.trim();
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data.results.slice(0, 10).map((item) => ({
      id: item.id,
      title: item.original_title || item.title,
      poster: item.poster_path,
      backdrop: item.backdrop_path,
      overview: item.overview,
      releaseDate: item.release_date || "",
      voteAverage: item.vote_average,
    }));
  } catch (error) {
    console.error("Error searching media:", error);
  }
}

//function to process the search results
function processSearchResults(results) {
  if (!results || results.length === 0) {
    console.log("No results found.");
    return;
  }
  results = results.filter((items) => Object.values(items).every((value) => value !== null && value !== undefined && value !== ""));
  return results;
}

// Function to get the cast of a movie or TV show
async function getCast(id) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data.cast.slice(0, 10).map((actor) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profilePath: actor.profile_path,
    }));
  } catch (error) {
    console.error("Error fetching cast:", error);
  }
}

//function to process the cast data
function processCastData(cast) {
  if (!cast || cast.length === 0) {
    console.log("No cast data found.");
    return [];
  }
  cast = cast.filter((actor) => Object.values(actor).every((value) => value !== null && value !== undefined && value !== ""));
  return cast.slice(0, 5).map((actor) => ({
    id: actor.id,
    name: actor.name,
    character: actor.character,
    profilePath: actor.profilePath ? `https://image.tmdb.org/t/p/w45${actor.profilePath}` : null,
  }));
}

// function to get the details of a movie or TV show and its cast
async function getMediaDetails(query) {
  try {
    const data = await searchMedia(query);
    const processedData = processSearchResults(data);
    if (processedData && processedData.length > 0) {
      for (const item of processedData) {
        const cast = await getCast(item.id);
        const processedCast = processCastData(cast);
        item.cast = processedCast;
        item.poster = item.poster ? `https://image.tmdb.org/t/p/w92${item.poster}` : null;
        item.backdrop = item.backdrop ? `https://image.tmdb.org/t/p/original${item.backdrop}` : null;
      }
    } else {
      console.log("No results found for the query:", query);
      return null;
    }
    return processedData;
  } catch (error) {
    console.error("Error fetching media details:", error);
  }
}

// function to update HTML  main page with the selected media details
function updateMediaDetails(mediaInfo) {
  // first find the item with the the selected id
  const id = event.target.value;
  const selectedItem = mediaInfo.find((item) => item.id === parseInt(id));
  if (!selectedItem) {
    return;
  }
  const mediaContainer = document.querySelector(".media-container");
  mediaContainer.innerHTML = `
   <h1 class="title" id="title">${selectedItem.title}</h1>
          <p class="overview" id="overview">
            ${selectedItem.overview || "No overview available."}
          </p>
          `;

  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = `
    <img class="backdrop" src="${selectedItem.backdrop}" alt="${selectedItem.title} Backdrop">
  `;
  const castList = document.querySelector(".cast-list");
  for (const actor of selectedItem.cast) {
    const actorItem = document.createElement("li");
    actorItem.classList.add("cast-item");
    actorItem.innerHTML = `
      ${actor.name} as <span class="cast-name">${actor.character}</span>
    `;
    castList.appendChild(actorItem);
  }
}

// id: 438631,
// to get the images
// poster - https://image.tmdb.org/t/p/w45/d5NXSklXo0qyIYkgV94XAgMIckC.jpg
// backdrop - https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg

const mediaInfo = await getMediaDetails("Dune");
