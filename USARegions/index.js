selectedRegion = ""
stateRegions = new Map()

function loadStates() {
  // regions = JSON.parse(regions)
  regions.regions.forEach(r => {
    regionClassStr = "region-" + r.name;
    r.states.forEach(s => {
      if (stateRegions.has(s)) {
        console.log("Error! " + s + " is referenced in more than one region!")
      }
      else {
        stateRegions.set(s, r.name)
      }
      stateElem = document.getElementsByClassName(s);
      if (stateElem.length == 0) {
        console.log("Error! Misspelled state name in region {" + r.name + "}: " + s);
      }
      else {
        for (i = 0; i < stateElem.length; i++) {
          stateElem[i].classList.add(regionClassStr);
          stateElem[i].classList.add("state");
          stateElem[i].addEventListener("mouseenter", () => enterState(s));
          stateElem[i].addEventListener("mouseleave", () => leaveState(s));
          stateElem[i].addEventListener("click", () => selectRegion(s));
        }
      }
    })
  })
  if (stateRegions.size < 50) {
    console.log("Error! Number of states specified is less than 50")
  }
  document.getElementById("state-map").style = "display: inline;";
}

function enterState(stateStr) {
  elems = document.getElementsByClassName(stateStr)
  removeRegionHighlight = elems[0].classList.contains("region-" + selectedRegion)
  for (i = 0; i < elems.length; i++) {
    if (removeRegionHighlight) {
      elems[i].classList.remove("region-highlight");
    }
    elems[i].classList.add("state-highlight");
  }
}

function leaveState(stateStr) {
  elems = document.getElementsByClassName(stateStr)
  addRegionHighlight = elems[0].classList.contains("region-" + selectedRegion)
  for (i = 0; i < elems.length; i++) {
    elems[i].classList.remove("state-highlight");
    if (addRegionHighlight) {
      elems[i].classList.add("region-highlight");
    }
  }
}

function update(key) {
  console.log("test")
  console.log(key)
}

function selectRegion(stateStr) {
  fromInput = stateStr === ""
  if (fromInput) {
    stateInput = document.getElementById("stateInput")
    stateStr = stateInput.value.toLowerCase().replace(" ", "_")
    stateInput.value = ""
    if (!stateRegions.has(stateStr)) {
      return;
    }
  }
  regionStr = stateRegions.get(stateStr)

  elems = document.getElementsByClassName("region-" + selectedRegion)
  for (i = 0; i < elems.length; i++) {
    elems[i].classList.remove("region-highlight");
  }
  selectedRegion = regionStr;
  elems = document.getElementsByClassName("region-" + regionStr)
  for (i = 0; i < elems.length; i++) {
    if (fromInput || !elems[i].classList.contains(stateStr)) {
      elems[i].classList.add("region-highlight");
    }
  }
  document.getElementById("selected-region").innerHTML = "Selected region: " + regionStr;
}