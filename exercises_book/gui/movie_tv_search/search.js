// import { apiKey } from "./config.js";

// Cache implementation
class SimpleCache {
  constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutes TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key, value) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

// Create cache instances
const searchCache = new SimpleCache(30, 5 * 60 * 1000); // Cache 30 search queries for 5 minutes
const castCache = new SimpleCache(100, 10 * 60 * 1000);  // Cache 100 cast results for 10 minutes

// Cache statistics
let cacheStats = {
  searchHits: 0,
  searchMisses: 0,
  castHits: 0,
  castMisses: 0
};

function showErrorMessage(message) {
  const searchResultsList = document.querySelector(".search-results-list");
  searchResultsList.innerHTML = `<li class="error-message">${message}</li>`;
}

function showCacheStatus(isFromCache, type = 'search') {
  if (isFromCache) {
    console.log(`⚡ ${type} result from cache`);
    // Optional: Show visual indicator
    const indicator = document.createElement('div');
    indicator.textContent = '⚡ From cache';
    indicator.style.cssText = 'font-size: 12px; color: green; margin: 5px; opacity: 0.7;';
    const container = document.querySelector('.search-results-list');
    if (container) {
      container.prepend(indicator);
      setTimeout(() => indicator.remove(), 2000);
    }
  }
}

async function searchMedia(query) {
  const cacheKey = `search_${query.toLowerCase().trim()}`;
  
  // Check cache first
  const cached = searchCache.get(cacheKey);
  if (cached) {
    cacheStats.searchHits++;
    showCacheStatus(true, 'search');
    return cached;
  }

  cacheStats.searchMisses++;
  
  try {
    query = query?.trim();
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&api_key=${apiKey}`);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const results = data.results.slice(0, 10).map((item) => ({
      id: item.id,
      title: item.original_title || item.original_name,
      poster: item.poster_path,
      backdrop: item.backdrop_path,
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date,
      voteAverage: item.vote_average,
      mediaType: item.media_type,
    }));

    // Cache the results
    searchCache.set(cacheKey, results);
    return results;
  } catch (error) {
    showErrorMessage("Search failed. Please try again.");
    return [];
  }
}

//function to process the search results
function processSearchResults(results) {
  if (!results || results.length === 0) {
    console.log("No results found.");
    return [];
  }
  return results.filter((items) => Object.values(items).every((value) => value !== null && value !== undefined && value !== ""));
}

// Function to get the cast of a movie or TV show
async function getCast(id, type) {
  const cacheKey = `cast_${type}_${id}`;
  
  // Check cache first
  const cached = castCache.get(cacheKey);
  if (cached) {
    cacheStats.castHits++;
    showCacheStatus(true, 'cast');
    return cached;
  }

  cacheStats.castMisses++;

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
    
    const cast = data.cast.slice(0, 10).map((actor) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profilePath: actor.profile_path,
    }));

    // Cache the results
    castCache.set(cacheKey, cast);
    return cast;
  } catch (error) {
    console.error("Error fetching cast:", error);
    return [];
  }
}

//function to process the cast data
function processCastData(cast) {
  if (!cast || cast.length === 0) {
    console.log("No cast data found.");
    return [];
  }
  const filtered = cast.filter((actor) => Object.values(actor).every((value) => value !== null && value !== undefined && value !== ""));
  return filtered.slice(0, 5).map((actor) => ({
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
    return null;
  }
}

//Loading state function
function showLoading() {
  const searchResultsList = document.querySelector(".search-results-list");
  searchResultsList.innerHTML = '<li class="loading">Searching...</li>';
}

// function to update HTML main page with the selected media details
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

// Cache management functions
function clearCache() {
  searchCache.clear();
  castCache.clear();
  cacheStats = {
    searchHits: 0,
    searchMisses: 0,
    castHits: 0,
    castMisses: 0
  };
  console.log('Cache cleared');
}

function getCacheStats() {
  const searchStats = searchCache.getStats();
  const castStats = castCache.getStats();
  
  return {
    search: {
      ...searchStats,
      hits: cacheStats.searchHits,
      misses: cacheStats.searchMisses,
      hitRate: cacheStats.searchHits + cacheStats.searchMisses > 0 
        ? (cacheStats.searchHits / (cacheStats.searchHits + cacheStats.searchMisses) * 100).toFixed(1) + '%'
        : '0%'
    },
    cast: {
      ...castStats,
      hits: cacheStats.castHits,
      misses: cacheStats.castMisses,
      hitRate: cacheStats.castHits + cacheStats.castMisses > 0 
        ? (cacheStats.castHits / (cacheStats.castHits + cacheStats.castMisses) * 100).toFixed(1) + '%'
        : '0%'
    }
  };
}

// function to handle the display of search results when user types in the search bar
let results;

async function displaySearchResults(query) {
  results = null;
  const searchResultsList = document.querySelector(".search-results-list");
  searchResultsList.innerHTML = ""; // Clear previous results
  
  if (query) {
    showLoading();
    results = await getMediaDetails(query);
    if (!results) {
      showErrorMessage("No results found");
      return;
    }
    
    // Clear loading and show results
    searchResultsList.innerHTML = "";
    
    for (const result of results) {
      const listItem = document.createElement("li");
      listItem.classList.add("search-result-item");
      listItem.setAttribute("media-id", result.id);
      listItem.innerHTML = `
       <img src="${result.poster}" class="search-result-image" alt="${result.title} Poster" />
        <p class="drop-down-item">
          <span class="drop-down-title">${result.title}</span>
          <span class="drop-down-year">${result.releaseDate ? result.releaseDate.split("-")[0] : 'N/A'} </span>
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

// Event listener for when values are being typed in the search
let searchTimeout;
document.querySelector(".search").addEventListener("input", (event) => {
  const searchResult = document.querySelector(".search-results");
  searchResult.classList.add("is-visible");
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    displaySearchResults(event.target.value);
  }, 300);
});

// Event listener for when a search result is selected
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

// Clear cache on page unload
window.addEventListener('beforeunload', () => {
  clearCache();
});

// Expose cache functions globally for debugging
window.clearCache = clearCache;
window.getCacheStats = getCacheStats;

// Log cache stats every 30 seconds (optional)
setInterval(() => {
  const stats = getCacheStats();
  console.log('Cache Stats:', stats);
}, 30000);