'use strict'

class Gif
{
  constructor(name)
  {
    this.name =  name
    this.imgName = name;
    this.html = ""
  }

  get name()
  {
    return this._name.replace(/[A-Z0-9]/g, function (x) {
        return " " + x;
    }).substr(1);
  }

  set name(name)
  {
    this._name = name;
  }
}

console.log("test".includes("t"));

let dataBase = [];
let gifGrid;

function populateDatabase()
{
  let gifNames = [
    "AllGreatMen",
	"AncestorsProtectMe",
	"BringTheDemons",
	"Bubblewrap",
	"Dance",
	"Dance2",
	"Dance3",
	"Don'tJustStareAtMe"
  ]

  gifNames.forEach((name) => {
    dataBase.push(new Gif(name));
  });

  console.log(dataBase[0]);
}

function onLoad()
{
  gifGrid = document.getElementById("gifGrid");
  populateDatabase();

  dataBase.forEach((entry) => {
    gifGrid.innerHTML +=
    `
    <div class="gifEntry" id="` + entry.imgName + `" style="display:block;">
      <img src="Gifs/` + entry.imgName + `.gif" alt="` + entry.name + `" style="width:100%;">
      <h2>` + entry.name + `</h2>
    </div>`;
  });
}

function search()
{
  let input = document.getElementById("searchInput").value.toLowerCase();
  let found = false;
  dataBase.forEach((x) => {
    let entry = document.getElementById(x.imgName);
    if(x.name.toLowerCase().includes(input)) {
	  found = true;
      entry.style.display = "";
    }
    else {
      entry.style.display = "none";
    }
  });
  let noneFound = document.getElementById("NoGifFound");
  if(!found) {
	noneFound.style.display = "block";
  }
  else {
	noneFound.style.display = "none";
  }
}
