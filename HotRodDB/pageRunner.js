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
    return getRealName(this._name);
  }

  set name(name)
  {
    this._name = name;
  }
}

function getRealName(name)
{
  return name.replace(/[A-Z0-9]/g, function (x) {
      return " " + x;
  }).substr(1);
}

let dataBase = [];
let gifGrid;
let currPage = 1;
let maxPages;
let activatedGif;

// Eventually I'm gunna have to move all of the gifs off of this repo
function populateDatabase()
{
  let gifNames = [
    "AllGreatMen",
    "AncestorsProtectMe",
    "AwesomeAsShit",
    "Baaabe",
    "BabeWaitBabeNo",
    "Bagpipes",
    "BallsMan",
    "BecauseILoveYou",
    "BelieveInThis",
    "BigAssStunt",
    "Blah",
    "BlowItNow",
    "BombsAway",
    "BonerPolice",
    "BringTheDemons",
    "BroNoWay",
    "Bubblewrap",
    "ChemicalFire",
    "Clap",
    "CoolBeans",
    "CreepyFisherman",
    "Crying",
    "Dance1",
    "Dance2",
    "Dance3",
    "Danger",
    "DaveNod",
    "DaveSuitcase",
    "DiedInstantly",
    "Don'tJustStareAtMe",
    "Don'tLetYourDadsEatPie",
    "Don'tTellMeHowToLiveMyLife",
    "DoYouLikeStunts",
    "DropSomeDumpage",
    "ExcitingNews",
    "Fireworks",
    "GetOut",
    "GodsOfWar",
    "Gotcha",
    "GotThisAcid",
    "GreatIdea",
    "GrilledCheeseVsTaco1",
    "GrilledCheeseVsTaco2",
    "GrilledCheeseVsTaco3",
    "GroceryShopping",
    "HangOut",
    "Hello",
    "HellsYeah",
    "He'sGoingInCircles",
    "HeyBuddy",
    "HiFive",
    "Hold",
    "HoldMyBeer",
    "Hoobastank",
    "HormoneDisorder",
    "Hospital",
    "HowCrazyThisIs",
    "ICanHandleIt",
    "IDidNotLikeThat",
    "I'dRatherDie",
    "IHateFrank",
    "IKnowICheckedOnline",
    "I'llDoIt",
    "Intro",
    "IParty",
    "IsThatSullivan",
    "It'sEbenezerScrooge",
    "It'sNotUpForDiscussion",
    "I'veGotATattoo",
    "Jealousy",
    "JumpFall",
    "JumpForJoy",
    "Jumps",
    "JustASample",
    "Let'sJumpThisJump",
    "Let'sParty",
    "Let'sWork",
    "LifeIsPain",
    "LikeToParty",
    "LongFall",
    "MailTruckCrash",
    "MakingHimUpset",
    "MarriedToSatan",
    "MaturedALot",
    "MayTheyProtectYou",
    "MayYourHammerBeMighty",
    "MissYouDaddy",
    "MoreThanLikelyDead",
    "Moustache1",
    "Moustache2",
    "MoustacheReveal",
    "MyHat",
    "NailedIt",
    "No",
    "Nope",
    "NoTimeToDoAnything",
    "NoToolInThePool",
    "NowYou'reTalkin",
    "NumberOne",
    "OhHey",
    "OhKathy",
    "OhShit1",
    "OhShit2",
    "OneBigJump",
    "Oooo",
    "Pffft",
    "Pools",
    "PoolSplash",
    "PrepareToBeDazzled",
    "PrettyRacist",
    "Pumped",
    "Push1",
    "Push2",
    "QuietPlace",
    "ReallyInsensitiveBob",
    "ReallyMean",
    "RealMature",
    "Rhosdesian",
    "RichardsonCheer",
    "RichardsonDance1",
    "RichardsonDance2",
    "RichardsonDance3",
    "RichardsonDance4",
    "RichardsonDance5",
    "RichardsonDance6",
    "RichardsonDance7",
    "RichardsonDance8",
    "RichardsonGasps",
    "RichardsonNodding",
    "RichardsonSad",
    "RicoPush",
    "Riot",
    "RodKnowsMyName",
    "RodStandsUp",
    "Run1",
    "Run2",
    "SafeWord",
    "SayIt",
    "Screaming",
    "Sensei",
    "Seriously",
    "ShattersMyEntireUniverse",
    "ShutUp",
    "Sigh",
    "SmallBus",
    "Smirk",
    "SoHey",
    "SoulOfBottleNoseDolphin",
    "SoulOfEagle",
    "SoulOfFox",
    "SoulsOfTheAnimalKingdom",
    "SoundsGood",
    "SoundsLikeFun",
    "SquadUp",
    "StaySweet",
    "StuntIt",
    "SuccessFreezeFrame",
    "SuckedAtBeingAMan",
    "SullivanYouChode",
    "SuperBadass",
    "SuperDead",
    "Sweet",
    "TakeItEasy",
    "Teabag",
    "TearsOutOfMyFace",
    "ThankYou",
    "ThatIsHowItsDone",
    "ThatWasBeautiful",
    "TheBathroomHere",
    "There'sTheFlavor",
    "TheTacoWon",
    "They'veDoneIt",
    "ThisDoesNotLookGood",
    "ThrowingStar",
    "ThumbsUp1",
    "ThumbsUp2",
    "ThumbsUp",
    "TimeToGetUp",
    "TotallySerendipitous",
    "TrailerCrash",
    "Trash",
    "UhOh",
    "UltimatePunch1",
    "UltimatePunch2",
    "UsedToBeLegit",
    "Weird",
    "We'reGeniuses",
    "WhatAreYouDoing",
    "WhatDoYouThinkYou'reDoing",
    "WhatDoYouWant",
    "What",
    "WhatIsDestinyWhatIsFate",
    "WhatTheHell",
    "WhenYou'reGoinOnADate",
    "WhereDoYouGetOff",
    "WhichIsKindaWeird",
    "WhyIsRodKissinHisSister",
    "Wink",
    "WouldYouLookAtThat",
    "Wow",
    "YeahIKnow",
    "YeahYeahNo",
    "Yes",
    "YooHoo",
    "YouLikeWhatYouSee",
    "YouLookPretty",
    "YouLookShitty",
    "You'reAMan",
    "You'reAPussy",
    "You'reTheDevil"
  ]

  gifNames.forEach((name) => {
    dataBase.push(new Gif(name));
  });
}

