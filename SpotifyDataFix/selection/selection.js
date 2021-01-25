let currIndex = -1;
let ids = [];
let currId = "";
let offset = 0;
let token = "";

function _getCookies() {
  return document.cookie.split(";").map(cookie => cookie.trim().split("=", 2))
    .reduce((acc, cookie) => ({...acc, [cookie[0]]: cookie[1]}), {});
}

function _getCookieParameters(numDays=7) { // Save for 1 week default
  const d = new Date();
  d.setTime(d.getTime() + (numDays * 24 * 60 * 60 * 1000));
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

  // All done!
  window.location.replace("/SpotifyDataFix/complete/complete.html");
}

function _getPodcastChoice() {
  const podcastChoice = document.getElementsByName("podcast-choice")[0];
  return podcastChoice.value === "yes" && podcastChoice.checked;
}

function submitForm() {
  const podcast = _getPodcastChoice();

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
  const btn_class = ["submit-btn", "link-btn"].includes(id) ? "btn-primary" : "btn-secondary";

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

function callSpotify() {
  const podcast = _getPodcastChoice();
  document.getElementById("spinner").style.display = "";

  const query = document.getElementById("spotify-query-input").value;
  if (query) {
    _callSpotifyWithQuery(query, podcast);
  }
  else {
    const track_name = document.getElementById("track").innerText;
    const artist_name = document.getElementById("artist").innerText;
    _callSpotify(track_name, artist_name, podcast);
  }
}

function _callSpotify(track_name, artist_name, podcast) {
  const track = (podcast ? "" : "track:") + track_name;
  const artist = (podcast ? "" : "artist:") + artist_name;
  const queryStr = track + " AND " + artist;

  document.getElementById("spotify-link-label").innerText = `OR paste the ${podcast ? "episode" : "song"} link here:`
  document.getElementById("spotify-link-input").placeholder = `Share > Copy ${podcast ? "" : "Song "}Link`
  document.getElementById("spotify-query-input").value = queryStr;

  _callSpotifyWithQuery(queryStr, podcast);
}

function _callSpotifyWithQuery(queryStr, podcast) {
  document.getElementById("no-results-text").style.display = 'none';

  const type = podcast ? "episode" : "track";
  const query = `q=${encodeURI(queryStr)}&type=${type}&offset=${offset}&limit=6`;
  fetch(`https://api.spotify.com/v1/search?${query}`, {
    headers: {"Authorization": `Bearer ${token}`}
  }).then(res => res.json()).then(
    (res) => {
      if (res["error"] !== undefined) {
        document.getElementById("spotify-token-popup-background").classList.remove("loading-container-hidden");
        document.getElementById("spotify-token-popup").style.display = "";
        document.getElementById("spotify-iframe").src = "https://developer.spotify.com/console/get-search-item/#oauth-input";
      }
      else {
        _populateValues(podcast ? res["episodes"] : res["tracks"], podcast);
      }
    },
    (error) => console.log(error)
  );
}

function _populateValues(res, podcast) {
  document.getElementById("spinner").style.display = "none";
  document.getElementById("spotify-selection-container").classList.remove("loading-container-hidden");
  document.getElementById("spotify-selection-container-inner").style.display = "";
  const container = document.getElementById("spotify-row");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const items = res["items"];
  ids = items.map(track => track["id"]);
  currId = "";

  const next = res["next"];
  if (next) {
    const offsetIndex = next.indexOf("offset=") + "offset=".length;
    offset = parseInt(next.substring(offsetIndex, next.indexOf("&", offsetIndex)));
  }
  else {
    offset = 0;
  }

  _setButtonDisabledStatus("submit-btn", true);

  if (items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const cellElem = _unpackItem(i, item, podcast);
      document.getElementById("spotify-row").appendChild(cellElem);
    }
  }
  else {
    document.getElementById("no-results-text").style.display = "";
  }
}

function _unpackItem(index, item, podcast, selectable=true) {
  let imgUrl,
      cellObj;
  if (podcast) {
    imgUrl = item["images"][0]["url"];
    cellObj = {
      name: item["name"],
      duration: item["duration_ms"]
    };
  }
  else {
    imgUrl = item["album"]["images"][0]["url"];
    const artists = item["artists"].map(artist => artist["name"]).join(", ");
    cellObj = {
      track: item["name"],
      artists,
      album: item["album"]["name"],
      albumType: item["album"]["type"]
    };
  }
  return _createSpotifyCell(index, podcast, cellObj, imgUrl, selectable);
}

const spotifyLinkRegex = /https:\/\/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]+)/;

