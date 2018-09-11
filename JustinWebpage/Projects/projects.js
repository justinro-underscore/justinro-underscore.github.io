function scrollToCode()
{
  window.scrollTo({
    top: document.getElementById("Code").getBoundingClientRect().top,
    behavior: "smooth"
  });
}
