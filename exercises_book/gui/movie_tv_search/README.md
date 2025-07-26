# Movie & TV Show Search Application

A dynamic web application that allows users to search for movies and TV shows, displaying detailed information including cast, ratings, release dates, and more. Built with vanilla JavaScript and The Movie Database (TMDb) API.

## Overview

This application provides an intuitive search interface where users can find movies and TV shows by typing in the search bar. As they type, a dropdown appears with matching results, and selecting an item displays comprehensive details about the selected media.

## Features

- **Real-time Search**: Search results appear as you type with autocomplete functionality
- **Comprehensive Media Information**: Displays title, overview, cast, ratings, release date, and backdrop images
- **Dual Media Support**: Searches both movies and TV shows simultaneously
- **Interactive UI**: Clean, responsive design with hover effects and smooth transitions
- **Cast Information**: Shows top 5 cast members with their character names
- **High-Quality Images**: Fetches poster and backdrop images from TMDb

## Project Structure

```
movie_tv_search/
├── index.html        # Main HTML file with the user interface
├── search.js         # Main JavaScript file handling API requests and DOM manipulation
├── style.css         # Main stylesheet for the application
├── reset.css         # CSS reset for consistent styling
├── config.js         # Configuration file for TMDb API key
├── logo.jpg          # Application logo image
└── .gitignore        # Git ignore file
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: The Movie Database (TMDb) API
- **Styling**: CSS Grid and Flexbox for responsive layout
- **Features**: Async/await for API calls, DOM manipulation, event handling

## API Integration

The application uses The Movie Database (TMDb) API to fetch:

1. **Multi-search endpoint**: Searches both movies and TV shows
2. **Credits endpoint**: Retrieves cast information for movies and TV shows
3. **Image API**: Fetches poster and backdrop images in various sizes

### Key API Endpoints Used

- Search: `https://api.themoviedb.org/3/search/multi`
- Movie Credits: `https://api.themoviedb.org/3/movie/{id}/credits`
- TV Credits: `https://api.themoviedb.org/3/tv/{id}/credits`
- Images: `https://image.tmdb.org/t/p/{size}/{path}`

## Setup and Installation

### Prerequisites

- A modern web browser
- TMDb API key (free registration at https://www.themoviedb.org/settings/api)

### Installation Steps

1. Navigate to the movie_tv_search directory:
   ```
   cd gui/movie_tv_search
   ```

2. Configure your TMDb API key:
   - Open `config.js`
   - Replace the existing API key with your own TMDb API key:
   ```javascript
   const apiKey = 'YOUR_TMDB_API_KEY';
   ```

3. Open `index.html` in your web browser

## How It Works

1. **User Input**: User types in the search bar
2. **Real-time Search**: Application fetches matching movies and TV shows from TMDb
3. **Results Display**: Search results appear in a dropdown with poster, title, year, and top cast
4. **Selection**: User clicks on a result to view detailed information
5. **Details Update**: Main page updates with comprehensive media information including backdrop, overview, full cast, and metadata


## User Interface Features

### Search Functionality
- Real-time search with dropdown results
- Displays poster thumbnails, titles, release years, and top cast members
- Smooth hover effects and transitions

### Media Details Display
- Large backdrop image
- Comprehensive overview/synopsis
- Cast list with character names
- Ratings, release date, and other metadata
- Responsive grid layout

### Styling Highlights
- CSS Grid for main layout structure
- Flexbox for component alignment
- Custom color scheme with coral accent
- Smooth transitions and hover effects
- Responsive design principles

## Future Enhancements

- Add genre filtering options
- Implement user favorites/watchlist functionality
- Add trailer integration
- Include similar movies/shows recommendations
- Add pagination for search results
- Implement dark mode toggle

## Troubleshooting

- **No search results**: Verify your TMDb API key in config.js
- **Images not loading**: Check network connection and API key validity
- **API errors**: Ensure you haven't exceeded TMDb API rate limits

## Credits

- Movie and TV show data provided by [The Movie Database (TMDb)](https://www.themoviedb.org/)
- Images and metadata courtesy of TMDb API
- Logo image from Unsplash