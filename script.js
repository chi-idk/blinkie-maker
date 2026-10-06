const canvas = document.getElementById("blinkieCanvas");
const ctx = canvas.getContext("2d");

// --------------------------------------------------
// BLINKIE DATA
// --------------------------------------------------

const blinkie = {
  layers: [
    {
      id: "background",
      type: "background",
      name: "Background",
      color: "#73c9f5",
      visible: true
    },
    {
      id: "text-1",
      type: "text",
      name: "Text",
      content: "HELLO!",
      color: "#ffffff",
      size: 14,
      x: 150,
      y: 30,
      visible: true
    },
    {
      id: "border",
      type: "border",
      name: "Border",
      image: null,
      visible: true
    }
  ]
};

let selectedLayer = "text-1";
let borderUpload = document.getElementById("borderUpload");

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function getLayer(id) {
  return blinkie.layers.find(function(layer) {
    return layer.id === id;
  });
}

function getSelectedLayer() {
  return getLayer(selectedLayer);
}

function createId() {
  return "layer-" + Date.now() + "-" +
    Math.floor(Math.random() * 10000);
}

// --------------------------------------------------
// DRAW
// --------------------------------------------------

function drawBlinkie(time) {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  blinkie.layers.forEach(function(layer) {

    if (!layer.visible) {
      return;
    }

    // BACKGROUND
    if (layer.type === "background") {

      ctx.fillStyle = layer.color;

      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    // TEXT
    if (layer.type === "text") {

      ctx.save();

      let alpha = 1;
      let scale = 1;
      let fillColor = layer.color;

      const animationSelect =
        document.getElementById("animationSelect");

      const speedInput =
        document.getElementById("speedInput");

      const animation =
        animationSelect ? animationSelect.value : "none";

      const speed =
        speedInput ? Number(speedInput.value) : 5;

      // Blink
      if (animation === "blink") {

        const interval = 600 - speed * 45;

        alpha =
          Math.floor(time / interval) % 2 === 0
            ? 1
            : 0.1;
      }

      // Pulse
      if (animation === "pulse") {

        const pulse =
          Math.sin(time / (500 - speed * 30));

        scale = 1 + pulse * 0.08;
      }

      // Rainbow
      if (animation === "rainbow") {

        const hue =
          (time / (40 - speed * 2)) % 360;

        fillColor =
          "hsl(" + hue + ", 100%, 70%)";
      }

      ctx.globalAlpha = alpha;

      ctx.translate(
        layer.x,
        layer.y
      );

      ctx.scale(
        scale,
        scale
      );

      ctx.font =
        "800 " + layer.size + "px Arial, sans-serif";

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Shadow
      ctx.fillStyle =
        "rgba(0, 70, 110, 0.35)";

      ctx.fillText(
        layer.content,
        2,
        2
      );

      // Main text
      ctx.fillStyle = fillColor;

      ctx.fillText(
        layer.content,
        0,
        0
      );

      ctx.restore();
    }

    // BORDER
    if (
      layer.type === "border" &&
      layer.image
    ) {

      ctx.drawImage(
        layer.image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  });

  requestAnimationFrame(drawBlinkie);
}

// --------------------------------------------------
// LAYER PANEL
// --------------------------------------------------

const layersList =
  document.getElementById("layersList");

function getLayerIcon(layer) {

  if (layer.type === "background") {
    return "▰";
  }

  if (layer.type === "text") {
    return "T";
  }

  if (layer.type === "border") {
    return "▧";
  }

  return "✦";
}

function renderLayers() {

  if (!layersList) {
    return;
  }

  layersList.innerHTML = "";

  blinkie.layers.slice().reverse().forEach(function(layer) {

    const item =
      document.createElement("div");

    item.className = "layer-item";

    if (layer.id === selectedLayer) {
      item.classList.add("selected");
    }

    const visibility =
      document.createElement("button");

    visibility.className =
      "layer-visibility";

    visibility.textContent =
      layer.visible ? "●" : "○";

    visibility.title =
      layer.visible
        ? "Hide layer"
        : "Show layer";

    visibility.addEventListener(
      "click",
      function(event) {

        event.stopPropagation();

        layer.visible =
          !layer.visible;

        renderLayers();
      }
    );

    const icon =
      document.createElement("span");

    icon.className =
      "layer-icon";

    icon.textContent =
      getLayerIcon(layer);

    const name =
      document.createElement("span");

    name.className =
      "layer-name";

    name.textContent =
      layer.name;

    item.appendChild(visibility);
    item.appendChild(icon);
    item.appendChild(name);

    item.addEventListener(
      "click",
      function() {

        selectedLayer = layer.id;

        loadLayerControls();

        renderLayers();
      }
    );

    layersList.appendChild(item);
  });
}

// --------------------------------------------------
// LOAD CONTROLS
// --------------------------------------------------

function loadLayerControls() {

  const layer = getSelectedLayer();

  if (!layer || layer.type !== "text") {
    return;
  }

  document.getElementById("textInput").value =
    layer.content;

  document.getElementById("textColor").value =
    layer.color;

  document.getElementById("fontSize").value =
    layer.size;

  document.getElementById("textX").value =
    layer.x;

  document.getElementById("textY").value =
    layer.y;
}

// --------------------------------------------------
// TEXT CONTROLS
// --------------------------------------------------

document
  .getElementById("textInput")
  .addEventListener("input", function(event) {

    const layer = getSelectedLayer();

    if (!layer || layer.type !== "text") {
      return;
    }

    layer.content = event.target.value;

    renderLayers();
  });

document
  .getElementById("textColor")
  .addEventListener("input", function(event) {

    const layer = getSelectedLayer();

    if (!layer || layer.type !== "text") {
      return;
    }

    layer.color = event.target.value;
  });

document
  .getElementById("fontSize")
  .addEventListener("input", function(event) {

    const layer = getSelectedLayer();

    if (!layer || layer.type !== "text") {
      return;
    }

    layer.size = Number(event.target.value);
  });

document
  .getElementById("textX")
  .addEventListener("input", function(event) {

    const layer = getSelectedLayer();

    if (!layer || layer.type !== "text") {
      return;
    }

    layer.x = Number(event.target.value);
  });

document
  .getElementById("textY")
  .addEventListener("input", function(event) {

    const layer = getSelectedLayer();

    if (!layer || layer.type !== "text") {
      return;
    }

    layer.y = Number(event.target.value);
  });

// --------------------------------------------------
// ADD TEXT
// --------------------------------------------------

document
  .getElementById("textX")
  .addEventListener("input", function(event) {

    const number =
      blinkie.layers.filter(function(layer) {
        return layer.type === "text";
      }).length + 1;

    const newLayer = {
      id: createId(),
      type: "text",
      name: "Text " + number,
      content: "NEW TEXT!",
      color: "#ffffff",
      size: 14,
      x: canvas.width / 2,
      y: canvas.height / 2,
      visible: true
    };

    blinkie.layers.push(newLayer);

    selectedLayer = newLayer.id;

    loadLayerControls();
    renderLayers();
  });

// --------------------------------------------------
// DELETE SELECTED LAYER
// --------------------------------------------------

document
  .getElementById("deleteLayerBtn")
  .addEventListener("click", function() {

    const layer = getSelectedLayer();

    if (!layer) {
      return;
    }

    if (
      layer.type === "background" ||
      layer.type === "border"
    ) {

      alert(
        "You can only delete text layers right now!"
      );

      return;
    }

    blinkie.layers =
      blinkie.layers.filter(function(item) {
        return item.id !== layer.id;
      });

    const remainingText =
      blinkie.layers.slice().reverse().find(
        function(item) {
          return item.type === "text";
        }
      );

    if (remainingText) {
      selectedLayer = remainingText.id;
    } else {
      selectedLayer = "background";
    }

    loadLayerControls();
    renderLayers();
  });

// --------------------------------------------------
// BACKGROUND
// --------------------------------------------------

document
  .getElementById("backgroundColor")
  .addEventListener("input", function(event) {

    const background =
      getLayer("background");

    background.color =
      event.target.value;
  });

// --------------------------------------------------
// BORDER UPLOAD
// --------------------------------------------------

borderUpload.addEventListener(
  "change",
  function(event) {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = function() {

      const image = new Image();

      image.onload = function() {

        const border =
          getLayer("border");

        border.image = image;

        selectedLayer = "border";

        renderLayers();
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  }
);

// --------------------------------------------------
// REMOVE BORDER
// --------------------------------------------------

document
  .getElementById("removeBorder")
  .addEventListener("click", function() {

    const border =
      getLayer("border");

    border.image = null;

    borderUpload.value = "";

    renderLayers();
  });

// --------------------------------------------------
// CLEAR
// --------------------------------------------------

document
  .getElementById("clearBtn")
  .addEventListener("click", function() {

    blinkie.layers = [
      {
        id: "background",
        type: "background",
        name: "Background",
        color: "#73c9f5",
        visible: true
      },
      {
        id: "text-1",
        type: "text",
        name: "Text",
        content: "HELLO!",
        color: "#ffffff",
        size: 14,
        x: 150,
        y: 30,
        visible: true
      },
      {
        id: "border",
        type: "border",
        name: "Border",
        image: null,
        visible: true
      }
    ];

    selectedLayer = "text-1";

    document.getElementById(
      "backgroundColor"
    ).value = "#73c9f5";

    document.getElementById(
      "borderUpload"
    ).value = "";

    loadLayerControls();
    renderLayers();
  });

// --------------------------------------------------
// EXPORT
// --------------------------------------------------

document
  .getElementById("exportBtn")
  .addEventListener("click", function() {

    const link =
      document.createElement("a");

    link.download =
      "my-blinkie.png";

    link.href =
      canvas.toDataURL("image/png");

    link.click();
  });

// --------------------------------------------------
// START
// --------------------------------------------------

loadLayerControls();
renderLayers();

requestAnimationFrame(drawBlinkie);
