
const form = document.querySelector("#profileForm");
const favoriteInput = document.querySelector("#favorite");
const result = document.querySelector("#result");
const clearButton = document.querySelector("#clearButton");

let options = [];

// Part 1: Fetch local JSON and display it in the dropdown
async function loadOptions() {
  try {
    const response = await fetch("./data/options.json");

    if (!response.ok) {
      throw new Error("Could not load local JSON");
    }

    options = await response.json();
    console.log(options);

    options.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.emoji + " " + item.name;
      favoriteInput.appendChild(option);
    });

    // Restore a saved profile after a refresh
    const saved = sessionStorage.getItem("sessionProfile");

    if (saved) {
      renderProfile(JSON.parse(saved));
    }
  } catch (error) {
    result.textContent = "Could not load game options. Check the JSON file.";
    console.error(error);
  }
}

// Part 4: Fetch data from an external API
async function getApiData() {
  const response = await fetch(
    "https://dog.ceo/api/breeds/image/random"
  );

  if (!response.ok) {
    throw new Error("API request failed");
  }

  const data = await response.json();
  console.log(data);

  return data.message;
}

// Render the saved profile on the page
function renderProfile(profile) {
  result.replaceChildren();

  const heading = document.createElement("h2");
  heading.textContent = "Your Profile";
  result.appendChild(heading);

  const name = document.createElement("p");
  name.textContent = "Name: " + profile.user.name;
  result.appendChild(name);

  const favorite = document.createElement("p");
  favorite.textContent =
    "Favorite Game: " +
    profile.selection.emoji +
    " " +
    profile.selection.name;
  result.appendChild(favorite);

  const comment = document.createElement("p");
  comment.textContent = "Comment: " + profile.user.comment;
  result.appendChild(comment);

  const dogHeading = document.createElement("h3");
  dogHeading.textContent = "Random Dog";
  result.appendChild(dogHeading);

  const dogImage = document.createElement("img");
  dogImage.src = profile.api.imageUrl;
  dogImage.alt = "Random dog from the Dog CEO API";
  dogImage.width = 250;
  result.appendChild(dogImage);
}

// Parts 2 and 3: Collect user data and save the combined object
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const selectedItem = options.find(function (item) {
    return item.id === Number(favoriteInput.value);
  });

  if (!selectedItem) {
    result.textContent = "Please choose a favorite game.";
    return;
  }

  try {
    result.textContent = "Loading your profile...";

    const imageUrl = await getApiData();

    const sessionProfile = {
      user: {
        name: document.querySelector("#name").value,
        comment: document.querySelector("#comment").value
      },
      selection: {
        id: selectedItem.id,
        name: selectedItem.name,
        emoji: selectedItem.emoji
      },
      api: {
        imageUrl: imageUrl
      }
    };

    console.log(sessionProfile);

    sessionStorage.setItem(
      "sessionProfile",
      JSON.stringify(sessionProfile)
    );

    const savedProfile = JSON.parse(
      sessionStorage.getItem("sessionProfile")
    );

    renderProfile(savedProfile);
  } catch (error) {
    result.textContent =
      "Something went wrong. Please try again.";
    console.error(error);
  }
});

// Clear the saved session
clearButton.addEventListener("click", function () {
  sessionStorage.clear();
  form.reset();

  result.replaceChildren();

  const message = document.createElement("p");
  message.textContent = "Session cleared. Create a new profile.";
  result.appendChild(message);
});

// Start the application
loadOptions();
