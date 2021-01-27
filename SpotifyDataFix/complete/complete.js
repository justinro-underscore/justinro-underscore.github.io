function _getCookies() {
  return document.cookie.split(";").map(cookie => cookie.trim().split("=", 2))
    .reduce((acc, cookie) => ({...acc, [cookie[0]]: cookie[1]}), {});
}

function _throwError() {
  document.getElementById("complete").style.display = "none";
  document.getElementById("incomplete").style.display = "";
}

function onLoad() {
  const cookies = _getCookies();
  if (!Object.keys(cookies || {}).includes("size")) {
    _throwError();
  }
  const sizeCookie = cookies["size"];

  let incomplete = false;
  for (let i = 0; i < sizeCookie; i++) {
    if (!cookies[i].includes("|||")) {
      incomplete = true;
    }
  }
  
  if (incomplete) {
    _throwError();
  }
}

function _setupData() {
  const headers = ",index,track_name,artist_name,type,id,delete";

  const cookies = _getCookies();
  const sizeCookie = cookies["size"];

  let data = headers + "\r\n";
  for (let i = 0; i < sizeCookie; i++) {
    const res = cookies[i].split("|||");
    if (res[0] === "delete") {
      data += `${i},${res[1]},,,${true}\r\n`;
    }
    else {
      const podcast = res[0][0] === "0";
      const id = res[0].slice(1);
      data += `${i},${res[1]},${podcast ? "episode" : "track"},${id},${false}\r\n`;
    }
  }
  return data;
}

function downloadData() {
  const data = _setupData();
  const fileName = "FixedDataForJustin.csv";

  const file = new Blob([data], {type: "text/plain;charset=utf-8"});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, fileName);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }

  document.getElementById("what-now").style.display = "";
}