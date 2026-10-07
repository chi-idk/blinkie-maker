// ==================================================
// BLINKIE MAKER
// ==================================================


// ==================================================
// CANVAS
// ==================================================

const canvas =
  document.getElementById("blinkieCanvas");

const ctx =
  canvas.getContext("2d");


// ==================================================
// BLINKIE DATA
// ==================================================

const blinkie = {

  layers: [

    // ----------------------------------------------
    // BACKGROUND
    // ----------------------------------------------

    {
      id: "background",

      type: "background",

      name: "Background",

      color: "#73c9f5",

      visible: true
    },


    // ----------------------------------------------
    // DEFAULT TEXT
    // ----------------------------------------------

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


    // ----------------------------------------------
    // BORDER
    // ----------------------------------------------

    {
      id: "border",

      type: "border",

      name: "Border",

      image: null,

      visible: true
    }

  ]

};


// ==================================================
// STATE
// ==================================================

let selectedLayer =
  "text-1";


// ==================================================
// ELEMENT REFERENCES
// ==================================================

const layersList =
  document.getElementById("layersList");

const borderUpload =
  document.getElementById("borderUpload");

const imageUpload =
  document.getElementById("imageUpload");


// ==================================================
// HELPERS
// ==================================================

function getLayer(id) {

  return blinkie.layers.find(
    function(layer) {
      return layer.id === id;
    }
  );

}


function getSelectedLayer() {

  return getLayer(
    selectedLayer
  );

}


function createId() {

  return (
    "layer-" +
    Date.now() +
    "-" +
    Math.floor(
      Math.random() * 10000
    )
  );

}


// ==================================================
// CANVAS DRAWING
// ==================================================

function drawBlinkie(time) {


  // ----------------------------------------------
  // CLEAR CANVAS
  // ----------------------------------------------

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // ----------------------------------------------
  // DRAW EVERY LAYER
  // ----------------------------------------------

  blinkie.layers.forEach(
    function(layer) {


      // Skip hidden layers

      if (!layer.visible) {

        return;

      }


      // ==========================================
      // BACKGROUND
      // ==========================================

      if (
        layer.type === "background"
      ) {

        ctx.fillStyle =
          layer.color;

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

      }


      // ==========================================
      // TEXT
      // ==========================================

      if (
        layer.type === "text"
      ) {

        ctx.save();


        // ----------------------------------------
        // ANIMATION
        // ----------------------------------------

        let alpha = 1;

        let scale = 1;

        let fillColor =
          layer.color;


        const animationElement =
          document.getElementById(
            "animationSelect"
          );


        const speedElement =
          document.getElementById(
            "speedInput"
          );


        const animation =
          animationElement
            ? animationElement.value
            : "none";


        const speed =
          speedElement
            ? Number(speedElement.value)
            : 5;


        // ----------------------------------------
        // BLINK
        // ----------------------------------------

        if (
          animation === "blink"
        ) {

          const interval =
            600 - speed * 45;


          alpha =
            Math.floor(
              time / interval
            ) % 2 === 0
              ? 1
              : 0.1;

        }


        // ----------------------------------------
        // PULSE
        // ----------------------------------------

        if (
          animation === "pulse"
        ) {

          const pulse =
            Math.sin(
              time /
              (500 - speed * 30)
            );


          scale =
            1 +
            pulse * 0.08;

        }


        // ----------------------------------------
        // RAINBOW
        // ----------------------------------------

        if (
          animation === "rainbow"
        ) {

          const hue =
            (
              time /
              (40 - speed * 2)
            ) % 360;


          fillColor =
            "hsl(" +
            hue +
            ", 100%, 70%)";

        }


        // ----------------------------------------
        // TEXT POSITION
        // ----------------------------------------

        ctx.globalAlpha =
          alpha;


        ctx.translate(
          layer.x,
          layer.y
        );


        ctx.scale(
          scale,
          scale
        );


        // ----------------------------------------
        // FONT
        // ----------------------------------------

        ctx.font =
          "800 " +
          layer.size +
          "px Arial, sans-serif";


        ctx.textAlign =
          "center";


        ctx.textBaseline =
          "middle";


        // ----------------------------------------
        // SHADOW
        // ----------------------------------------

        ctx.fillStyle =
          "rgba(0, 70, 110, 0.35)";


        ctx.fillText(
          layer.content,
          2,
          2
        );


        // ----------------------------------------
        // TEXT
        // ----------------------------------------

        ctx.fillStyle =
          fillColor;


        ctx.fillText(
          layer.content,
          0,
          0
        );


        ctx.restore();

      }


      // ==========================================
      // IMAGE
      // ==========================================

      if (
        layer.type === "image" &&
        layer.image
      ) {

        ctx.drawImage(

          layer.image,

          layer.x -
            layer.width / 2,

          layer.y -
            layer.height / 2,

          layer.width,

          layer.height

        );

      }


      // ==========================================
      // BORDER
      // ==========================================

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

    }
  );


  // ----------------------------------------------
  // NEXT FRAME
  // ----------------------------------------------

  requestAnimationFrame(
    drawBlinkie
  );

}


