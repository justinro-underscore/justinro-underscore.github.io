currCat = null

function showCat(cat)
{
  if(currCat != null)
    currCat.style.display = "none";
  newCat = document.getElementById(cat)
  if(currCat == newCat)
  {
    newCat.style.display = "none";
    currCat = null;
  }
  else
  {
    newCat.style.display = "inherit";
    interval = setInterval(changeOpacity, 10)
    opacity = 0
    function changeOpacity() {
      opacity += 0.05;
      newCat.style.opacity = opacity;
      if(opacity >= 1)
        clearInterval(interval);
    }
    window.scrollTo({
      top: newCat.getBoundingClientRect().top,
      behavior: "smooth"
    });
    currCat = newCat;
  }
}