function directLink() {
  const link = document.getElementById("spotify-link-input").value?.trim();
  if (link && spotifyLinkRegex.test(link)) {
    const type = spotifyLinkRegex.exec(link)[1];

    document.getElementById("spotify-link-popup-background").classList.remove("loading-container-hidden");
    document.getElementById("spotify-link-popup").style.display = "";

    const podcast = _getPodcastChoice();
    if ((podcast && type === "episode") || (!podcast && type === "track")) {
      currId = spotifyLinkRegex.exec(link)[2];

      fetch(`https://api.spotify.com/v1/${type}s/${currId}`, {
        headers: {"Authorization": `Bearer ${token}`}
      }).then(res => res.json()).then(
        (res) => {
          if (res["error"] !== undefined) {
            if (res["error"]["message"] === "invalid id") {
              document.getElementById("spotify-link-popup-right").style.display = "none";
              document.getElementById("spotify-link-popup-invalid").style.display = "";
              document.getElementById("spotify-link-popup-invalid").innerText = "Something went wrong with that link. Please make sure you are copying the share link";
              _setButtonDisabledStatus("link-btn", true);
            }
            else {
              document.getElementById("spotify-token-popup-background").classList.remove("loading-container-hidden");
              document.getElementById("spotify-token-popup").style.display = "";
              document.getElementById("spotify-iframe").src = "https://developer.spotify.com/console/get-search-item/#oauth-input";
            }
          }
          else {
            document.getElementById("spotify-link-popup-right").style.display = "";
            document.getElementById("spotify-link-popup-invalid").style.display = "none";
            _setButtonDisabledStatus("link-btn", false);

            const popup = document.getElementById("spotify-link-popup");
            const cellElem = _unpackItem("popup", res, type === "episode", false);
            popup.insertBefore(cellElem, popup.firstChild);
          }
        },
        (error) => console.log(error)
      );
    }
    else {
      document.getElementById("spotify-link-popup-right").style.display = "none";
      document.getElementById("spotify-link-popup-invalid").style.display = "";
      document.getElementById("spotify-link-popup-invalid").innerText = podcast ?
        "Please change to not podcast option and try again." :
        "Please change to podcast option and try again.";
      _setButtonDisabledStatus("link-btn", true);
    }
  }
}

function newSearch() {
  const podcast = _getPodcastChoice();
  const query = document.getElementById("spotify-query-input").value;

  if (query) {
    offset = 0;
    _callSpotifyWithQuery(query, podcast);
  }
}

function submitSpotify(val) {
  Array.from(document.getElementsByClassName("spotify-selection-cell-active")).forEach(val => val.classList.remove("spotify-selection-cell-active"));
  document.getElementById(`spotify-selection-cell-${val}`).classList.add("spotify-selection-cell-active");
  document.getElementById(`spotify-selection-cell-${val}`).classList;
  currId = ids[val];
  _setButtonDisabledStatus("submit-btn", false);
}

function handleNotFound(toDelete) {
  if (!toDelete && ids.length > 0) {
    currId = ids[0];
    submitForm();
    document.getElementById("spotify-form").submit();
    return;
  }

  const cookie = _getCookies()[currIndex];
  document.cookie = `${currIndex}=delete|||${cookie};${_getCookieParameters()}`;
  document.getElementById("spotify-form").submit();
}

function _createSpotifyCell(index, podcast, cellObj, imgUrl, selectable=true) {
  let cellElem = document.createElement("label", {
    "id": `spotify-selection-cell-${index}`,
    "class": "spotify-selection-cell"
  });
  cellElem.id = `spotify-selection-cell-${index}`;
  cellElem.classList.add("spotify-selection-cell");
  if (selectable) {
    cellElem.classList.add("spotify-selection-cell-selectable");
  }

  if (selectable) {
    let inputElem = document.createElement("input");
    inputElem.type = "radio";
    inputElem.name = "spotify-choice";
    inputElem.value = index;
    inputElem.onchange = () => submitSpotify(index);
    cellElem.appendChild(inputElem);
  }

  let imgElem = document.createElement("img");
  imgElem.src = imgUrl;
  cellElem.appendChild(imgElem);

  if (podcast) {
    const {name, duration} = cellObj;

    const nameElem = document.createElement("p");
    nameElem.appendChild(document.createElement("b"));
    nameElem.firstChild.innerText = name;
    cellElem.appendChild(nameElem);

    const durationElem = document.createElement("p");
    const durationSecs = Math.floor(duration / 1000);
    const durationText = `${Math.floor(durationSecs / 60)} minutes ${durationSecs % 60} seconds`;
    durationElem.innerText = durationText;
    cellElem.appendChild(durationElem);
  }
  else {
    const {track, artists, album, albumType} = cellObj;

    const trackElem = document.createElement("p");
    trackElem.appendChild(document.createElement("b"));
    trackElem.firstChild.innerText = track;
    cellElem.appendChild(trackElem);

    const artistElem = document.createElement("p");
    artistElem.innerText = artists;
    cellElem.appendChild(artistElem);

    const albumElem = document.createElement("p");
    albumElem.appendChild(document.createElement("i"));
    albumElem.firstChild.innerText = `${album} (${albumType})`;
    cellElem.appendChild(albumElem);
  }

  return cellElem;
}

function cancelLinkPopup() {
  const selectionCell = document.getElementById("spotify-selection-cell-popup");
  if (selectionCell) {
    selectionCell.parentNode.removeChild(selectionCell);
  }

  document.getElementById("spotify-link-popup-background").classList.add("loading-container-hidden");
  document.getElementById("spotify-link-popup").style.display = "none";
}

function submitLinkPopup() {
  submitForm();
  document.getElementById("spotify-form").submit();
}

function submitToken() {
  const token = document.getElementById("spotify-token").value;
  if (token?.length > 0) {
    document.cookie = `token=${token};${_getCookieParameters(0.5)}`;
    document.getElementById("spotify-form").submit();
  }
}
