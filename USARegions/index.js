selectedRegion = ""

function loadStates() {
  // regions = JSON.parse(regions)
  regions.regions.forEach(r => {
    regionClassStr = "region-" + r.name;
    r.states.forEach(s => {
      stateElem = document.getElementsByClassName(s);
      if (stateElem.length == 0) {
        console.log("Error! Misspelled state name in region {" + r.name + "}: " + s);
      }
      else {
        for (i = 0; i < stateElem.length; i++) {
          stateElem[i].classList.add(regionClassStr);
          stateElem[i].addEventListener("mouseenter", () => enterState(s));
          stateElem[i].addEventListener("mouseleave", () => leaveState(s));
          stateElem[i].addEventListener("click", () => selectRegion(r.name));
        }
      }
    })
  })
  document.getElementById("state-map").style = "display: inline;";
}

function enterState(stateStr) {
  elems = document.getElementsByClassName(stateStr)
  for (i = 0; i < elems.length; i++) {
    elems[i].classList.add("state-highlight");
  }
}

function leaveState(stateStr) {
  elems = document.getElementsByClassName(stateStr)
  for (i = 0; i < elems.length; i++) {
    elems[i].classList.remove("state-highlight");
  }
}

function selectRegion(regionStr) {
  selectedRegion = regionStr;
  document.getElementById("selected-region").innerHTML = "Selected region: " + regionStr;
}