const g_sceneEl = document.getElementById("scene");
const g_numOrbsEl = document.getElementById("numOrbs");
const g_numConnDistThreshEl = document.getElementById("numConnDistThresh");
const g_btnRunStopEl = document.getElementById("btnRunStop");

const g_scene = new Scene(g_sceneEl, {
  numOrbs: 200,
  connectionThreshold: 120
});

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
  g_scene.updateSettings({
    renderOrbs: this.checked
  });

  if (!g_scene.isRunning)
    g_scene.processFrame();
});

g_numOrbsEl.addEventListener("change", function() {
  g_scene.updateSettings({
    numOrbs: parseInt(this.value)
  });

  if (!g_scene.isRunning)
    g_scene.processFrame();

  updateFPS();
});

g_numConnDistThreshEl.addEventListener("change", function() {
  g_scene.updateSettings({
    connectionThreshold: parseInt(this.value)
  });

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

g_numOrbsEl.value = g_scene.settings.numOrbs;
g_numConnDistThreshEl.value = g_scene.settings.connectionThreshold;

g_scene.run();

updateFPS();
setInterval(updateFPS, 5000);