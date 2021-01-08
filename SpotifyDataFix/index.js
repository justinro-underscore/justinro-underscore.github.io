const missingDataHeader = ",index,track_name,artist_name,type,id,error";

function onLoad() {
  if (_checkForData()) {
    _success();
  }
}

function uploadFile() {
  const file = document.getElementById("file-input").files[0];
  file.text().then(text => {
    const rows = text.trim().split("\n");
    if (rows[0] === ",index,track_name,artist_name,type,id,error") {
      if (rows.length === 1) {
        _throwError("Silly goose, you don't have any missing data!");
      }
      else if (rows.length > 100) {
        _throwError("Woah, you have a lot of missing data. Talk to Justin about improving his algorithm.");
      }
      else {
        if (!_checkForData()) {
          _loadData(rows.slice(1));
        }

        _success();
      }
    }
    else {
      _throwError("Hm, that file doesn't look quite right. Please try again.");
    }
  },
  error => _throwError("Hm, that file doesn't look quite right. Please try again."))
}

function _throwError(error) {
  submitBtn.classList.add("btn-disabled");
  submitBtn.href = "javascript:void(0)";

  responseText.classList.remove("success-text");
  responseText.classList.add("error-text");
  responseText.innerText = error;
}

function _loadData(rows) {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // Save for 1 week
  const cookieParameters = "path=/;expires=" + d.toUTCString();
  document.cookie = "size=" + rows.length + ";" + cookieParameters;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].split(",");
    const importantCells = cells.slice(1, cells.length - 3);
    document.cookie = i + "=" + importantCells.join(",") + ";" + cookieParameters;
  }
}

function _success() {
  let submitBtn = document.getElementById("submit-btn");
  let responseText = document.getElementById("response-text");
  let fileInput = document.getElementById("file-input");

  fileInput.disabled = true;

  responseText.classList.add("success-text");
  responseText.classList.remove("error-text");
  responseText.innerText = "Ready to continue!";

  submitBtn.classList.remove("btn-disabled");
  submitBtn.href = "intro/intro.html";
  submitBtn.focus()
}

function _checkForData() {
  const cookies = document.cookie.split(";");
  const sizeCookie = cookies.filter(c => /size=\d+;.*/.test(c));
  if (sizeCookie.length == 0) {
    return false;
  }

  const size = parseInt(sizeCookie[0].split("=")[1]);
  if (cookies.length !== size + 1) {
    return false;
  }

  return true;
}
