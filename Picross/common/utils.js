/**
 * Gets the browser's cookies
 * @returns An object containing the key-value pairs from the browser's cookies
 */
function getCookies() {
  return document.cookie.split(";").map(cookie => cookie.trim().split("=", 2))
    .reduce((acc, cookie) => ({...acc, [cookie[0]]: cookie[1]}), {});
}