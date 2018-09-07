document.addEventListener('keydown', function(event)
{
  if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey))
  {
    if (document.getElementById("vid").innerHTML != "") {
      document.getElementById("vid").innerHTML = "";
    }
    else {
      document.getElementById("vid").innerHTML = `
        <iframe id="player" src="https://www.youtube.com/embed/0xzN6FM5x_E?ecver=2&autoplay=1&loop=1&list=PL_lhB8YcTE-T2SyHfz5DkdBMK3fVUntW1" style="position:fixed;width:100%;height:100%;left:0" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
        <div style="position:fixed;width:100%;height:100%"></div>
      `;
      event.preventDefault();
    }
  }
});
