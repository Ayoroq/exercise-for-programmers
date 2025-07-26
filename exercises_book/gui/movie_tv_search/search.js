// import { apiKey } from "./config.js";

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
      title: item.original_title || item.original_name,
      poster: item.poster_path,
      backdrop: item.backdrop_path,
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      mediaType: item.media_type,
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
async function getCast(id, type) {
  try {
    let response;
    if (type === "tv") {
      response = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`);
    } else {
      response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`);
    }
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
        const cast = await getCast(item.id, item.mediaType);
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
function updateMediaDetails(mediaInfo, media_id) {
  // first find the item with the the selected id
  const selectedItem = mediaInfo.find((item) => item.id === parseInt(media_id));
  if (!selectedItem) {
    return;
  }

  // update the HTML with the selected media details
  const mediaContainer = document.querySelector(".media-container");
  mediaContainer.innerHTML = `
   <h1 class="title" id="title">${selectedItem.title}</h1>
          <p class="overview" id="overview">
            ${selectedItem.overview || "No overview available."}
          </p>
          `;

  // add the backdrop image
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = `
    <img class="backdrop" src="${selectedItem.backdrop}" alt="${selectedItem.title} Backdrop">
  `;

  // add the cast information
  const castList = document.querySelector(".cast-list");
  castList.innerHTML = "";
  for (const actor of selectedItem.cast) {
    const actorItem = document.createElement("li");
    actorItem.classList.add("cast-item");
    actorItem.innerHTML = `
      <span class="actor-name">${actor.name}</span>
      <span class="actor-role"> as ${actor.character}</span>
    `;
    castList.appendChild(actorItem);
  }

  // add information about reviews,genres and runtime
  const metadataContainer = document.querySelector(".metadata-container");
  metadataContainer.innerHTML = `
   <div class="ratings">
    <h3 class="rating-title">Ratings - <span class="rating" id="rating">${selectedItem.voteAverage}</span></h3>
  </div>
  <div class="release-date">
    <h3 class="release-date-title">Release Date - <span class="release-date-value" id="release-date">${selectedItem.releaseDate}</span></h3>
  </div>
  `;
}

// function to handle the display of search results when user types in the search bar
// The results is to capture the mediaDetails once and not having to call the api again
let results;

async function displaySearchResults(query) {
  const searchResultsList = document.querySelector(".search-results-list");
  searchResultsList.innerHTML = ""; // Clear previous results
  if (query) {
    results = await getMediaDetails(query);
    if (!results) {
      return;
    }
    for (const result of results) {
      const listItem = document.createElement("li");
      listItem.classList.add("search-result-item");
      listItem.setAttribute("media-id", result.id);
      listItem.innerHTML = `
       <img src="${result.poster}" class="search-result-image" alt="${result.title} Poster" />
        <p class="drop-down-item">
          <span class="drop-down-title">${result.title}</span>
          <span class="drop-down-year">${result.releaseDate.split("-")[0]} </span>
          <span class="drop-down-cast">${result.cast
            .slice(0, 3)
            .map((actor) => actor.name)
            .join(", ")}</span>
        </p>
      `;
      searchResultsList.appendChild(listItem);
    }
  }
}

// id: 438631,
// to get the images
// poster - https://image.tmdb.org/t/p/w45/d5NXSklXo0qyIYkgV94XAgMIckC.jpg
// backdrop - https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg

// Event listener for when values are being typed in the search
document.querySelector(".search").addEventListener("input", (event) => {
  const searchResult = document.querySelector(".search-results");
  searchResult.classList.add("is-visible");
  const query = event.target.value;
  displaySearchResults(query);
});

// // Event listener for when a search result is selected
document.querySelector(".search-results-list").addEventListener("click", (event) => {
  const searchResult = document.querySelector(".search-results");
  searchResult.classList.remove("is-visible");

  const item = event.target.closest(".search-result-item");
  if (!item) return;

  const mediaId = item.getAttribute("media-id");
  console.log(mediaId);

  const search = document.querySelector(".search");
  search.value = "";

  updateMediaDetails(results, mediaId);
});
