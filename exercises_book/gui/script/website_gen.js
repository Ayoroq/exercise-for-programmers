const zip = new JSZip();
let result = document.getElementById("result");
let js_yes = document.getElementById("javascript-yes");
let js_no = document.getElementById("javascript-no");
let css_yes = document.getElementById("css-yes");
let css_no = document.getElementById("css-no");

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
  if (((!js_yes.checked && !js_no.checked) || (!css_yes.checked && !css_no.checked)) && isAuthorNameValid && isWebsiteNameValid) {
    result.innerText = "Please make all selections to generate file";
    isButtonSelected = false;
  }

  if (isWebsiteNameValid && isAuthorNameValid && isButtonSelected) {
    result.innerText = "";
    document.getElementById("button-div").style.display = "block";
  }

  return { isAuthorNameValid, isWebsiteNameValid };
}

function displayGenerate() {
  let sitename = document.getElementById("websiteName").value;
  let author = document.getElementById("authorName").value;
  if (author == "" || sitename == "") {
    document.getElementById("button-div").style.display = "none";
  }
}

function generate() {
  event.preventDefault();
  let websiteName = document.getElementById("websiteName").value.trim();
  let author = document.getElementById("authorName").value.trim();
  let text = `Created ./${websiteName}`;
  const indexFilePath = js_no.checked && css_no.checked ? `${websiteName}/index.html` : `index.html`;
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
  if (js_yes.checked) {
    zip.folder("js");
    text += `\nCreated .${websiteName}/js/`;
  }
  if (css_yes.checked) {
    zip.folder("css");
    text += `\nCreated .${websiteName}/css/`;
  }
  zip.generateAsync({ type: "blob" }).then(
    function (blob) {
      result.innerText = text;
      saveAs(blob, `${websiteName}.zip`); // 2) trigger the download
    },
    function (err) {
      console.log(err);
    }
  );
}

document.getElementById("websiteName").addEventListener("focusout", validateInput);
document.getElementById("authorName").addEventListener("focusout", validateInput);
document.getElementById("websiteName").addEventListener("input", displayGenerate);
document.getElementById("authorName").addEventListener("input", displayGenerate);
js_yes.addEventListener("change", validateInput);
js_no.addEventListener("change", validateInput);
css_yes.addEventListener("change", validateInput);
css_no.addEventListener("change", validateInput);