// ==================================================
// LAYER ICONS
// ==================================================

function getLayerIcon(layer) {


  if (
    layer.type === "background"
  ) {

    return "▰";

  }


  if (
    layer.type === "text"
  ) {

    return "T";

  }


  if (
    layer.type === "image"
  ) {

    return "🖼";

  }


  if (
    layer.type === "border"
  ) {

    return "▧";

  }


  return "✦";

}


// ==================================================
// RENDER LAYERS
// ==================================================

function renderLayers() {


  if (!layersList) {

    return;

  }


  layersList.innerHTML =
    "";


  // Newest/top layers first

  blinkie.layers
    .slice()
    .reverse()
    .forEach(
      function(layer) {


        const item =
          document.createElement(
            "div"
          );


        item.className =
          "layer-item";


        // Selected layer

        if (
          layer.id ===
          selectedLayer
        ) {

          item.classList.add(
            "selected"
          );

        }


        // --------------------------------------
        // VISIBILITY BUTTON
        // --------------------------------------

        const visibility =
          document.createElement(
            "button"
          );


        visibility.className =
          "layer-visibility";


        visibility.textContent =
          layer.visible
            ? "●"
            : "○";


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


        // --------------------------------------
        // ICON
        // --------------------------------------

        const icon =
          document.createElement(
            "span"
          );


        icon.className =
          "layer-icon";


        icon.textContent =
          getLayerIcon(layer);


        // --------------------------------------
        // NAME
        // --------------------------------------

        const name =
          document.createElement(
            "span"
          );


        name.className =
          "layer-name";


        name.textContent =
          layer.name;


        // --------------------------------------
        // BUILD ITEM
        // --------------------------------------

        item.appendChild(
          visibility
        );


        item.appendChild(
          icon
        );


        item.appendChild(
          name
        );


        // --------------------------------------
        // SELECT
        // --------------------------------------

        item.addEventListener(
          "click",
          function() {


            selectedLayer =
              layer.id;


            loadLayerControls();


            renderLayers();

          }
        );


        layersList.appendChild(
          item
        );

      }
    );

}


// ==================================================
// LOAD SELECTED LAYER CONTROLS
// ==================================================

function loadLayerControls() {


  const layer =
    getSelectedLayer();


  if (!layer) {

    return;

  }


  // ================================================
  // TEXT
  // ================================================

  if (
    layer.type === "text"
  ) {

    document.getElementById(
      "textInput"
    ).value =
      layer.content;


    document.getElementById(
      "textColor"
    ).value =
      layer.color;


    document.getElementById(
      "fontSize"
    ).value =
      layer.size;


    document.getElementById(
      "textX"
    ).value =
      layer.x;


    document.getElementById(
      "textY"
    ).value =
      layer.y;

  }


  // ================================================
  // IMAGE
  // ================================================

  if (
    layer.type === "image"
  ) {

    document.getElementById(
      "imageWidth"
    ).value =
      layer.width;


    document.getElementById(
      "imageHeight"
    ).value =
      layer.height;


    document.getElementById(
      "imageX"
    ).value =
      layer.x;


    document.getElementById(
      "imageY"
    ).value =
      layer.y;

  }

}


// ==================================================
// TEXT CONTROLS
// ==================================================

