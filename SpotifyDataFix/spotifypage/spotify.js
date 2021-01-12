let currIndex = -1;
let ids = [];
let currId = "";
let offset = 0;
let token = "";

function _getCookies() {
  return document.cookie.split(";").map(cookie => cookie.trim().split("=", 2))
    .reduce((acc, cookie) => ({...acc, [cookie[0]]: cookie[1]}), {});
}

function _getCookieParameters() {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // Save for 1 week
  return "path=/;expires=" + d.toUTCString();
}

function onLoad() {
  const cookies = _getCookies();
  const sizeCookie = cookies["size"];
  token = cookies?.["token"] || "";

  for (let i = 0; i < sizeCookie; i++) {
    if (!cookies[i].includes("|||")) {
      currIndex = i;

      const cells = cookies[i].split(",");
      document.getElementById("track").innerText = cells.slice(1, cells.length - 1).join(",");
      document.getElementById("artist").innerText = cells[cells.length - 1];

      const percentage = Math.round((i / sizeCookie) * 100);
      document.getElementsByClassName("progress-bar")[0].style.width = percentage + "%";
      document.getElementsByClassName("progress-label")[0].style.marginLeft = percentage - 1.5 + "%";
      document.getElementsByClassName("progress-label")[0].innerText = percentage + "%";

      document.getElementById("form-spinner").style.display = "none";
      document.getElementById("spotify-container").classList.remove("loading-container-hidden");

      if (i === 0) {
        _setButtonDisabledStatus("back-btn", true);
      }
      return;
    }
  }
}

// This token is gotten from here: https://developer.spotify.com/console/get-search-item/?q=tania%20bowra&type=artist&market=&limit=&offset=&include_external=
// and expires in like 30 minutes, so I'm not worried about putting it online

function submitForm() {
  const podcastChoice = document.getElementsByName("podcast-choice")[0];
  const podcast = podcastChoice.value === "yes" && podcastChoice.checked;
  console.log(podcast ? 0 : 1, currId);

  const cookie = _getCookies()[currIndex];
  document.cookie = `${currIndex}=${podcast ? 0 : 1}${currId}|||${cookie};${_getCookieParameters()}`;
}

function backButton() {
  const lastIndex = currIndex - 1;
  if (lastIndex >= 0) {
    const cookies = _getCookies();
    const lastCookieVal = cookies[lastIndex];
    document.cookie = `${lastIndex}=${lastCookieVal.replace(new RegExp("[^=|]+\\|\\|\\|"), "")};${_getCookieParameters()}`;
    document.getElementById("spotify-form").submit();
  }
}

function _setButtonDisabledStatus(id, disable) {
  let btn = document.getElementById(id);
  const btn_class = id === "submit-btn" ? "btn-primary" : "btn-secondary";

  if (disable) {
    btn.classList.add("btn-disabled");
    btn.classList.remove(btn_class);
  }
  else {
    btn.classList.remove("btn-disabled");
    btn.classList.add(btn_class);
  }
  btn.disabled = disable;
}

function submitPodcast(choice) {
  const podcast = choice.value === "yes";
  document.getElementById("spinner").style.display = "";
  const track_name = document.getElementById("track").innerText;
  const artist_name = document.getElementById("artist").innerText;
  _callSpotify(track_name, artist_name, podcast);
}

function _callSpotify(track_name, artist_name, podcast) {
  const track = (podcast ? "" : "track:") + track_name;
  const artist = (podcast ? "" : "artist:") + artist_name;
  const type = podcast ? "episode" : "track";
  const query = `q=${encodeURI(track + " AND " + artist)}&type=${type}&limit=6`;
  fetch(`https://api.spotify.com/v1/search?${query}`, {
    headers: {"Authorization": `Bearer ${token}`}
  }).then(res => res.json()).then(
    (res) => {
      if (res["error"] !== undefined) {
        document.getElementById("spotify-token-popup").classList.remove("loading-container-hidden");
        document.getElementById("spotify-iframe").src = "https://developer.spotify.com/console/get-search-item/#oauth-input";
      }
      else {
        _populateValues((podcast ? res["episodes"] : res["tracks"])["items"])
      }
    },
    (error) => console.log(error)
  );
}

function _populateValues(tracks) {
  document.getElementById("spinner").style.display = "none";
  document.getElementById("spotify-selection-container").classList.remove("loading-container-hidden");
  const container = document.getElementById("spotify-row");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  ids = tracks.map(track => track["id"]);
  currId = "";
  _setButtonDisabledStatus("submit-btn", true);
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const artists = track["artists"].map(artist => artist["name"]).join(" and ");
    _createSpotifyCell(i, track["name"], artists, track["album"]["name"], track["album"]["type"], track["album"]["images"][0]["url"]);
  }
}

function submitSpotify(val) {
  Array.from(document.getElementsByClassName("spotify-selection-cell-active")).forEach(val => val.classList.remove("spotify-selection-cell-active"));
  document.getElementById(`spotify-selection-cell-${val}`).classList.add("spotify-selection-cell-active");
  document.getElementById(`spotify-selection-cell-${val}`).classList;
  currId = ids[val];
  _setButtonDisabledStatus("submit-btn", false);
}

function _createSpotifyCell(index, track, artist, album, albumType, albumUrl) {
  let cellElem = document.createElement("label", {
    "id": `spotify-selection-cell-${index}`,
    "class": "spotify-selection-cell"
  });
  cellElem.id = `spotify-selection-cell-${index}`;
  cellElem.className = "spotify-selection-cell";

  let inputElem = document.createElement("input");
  inputElem.type = "radio";
  inputElem.name = "spotify-choice";
  inputElem.value = index;
  inputElem.onchange = () => submitSpotify(index);
  cellElem.appendChild(inputElem);

  let imgElem = document.createElement("img");
  imgElem.src = albumUrl;
  cellElem.appendChild(imgElem);

  const trackElem = document.createElement("p");
  trackElem.appendChild(document.createElement("b"));
  trackElem.firstChild.innerText = track;
  cellElem.appendChild(trackElem);

  const artistElem = document.createElement("p");
  artistElem.innerText = artist;
  cellElem.appendChild(artistElem);

  const albumElem = document.createElement("p");
  albumElem.appendChild(document.createElement("i"));
  albumElem.firstChild.innerText = `${album} (${albumType})`;
  cellElem.appendChild(albumElem);

  document.getElementById("spotify-row").appendChild(cellElem);
}

function submitToken() {
  const token = document.getElementById("spotify-token").value;
  if (token?.length > 0) {
    document.cookie = `token=${token};${_getCookieParameters()}`;
    document.getElementById("spotify-form").submit();
  }
}
