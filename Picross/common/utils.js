/**
 * Gets the browser's cookies
 * @returns An object containing the key-value pairs from the browser's cookies
 */
function getCookies() {
  return document.cookie.split(";").map(cookie => cookie.trim().split("=", 2))
    .reduce((acc, cookie) => ({...acc, [cookie[0]]: cookie[1]}), {});
}

/**
 * Formats the given time
 * @param {number} timeSec The time in seconds to be formatted
 * @returns A string of the formatted time mm:ss
 */
function formatTime(timeSec) {
  const minutes = String(Math.floor(timeSec / 60)).padStart(2, 0);
  const seconds = String(Math.floor(timeSec % 60)).padStart(2, 0);
  return `${minutes}:${seconds}`;
}