document
  .getElementById("textInput")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "text"
      ) {

        return;

      }


      layer.content =
        event.target.value;


      renderLayers();

    }
  );


document
  .getElementById("textColor")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "text"
      ) {

        return;

      }


      layer.color =
        event.target.value;

    }
  );


document
  .getElementById("fontSize")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "text"
      ) {

        return;

      }


      layer.size =
        Number(
          event.target.value
        );

    }
  );


document
  .getElementById("textX")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "text"
      ) {

        return;

      }


      layer.x =
        Number(
          event.target.value
        );

    }
  );


document
  .getElementById("textY")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "text"
      ) {

        return;

      }


      layer.y =
        Number(
          event.target.value
        );

    }
  );


// ==================================================
// ADD TEXT
// ==================================================

document
  .getElementById("addTextBtn")
  .addEventListener(
    "click",
    function() {


      const number =
        blinkie.layers.filter(
          function(layer) {

            return (
              layer.type ===
              "text"
            );

          }
        ).length + 1;


      const newLayer = {

        id:
          createId(),

        type:
          "text",

        name:
          "Text " + number,

        content:
          "NEW TEXT!",

        color:
          "#ffffff",

        size:
          14,

        x:
          canvas.width / 2,

        y:
          canvas.height / 2,

        visible:
          true

      };


      blinkie.layers.push(
        newLayer
      );


      selectedLayer =
        newLayer.id;


      loadLayerControls();

      renderLayers();

    }
  );


// ==================================================
// ADD IMAGE
// ==================================================

const addImageBtn =
  document.getElementById("addImageBtn");

const newImageUpload =
  document.getElementById("newImageUpload");


addImageBtn.addEventListener(
  "click",
  function() {

    // Open the file picker immediately
    newImageUpload.click();

  }
);


newImageUpload.addEventListener(
  "change",
  function(event) {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();


    reader.onload =
      function() {

        const image =
          new Image();


        image.onload =
          function() {

            const number =
              blinkie.layers.filter(
                function(layer) {

                  return (
                    layer.type ===
                    "image"
                  );

                }
              ).length + 1;


            const maxWidth = 200;

            let width =
              image.width;

            let height =
              image.height;


            // Keep huge images reasonable
            if (width > maxWidth) {

              const ratio =
                maxWidth / width;

              width =
                Math.round(
                  width * ratio
                );

              height =
                Math.round(
                  height * ratio
                );

            }


            const newLayer = {

              id:
                createId(),

              type:
                "image",

              name:
                "Image " + number,

              image:
                image,

              width:
                width,

              height:
                height,

              x:
                canvas.width / 2,

              y:
                canvas.height / 2,

              visible:
                true

            };


            blinkie.layers.push(
              newLayer
            );


            selectedLayer =
              newLayer.id;


            loadLayerControls();

            renderLayers();


            // Allow the same file to be
            // selected again later.
            newImageUpload.value =
              "";

          };


        image.src =
          reader.result;

      };


    reader.readAsDataURL(file);

  }
);

// ==================================================
// DELETE LAYER
// ==================================================

document
  .getElementById("deleteLayerBtn")
  .addEventListener(
    "click",
    function() {


      const layer =
        getSelectedLayer();


      if (!layer) {

        return;

      }


      // Don't delete these yet

      if (
        layer.type === "background" ||
        layer.type === "border"
      ) {

        alert(
          "Background and Border cannot be deleted yet."
        );

        return;

      }


      blinkie.layers =
        blinkie.layers.filter(
          function(item) {

            return (
              item.id !==
              layer.id
            );

          }
        );


      // Select another layer

      const nextLayer =
        blinkie.layers
          .slice()
          .reverse()
          .find(
            function(item) {

              return (
                item.type === "text" ||
                item.type === "image"
              );

            }
          );


      if (nextLayer) {

        selectedLayer =
          nextLayer.id;

      } else {

        selectedLayer =
          "background";

      }


      loadLayerControls();

      renderLayers();

    }
  );


// ==================================================
// IMAGE CONTROLS
// ==================================================

document
  .getElementById("imageWidth")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "image"
      ) {

        return;

      }


      layer.width =
        Number(
          event.target.value
        );

    }
  );


document
  .getElementById("imageHeight")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "image"
      ) {

        return;

      }


      layer.height =
        Number(
          event.target.value
        );

    }
  );


