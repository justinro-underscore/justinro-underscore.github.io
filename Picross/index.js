function onLoad() {
  const levelsContainer = document.getElementById('levels');
  for (let i = 0; i < levels.length; i++) {
    const link = document.createElement(ELEM_ANCHOR);
    link.setAttribute('href', `./level/level.html#${i}`);
    link.innerText = `Level ${i}`;
    levelsContainer.appendChild(link);
    levelsContainer.appendChild(document.createElement(ELEM_BREAK));
  }
}