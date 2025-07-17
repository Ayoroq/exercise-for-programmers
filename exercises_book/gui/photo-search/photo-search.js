// Function to get images from Unsplash
async function getImages(query) {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=20&client_id=${accessKEY}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data.map((photo) => ({
      id: photo.id,
      url: photo.urls.regular,
      alt: photo.alt_description,
    }));
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

// function to get posts from reddit
async function getPosts(query) {
  try {
    const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=20`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; photo-search-app/1.0)",
      },
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
    }));
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

//function to clear the all child element from the list
function clearList() {
  const unOrderedList = document.querySelector(".gallery");
  unOrderedList.textContent = "";
}

// function to process data
function processData(imageData, textData) {
  let imageElementUrl = "", imageElementAlt = "", imageCaption = "";
  try {
    imageData.forEach((image, index) => {
      imageElementUrl = image.url;
      imageElementAlt = image.alt;
      imageCaption = textData[index]?.title || "No title available";
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
  return { imageElementUrl, imageElementAlt, imageCaption };
}

// function to populate data
function populateData(imageData, textData) {
  try {
    const { imageElementUrl, imageElementAlt, imageCaption } = processData(imageData, textData);
    const unOrderedList = document.querySelector(".gallery");
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    const caption = document.createElement("p");
    image.src = imageElementUrl;
    image.alt = imageElementAlt;
    caption.textContent = imageCaption;
    listItem.appendChild(image);
    listItem.appendChild(caption);
    unOrderedList.appendChild(listItem);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

// main function to run process
async function main(query) {
  try {
    const imageData = await getImages(query);
    console.log(imageData);
    const textData = await getPosts(query);
    console.log(textData);
    if (!imageData || !textData) {
      throw new Error("Failed to fetch data");
    }
    if (imageData.length !== textData.length) {
      throw new Error("Mismatch in data lengths");
    }
    clearList();
    populateData(imageData, textData);
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