function onLoad(loadImagesBool)
{
  gifGrid = document.getElementById("gifGrid");
  populateDatabase();

  if(loadImagesBool) {
    dataBase.forEach((entry) => {
      gifGrid.innerHTML +=
      `
      <div class="gifEntry" id="` + entry.imgName + `" style="display:none;" onclick="changeToGif('` + entry.imgName.replace("'", "\\'") + `')">
        <img id="` + entry.imgName + `Img" src="Gifs/` + entry.imgName + `.png" alt="` + entry.name + `" style="width:100%;">
        <h2 id="` + entry.imgName + `Header" style="color:red;">` + entry.name + `</h2>
      </div>`;
    });
  }

  loadImages("");
}

function loadImages(searchValue)
{
  let found = false;
  let index = -1;
  dataBase.forEach((x) => {
    let entry = document.getElementById(x.imgName);
    if(x.name.toLowerCase().includes(searchValue)) {
	    found = true;
      index++;
      if(index >= ((currPage - 1) * 16) && index < (currPage * 16)) {
        entry.style.display = "block";
      }
      else {
        entry.style.display = "none";
      }
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

  maxPages = Math.floor(index / 16) + 1;
  if(currPage > maxPages) {
    currPage = maxPages;
    let pageNumber = document.getElementsByName("pageNumber");
    pageNumber.forEach((x) => {
      x.innerHTML = ("<a " + (currPage === 1 ? "" : "href='javascript:void(0);' ") +
                    "onclick='changePage(false)'><<</a>  " + currPage + "  <a " +
                    (currPage === maxPages ? "" : "href='javascript:void(0);' ")
                    + "onclick='changePage(true)'>>></a>");
    });
    loadImages(searchValue);
  }
}

function refreshSearch()
{
  let input = document.getElementById("searchInput").value.toLowerCase();
  if(activatedGif != undefined) {
    if(!getRealName(activatedGif).toLowerCase().includes(input)) {
      document.getElementById(activatedGif + "Header").style.color = "red";
      document.getElementById(activatedGif + "Img").src = "Gifs/" + activatedGif + ".png";
      activatedGif = undefined;
    }
  }
  loadImages(input);
}

function changePage(isRight)
{
  if(isRight && currPage < maxPages) {
    currPage++;
  }
  else if(!isRight && currPage > 1) {
    currPage--;
  }
  let pageNumber = document.getElementsByName("pageNumber");
  pageNumber.forEach((x) => {
    x.innerHTML = ("<a " + (currPage === 1 ? "" : "href='javascript:void(0);' ") +
                  "onclick='changePage(false)'><<</a>  " + currPage + "  <a " +
                  (currPage === maxPages ? "" : "href='javascript:void(0);' ")
                  + "onclick='changePage(true)'>>></a>");
  });
  refreshSearch();
}

function changeToGif(imgName)
{
  document.getElementById(imgName + "Header").style.color = "green";
  document.getElementById(imgName + "Img").src = "Gifs/" + imgName + ".gif";
  if(activatedGif != undefined) {
    document.getElementById(activatedGif + "Header").style.color = "red";
    document.getElementById(activatedGif + "Img").src = "Gifs/" + activatedGif + ".png";
  }

  if(activatedGif == imgName) {
    activatedGif = undefined;
  }
  else {
    activatedGif = imgName;
  }
}
