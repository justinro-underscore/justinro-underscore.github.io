currCat = null

function showCat(cat)
{
  if(currCat != null)
  {
    document.getElementById(currCat).style.display = "none";
    document.getElementById(currCat + "-btn").classList.remove("about-btn-selected");
  }
  newCat = document.getElementById(cat)
  if(currCat == cat)
  {
    newCat.style.display = "none";
    currCat = null;
  }
  else
  {
    newCat.style.display = "inherit";
    document.getElementById(cat + "-btn").classList.add("about-btn-selected");
    interval = setInterval(changeOpacity, 10)
    opacity = 0
    function changeOpacity() {
      opacity += 0.05;
      newCat.style.opacity = opacity;
      if(opacity >= 1)
        clearInterval(interval);
    }
    newCat.scrollIntoView({
      behavior: 'smooth',
      block: "start"
    });
    currCat = cat;
  }
  resetVideos();
}

function showVideo(vid)
{
  video = document.getElementById(vid + "Video");
  if(video.style.display == "none")
  {
    video.style.display = "inherit";
    video.scrollIntoView({
      behavior: 'smooth',
      block: "center"
    });
  }
  else
    video.style.display = "none";
}

function resetVideos()
{
  document.getElementById("electionVideo").style.display = "none"
  document.getElementById("hackathonVideo").style.display = "none"
}

function goToTop()
{
  document.getElementsByClassName("navbar")[0].scrollIntoView({
    behavior: 'smooth',
    block: "start"
  });
}
