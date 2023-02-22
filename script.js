// let brushDiameter = 50;
// let borderThickness = 4;
// let gridSize = 20;
// let gridOn = true;

const settings = loadSettings();



//  mouse position
let pos = { x: 0, y: 0 };


const txtBrushSize = document.getElementById('txtBrushSize');
const chkGrid = document.getElementById('chkGrid');
const txtGridSize = document.getElementById('txtGridSize');

window.addEventListener('resize', windowOnResize);

// Get the canvas element
const canvas = document.getElementById('canvas');
const borderCanvas = document.getElementById('border-canvas');
const gridCanvas = document.getElementById('grid-canvas');

// Get the 2D context of the canvas
const ctx = canvas.getContext('2d');
const borderCtx = borderCanvas.getContext('2d');
const gridCtx = gridCanvas.getContext('2d');

resetCanvasSize();
refreshInputValues();

// Set the line width and stroke color
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#808080';
// ctx.globalCompositeOperation = 'destination-out';
// ctx.globalCompositeOperation = 'source-over';

borderCtx.lineJoin = 'round';
borderCtx.lineCap = 'round';
borderCtx.strokeStyle = '#000000';

gridCtx.lineWidth = 1;
gridCtx.strokeStyle = '#808080';

drawGrid(gridCanvas.width, gridCanvas.height);
resetCanvasFill(canvas.offsetWidth, canvas.offsetHeight);

// Add event listeners for mouse movement
canvas.addEventListener('mousemove', e => {
  setPosition(e);
  draw(e);
});
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('contextmenu', e => { e.preventDefault(); });
gridCanvas.addEventListener('contextmenu', e => { e.preventDefault(); });
window.addEventListener('wheel', e => {
  // e.preventDefault();
  settings.brushDiameter -= (e.deltaY * 0.01 * 5);
  if (settings.brushDiameter < 5) {
    settings.brushDiameter = 5;
  }
  refreshInputValues();
});

txtBrushSize.addEventListener('change', brushSizeOnChange);
txtGridSize.addEventListener('change', gridSizeOnChange);
chkGrid.addEventListener('click', gridOnChange);

// Set the position of the mouse when it is clicked or enters the canvas
function setPosition(e) {
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
}


// Draw a line from the previous mouse position to the current position using a quadratic curve
function draw(e) {
  if (e.buttons === 1) {
    // Left button

    drawCanvas(borderCtx, 'destination-out', settings.brushDiameter - settings.borderThickness * 2);
    drawCanvas(ctx, 'destination-out', settings.brushDiameter);
  } else if (e.buttons === 2) {
    // Right button

    drawCanvas(borderCtx, 'source-over', settings.brushDiameter + settings.borderThickness * 2);
    drawCanvas(ctx, 'source-over', settings.brushDiameter);
  }

  // Update the mouse position
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
}

function drawCanvas(x, globalCompositeOperation, lineWidth) {
  x.globalCompositeOperation = globalCompositeOperation;
  x.beginPath();
  x.moveTo(pos.x, pos.y);
  const midPoint = { x: (pos.x + pos.x) / 2, y: (pos.y + pos.y) / 2 };
  x.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

  x.lineWidth = lineWidth;
  x.lineCap = "round";
  x.stroke();
}

function windowOnResize(e) {
  resetCanvasSize();
}

function resetCanvasSize() {
  // Set the canvas width and height to match the actual pixel size of the canvas element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  borderCanvas.width = borderCanvas.offsetWidth;
  borderCanvas.height = borderCanvas.offsetHeight;
  gridCanvas.width = gridCanvas.offsetWidth;
  gridCanvas.height = gridCanvas.offsetHeight;
}

function resetCanvasFill(w, h){
  ctx.fillStyle = '#808080';
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fill();

  borderCtx.fillStyle = '#000000';
  borderCtx.beginPath();
  borderCtx.rect(0, 0, w, h);
  borderCtx.fill();
}


function refreshInputValues() {
  txtBrushSize.value = settings.brushDiameter;
  txtGridSize.value = settings.gridSize;
  chkGrid.checked = settings.gridOn;
}

function brushSizeOnChange(e) {
  settings.brushDiameter = e.srcElement.value !== "" ? parseInt(e.srcElement.value) : 5;
  if (settings.brushDiameter <= 0) {
    settings.brushDiameter = 5;
  }
  storeSettings(settings);
  refreshInputValues();
}

function gridSizeOnChange(e) {
  settings.gridSize = e.srcElement.value !== "" ? parseInt(e.srcElement.value) : settings.gridSize;
  if (settings.gridSize <= 0) {
    settings.gridSize = 5;
  }
  storeSettings(settings);
  refreshInputValues();
  drawGrid(gridCanvas.width, gridCanvas.height);
}

function gridOnChange(e) {
  settings.gridOn = e.target.checked;
  storeSettings(settings);
  drawGrid(gridCanvas.width, gridCanvas.height);
  gridCanvas.style.display = settings.gridOn ? 'block' : 'none';
}

function drawGrid(width, height) {
  gridCtx.fillStyle = '#ffffff';
  gridCtx.beginPath();
  gridCtx.rect(0, 0, gridCanvas.offsetWidth, gridCanvas.offsetHeight);
  gridCtx.fill();
  
  gridCtx.globalCompositeOperation = 'source-out';
  /*
  source-out
  destination-atop
  copy
  xor
  overlay
  darken
  exclusion
  hue
  saturation
  color
  luminosity
  */

  for (let y = 0; y < height; y += settings.gridSize) {
    gridCtx.moveTo(0, y);
    gridCtx.lineTo(width, y);
    gridCtx.stroke();
  }
  for (let x = 0; x < width; x += settings.gridSize) {
    gridCtx.moveTo(x, 0);
    gridCtx.lineTo(x, height);
    gridCtx.stroke();
  }
}

function storeSettings(settingsObject) {
  localStorage.setItem('settings', JSON.stringify(settingsObject));
}

function loadSettings() {
  var s = localStorage.getItem('settings');
  let result = null;

  if(s != null && s != "") {
    return JSON.parse(s);
  }

  return {
    "brushDiameter" : 50,
    "borderThickness" : 4,
    "gridSize" : 20,
    "gridOn" : true,
  };
}


// const a = 2 * Math.PI / 6;
// const r = 50;

// function drawHexagon(canvasContext, x, y) {
//   canvasContext.beginPath();
//   for (var i = 0; i < 6; i++) {
//     canvasContext.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
//   }
//   canvasContext.closePath();
//   canvasContext.stroke();
// }

// function drawHexGrid(canvasContext, width, height) {
//   for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
//     for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
//       drawHexagon(canvasContext, x, y);
//     }
//   }
// }



