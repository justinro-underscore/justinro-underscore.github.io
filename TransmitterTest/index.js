let statusText;
let progressBar;
let progressBarProgress;
let progressBarPercent;
let progressBarStatusText;

let progressIdx = 0;
const progressStates = [
  [0, 0.3],
  [10, 1.5],
  [35, 1.2],
  [75, 1],
  [75, 0.3],
  [80, 0.2],
  [95, 0.8],
  [95, 0.5],
  [99, 0.5],
  [100, 1]
]

let percentUpdateInterval;

function onLoad() {
  statusText = document.getElementById('status-text');
  progressBar = document.getElementById('progress-bar');
  progressBarProgress = document.getElementById('progress-bar-progress');
  progressBarPercent = document.getElementById('progress-bar-percent');
  progressBarStatusText = document.getElementById('progress-bar-status-text');

  updateProgress();
  percentUpdateInterval = setInterval(updatePercent, 10);
}

function updateProgress() {
  if (progressIdx >= progressStates.length) {
    complete();
    return;
  }

  const [width, transitionTime] = progressStates[progressIdx++];
  progressBarProgress.style.width = `${width}%`;
  progressBarProgress.style.transition = `${transitionTime}s`;
  setTimeout(updateProgress, transitionTime * 1000);
}

function updatePercent() {
  let percent = progressBarProgress.offsetWidth / progressBar.offsetWidth;
  if (percent >= 1) {
    clearInterval(percentUpdateInterval);
  }
  percent = Math.floor(percent * 100);
  progressBarPercent.innerText = `${percent}%`;
}

function complete() {
  statusText.style.opacity = 0;
  progressBarStatusText.innerText = 'Beacon Online!';
  progressBarPercent.style.animation = 'initial';
  progressBarPercent.style.color = '#fff';
  progressBarStatusText.style.animation = 'initial';
  progressBarStatusText.style.color = '#fff';
}