document
  .getElementById("imageX")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "image"
      ) {

        return;

      }


      layer.x =
        Number(
          event.target.value
        );

    }
  );


document
  .getElementById("imageY")
  .addEventListener(
    "input",
    function(event) {


      const layer =
        getSelectedLayer();


      if (
        !layer ||
        layer.type !== "image"
      ) {

        return;

      }


      layer.y =
        Number(
          event.target.value
        );

    }
  );


// ==================================================
// IMAGE UPLOAD
// ==================================================

imageUpload.addEventListener(
  "change",
  function(event) {


    const file =
      event.target.files[0];


    if (!file) {

      return;

    }


    const layer =
      getSelectedLayer();


    if (
      !layer ||
      layer.type !== "image"
    ) {

      alert(
        "Select an image layer first!"
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      function() {


        const image =
          new Image();


        image.onload =
          function() {


            layer.image =
              image;


            // --------------------------------
            // SCALE LARGE IMAGES
            // --------------------------------

            const maxWidth =
              200;


            if (
              image.width >
              maxWidth
            ) {

              const ratio =
                maxWidth /
                image.width;


              layer.width =
                Math.round(
                  image.width *
                  ratio
                );


              layer.height =
                Math.round(
                  image.height *
                  ratio
                );

            } else {

              layer.width =
                image.width;


              layer.height =
                image.height;

            }


            loadLayerControls();

            renderLayers();

          };


        image.src =
          reader.result;

      };


    reader.readAsDataURL(
      file
    );

  }
);


// ==================================================
// BACKGROUND
// ==================================================

document
  .getElementById("backgroundColor")
  .addEventListener(
    "input",
    function(event) {


      const background =
        getLayer("background");


      background.color =
        event.target.value;

    }
  );


// ==================================================
// BORDER UPLOAD
// ==================================================

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


    reader.onload =
      function() {


        const image =
          new Image();


        image.onload =
          function() {


            const border =
              getLayer("border");


            border.image =
              image;


            selectedLayer =
              "border";


            renderLayers();

          };


        image.src =
          reader.result;

      };


    reader.readAsDataURL(
      file
    );

  }
);


// ==================================================
// REMOVE BORDER
// ==================================================

document
  .getElementById("removeBorder")
  .addEventListener(
    "click",
    function() {


      const border =
        getLayer("border");


      border.image =
        null;


      borderUpload.value =
        "";


      renderLayers();

    }
  );


// ==================================================
// ANIMATION CONTROLS
// ==================================================

document
  .getElementById("animationSelect")
  .addEventListener(
    "change",
    function() {

      renderLayers();

    }
  );


document
  .getElementById("speedInput")
  .addEventListener(
    "input",
    function() {

      renderLayers();

    }
  );


// ==================================================
// CLEAR
// ==================================================

document
  .getElementById("clearBtn")
  .addEventListener(
    "click",
    function() {


      blinkie.layers = [

        {
          id:
            "background",

          type:
            "background",

          name:
            "Background",

          color:
            "#73c9f5",

          visible:
            true
        },


        {
          id:
            "text-1",

          type:
            "text",

          name:
            "Text",

          content:
            "HELLO!",

          color:
            "#ffffff",

          size:
            14,

          x:
            150,

          y:
            30,

          visible:
            true
        },


        {
          id:
            "border",

          type:
            "border",

          name:
            "Border",

          image:
            null,

          visible:
            true
        }

      ];


      selectedLayer =
        "text-1";


      document.getElementById(
        "backgroundColor"
      ).value =
        "#73c9f5";


      borderUpload.value =
        "";


      imageUpload.value =
        "";


      loadLayerControls();

      renderLayers();

    }
  );


// ==================================================
// EXPORT
// ==================================================

document
  .getElementById("exportBtn")
  .addEventListener(
    "click",
    function() {


      const link =
        document.createElement(
          "a"
        );


      link.download =
        "my-blinkie.png";


      link.href =
        canvas.toDataURL(
          "image/png"
        );


      link.click();

    }
  );


// ==================================================
// START
// ==================================================

loadLayerControls();

renderLayers();

requestAnimationFrame(
  drawBlinkie
);
