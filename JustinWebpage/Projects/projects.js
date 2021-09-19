function onLoad() {
  if (window.location.hash !== '') {
    const id = window.location.hash.slice(1);
    openPopup(id);
  }
}

function openPopup(popupId) {
  if (document.getElementById(`popup-${popupId}`) !== null) {
    document.getElementById("popup-background").classList.remove("popup-background-hidden");
    document.getElementById(`popup-${popupId}`).style.display = '';
  }
}

function closePopups() {
  let popups = document.getElementsByClassName("popup");
  for (let i = 0; i < popups.length; i++) {
    popups.item(i).style.display = 'none';
  }
  document.getElementById("popup-background").classList.add("popup-background-hidden");
}

function dontClose(event) {
  event.stopPropogation();
}

function changeRFIDPongSrc(index) {
  let iframe = document.getElementById("rfid-pong-iframe");
  let choices = document.getElementsByClassName("selected");
  for (let i = 0; i < choices.length; i++) {
    choices.item(i).classList.remove("selected");
  }
  if (index === 1) {
    iframe.src = "https://www.youtube.com/embed/wBuuTTQBRac";
  }
  else if (index === 2) {
    iframe.src = "https://www.youtube.com/embed/D3jktK0YoFk";
  }
  else if (index === 3) {
    iframe.src = "https://www.youtube.com/embed/tRGuztNfOcA";
  }
  document.getElementById("rfid-pong-" + index).classList.add("selected");
}
