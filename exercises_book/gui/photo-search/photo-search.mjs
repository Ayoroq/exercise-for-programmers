// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config({ path: "../../../.env" });

const accessKEY = process.env.UNSPLASH_API_ACCESS_KEY;

// Function to get images from Unsplash
async function getImages(query) {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=5&client_id=${accessKEY}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      alt: photo.alt_description,
    }))
  } catch (error) {
    console.log(error);
  }
}

// function to get posts from reddit
async function getPosts(query) {
  try {
    const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; photo-search-app/1.0)"
      }
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response: not JSON");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch posts");
    }
    return data.data.children.map((post) => ({
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      subreddit: post.data.subreddit,
      selftext: post.data.selftext,
    }));
  } catch (error) {
    console.log(error);
  }
}

const post = await getPosts('cats');
console.log(post);

// console.log(await getImages('cats'))
// getPosts('cats');