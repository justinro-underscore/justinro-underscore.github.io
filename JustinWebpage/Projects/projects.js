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
  console.log(event);
  event.stopPropogation();
}
