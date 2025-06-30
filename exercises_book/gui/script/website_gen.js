const zip = new JSZip(); // Create a new JSZip instance for zipping files
let result = document.getElementById("result"); // Result message element
let js_yes = document.getElementById("javascript-yes"); // JS "yes" radio button
let js_no = document.getElementById("javascript-no");   // JS "no" radio button
let css_yes = document.getElementById("css-yes");       // CSS "yes" radio button
let css_no = document.getElementById("css-no");         // CSS "no" radio button

// Validate user input for site name, author, and radio selections
function validateInput() {
  const websiteName = document.getElementById("websiteName").value === undefined ? "" : document.getElementById("websiteName").value.trim();
  const author = document.getElementById("authorName").value === undefined ? "" : document.getElementById("authorName").value.trim();

  let isWebsiteNameValid = true;
  if (!/^[a-zA-Z0-9._-]+$/.test(websiteName) || websiteName === "") {
    result.innerText = "Please enter a valid site name";
    isWebsiteNameValid = false;
  }
  let isAuthorNameValid = true;
  if (author === "" && isWebsiteNameValid) {
    result.innerText = "Please enter a valid author name";
    isAuthorNameValid = false;
  }

  let isButtonSelected = true;
  // Ensure both JS and CSS radio buttons are selected
  if (((!js_yes.checked && !js_no.checked) || (!css_yes.checked && !css_no.checked)) && isAuthorNameValid && isWebsiteNameValid) {
    result.innerText = "Please make all selections to generate file";
    isButtonSelected = false;
  }

  // Show the generate button if all inputs are valid
  if (isWebsiteNameValid && isAuthorNameValid && isButtonSelected) {
    result.innerText = "";
    document.getElementById("button-div").style.display = "block";
  }

  return { isAuthorNameValid, isWebsiteNameValid };
}

// Hide the generate button if required fields are empty
function displayGenerate() {
  let sitename = document.getElementById("websiteName").value;
  let author = document.getElementById("authorName").value;
  if (author == "" || sitename == "") {
    document.getElementById("button-div").style.display = "none";
  }
}

// Generate the website zip file based on user input
function generate() {
  event.preventDefault();
  let websiteName = document.getElementById("websiteName").value.trim();
  let author = document.getElementById("authorName").value.trim();
  let text = `Created ./${websiteName}`;
  // Always put index.html inside the site folder
  const indexFilePath = `${websiteName}/index.html`;
  zip.file(
    indexFilePath,
    `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${websiteName}</title>
              <meta name="author" content="${author}">
          </head>
          <body>
              <h1>${websiteName}</h1>
          </body>
          </html>`
  );
  text += `\nCreated ./${websiteName}/index.html`;
  // Create js folder if selected
  if (js_yes.checked) {
    zip.folder(`${websiteName}/js`);
    text += `\nCreated ./${websiteName}/js/`;
  }
  // Create css folder if selected
  if (css_yes.checked) {
    zip.folder(`${websiteName}/css`);
    text += `\nCreated ./${websiteName}/css/`;
  }
  // Generate and download the zip file
  zip.generateAsync({ type: "blob" }).then(
    function (blob) {
      result.innerText = text;
      saveAs(blob, `${websiteName}.zip`); // Trigger the download
    },
    function (err) {
      console.log(err);
    }
  );
}

// Add event listeners for validation and button display
document.getElementById("websiteName").addEventListener("focusout", validateInput);
document.getElementById("authorName").addEventListener("focusout", validateInput);
document.getElementById("websiteName").addEventListener("input", displayGenerate);
document.getElementById("authorName").addEventListener("input", displayGenerate);
js_yes.addEventListener("change", validateInput);
js_no.addEventListener("change", validateInput);
css_yes.addEventListener("change", validateInput);
css_no.addEventListener("change", validateInput);
