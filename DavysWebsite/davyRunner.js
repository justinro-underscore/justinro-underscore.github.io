r = 0
g = 0
b = 0
bg = null

increasing = true
on = false

function init()
{
  main = document.getElementById("mainText").style
  audio = new Audio("sandstorm.m4a")
  audio.currentTime = 29
  audio.play()
  setInterval(function(){change()}, 10)
}

function change()
{
  color = "#" + toHex(r) + toHex(g) + toHex(b)
  main.color = color
  if(on) {
    main.background = "black"
    on = false
  }
  else {
    main.background = "white"
    on = true
  }

  changeColors()
}

function changeColors()
{
  if(increasing)
  {
    if(r < 255) {
      r += 5;
    }
    else if(g < 255) {
      g += 5;
    }
    else if(b < 255) {
      b += 5;
    }
    else {
      increasing = false
    }
  }
  else {
    if(r > 0) {
      r -= 5;
    }
    else if(g > 0) {
      g -= 5;
    }
    else if(b > 0) {
      b -= 5;
    }
    else {
      increasing = true
    }
  }
}

function toHex(num)
{
  if(num > 255 || num < 0)
    return "00"
  result = ""
  numberSplit = [0, 0]
  numberSplit[0] = Math.floor(num / 16)
  numberSplit[1] = num % 16
  for(i = 0; i < 2; i++)
  {
    n = numberSplit[i]
    if(n < 10)
      result += "" + n
    else if(n == 10)
      result += "a"
    else if(n == 11)
      result += "b"
    else if(n == 12)
      result += "c"
    else if(n == 13)
      result += "d"
    else if(n == 14)
      result += "e"
    else if(n == 15)
      result += "f"
  }
  return result
}

function customToggle()
{
  display = document.getElementById("customText")
  if(display.style.display == "none")
    display.style.display = "block"
  else
    display.style.display = "none"
}

function setText()
{
  let input = document.getElementById("textInput").value;
  document.getElementById("text").innerHTML = input
  document.getElementById("customText").style.display = "none"
}
