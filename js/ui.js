const DEFAULT_NUM_ORBS = 200;
const DEFAULT_ORB_CONN_DIST_THRESH = 120;

const g_sceneEl = document.getElementById("scene");
const g_numOrbsEl = document.getElementById("numOrbs");
const g_numConnDistThreshEl = document.getElementById("numConnDistThresh");
const g_btnRunStopEl = document.getElementById("btnRunStop");

const g_scene = new Scene(g_sceneEl);

function resizeSceneCanvas() {
  g_sceneEl.setAttribute("width", g_sceneEl.clientWidth);
  g_sceneEl.setAttribute("height", g_sceneEl.clientHeight);
}

resizeSceneCanvas();
window.addEventListener("resize", resizeSceneCanvas);

function updateFPS() {
  g_scene.measureFPS(function(fps) {
    document.getElementById("fps").innerText = Math.round(fps).toString();
  });
}

function togglePause() {
  if (g_scene.isRunning) {
    g_scene.stop();
    g_btnRunStopEl.innerText = "Resume";
  } else {
    g_scene.run();
    g_btnRunStopEl.innerText = "Pause";
    updateFPS();
  }
}

g_btnRunStopEl.addEventListener("click", function() {
  togglePause();
  this.blur();
});

document.getElementById("displayOrbs").addEventListener("change", function() {
  g_scene.areOrbsRendered = this.checked;

  if (!g_scene.isRunning)
    g_scene.processFrame();
});

g_numOrbsEl.addEventListener("change", function() {
  g_scene.numOrbs = parseInt(this.value);

  if (!g_scene.isRunning)
    g_scene.processFrame();

  updateFPS();
});

g_numConnDistThreshEl.addEventListener("change", function() {
  g_scene.orbConnectionThreshold = parseInt(this.value);

  if (!g_scene.isRunning)
    g_scene.processFrame();

  updateFPS();
});

document.addEventListener("keypress", function(event) {
  if (event.key === " ") {
    togglePause();
  }
});

function handleControlKeys(event) {
  if (event.key === "Enter" || event.key === "Escape") {
    event.target.blur();
  }
}

for (const inputElement of document.querySelectorAll('input[type="number"], input[type="text"]')) {
  inputElement.addEventListener("keydown", handleControlKeys);
}

document.getElementById("btnSettings").addEventListener("click", function() {
  const settingsEl = document.getElementById("settings");
  settingsEl.style.display = (!settingsEl.style.display || settingsEl.style.display === "none" ? "block" : "none");

  this.blur();
});

g_scene.numOrbs = g_numOrbsEl.value = DEFAULT_NUM_ORBS;
g_scene.orbConnectionThreshold = g_numConnDistThreshEl.value = DEFAULT_ORB_CONN_DIST_THRESH;
g_scene.run();

updateFPS();
setInterval(updateFPS, 5000);