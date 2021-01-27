function _getCookieParameters(numDays=7) { // Save for 1 week default
  const d = new Date();
  d.setTime(d.getTime() + (numDays * 24 * 60 * 60 * 1000));
  return "path=/;expires=" + d.toUTCString();
}

function submitToken() {
  const tokenInput = document.getElementById("spotify-token");
  if (tokenInput.value) {
    const token = tokenInput.value;
    fetch("https://api.spotify.com/v1/search?q=verify%20the%20token%20works&type=track", {
      headers: {"Authorization": `Bearer ${token}`}
    }).then(res => res.json()).then(
      (res) => {
        if ("error" in res) {
          document.getElementById("error-text").innerText = "Incorrect token, please try again";
          tokenInput.focus();
        }
        else {
          document.cookie = `token=${token};${_getCookieParameters(0.5)}`;
          window.location.replace("../selection/selection.html");
        }
      },
      (error) => {
        document.getElementById("error-text").innerText = "Incorrect token, please try again";
        tokenInput.focus();
      }
    );
  }
  else {
    document.getElementById("error-text").innerText = "Please enter a token before continuing";
    tokenInput.focus();
  }
}