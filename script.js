window.addEventListener('resize', windowOnResize);

// Get the canvas element
const canvas = document.getElementById('canvas');
const borderCanvas = document.getElementById('border-canvas');
const gridCanvas = document.getElementById('grid-canvas');
const txtBrushSize = document.getElementById('txtBrushSize');
const chkGrid = document.getElementById('chkGrid');
const txtGridSize = document.getElementById('txtGridSize');

// Get the 2D context of the canvas
const ctx = canvas.getContext('2d');
const borderCtx = borderCanvas.getContext('2d');
const gridCtx = gridCanvas.getContext('2d');

// Set the initial brush diameter
let brushDiameter = 50;
let borderThickness = 5;
let gridSize = 20;
let gridOn = false;

resetCanvas();
refreshValues();

// Set the line width and stroke color
ctx.lineWidth = brushDiameter;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#ffffff';

borderCtx.lineWidth = brushDiameter + borderThickness * 2;
borderCtx.lineJoin = 'round';
borderCtx.lineCap = 'round';
borderCtx.strokeStyle = '#000000';

gridCtx.lineWidth = 1;
gridCtx.strokeStyle = '#808080';


// Set the initial position of the mouse
let pos = { x: 0, y: 0 };

// Add event listeners for mouse movement
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);
canvas.addEventListener('contextmenu', e => { e.preventDefault(); });
gridCanvas.addEventListener('contextmenu', e => { e.preventDefault(); });
window.addEventListener('wheel', e => {
  e.preventDefault();
  brushDiameter -= (e.deltaY * 0.01 * 5);
  if (brushDiameter < 5) {
    brushDiameter = 5;
  }
  refreshValues();
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
    // Only draw if the left mouse button is pressed
    drawInk(e, borderCtx, true);
    drawInk(e, ctx);
  } else if (e.buttons === 2) {
    //  Erase
    drawErase(e, borderCtx, true);
    drawErase(e, ctx);
  }

  // Update the mouse position
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
}

function drawInk(e, x, respectBorders) {
  x.globalCompositeOperation = 'source-over';

  x.beginPath();
  x.moveTo(pos.x, pos.y);
  setPosition(e);
  const midPoint = { x: (pos.x + pos.x) / 2, y: (pos.y + pos.y) / 2 };
  x.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

  x.lineWidth = brushDiameter + (respectBorders ? borderThickness * 2 : 0);
  x.lineCap = "round";
  x.stroke();
}

function drawErase(e, x, respectBorders) {
  x.globalCompositeOperation = 'destination-out';

  x.beginPath();
  x.moveTo(pos.x, pos.y);
  setPosition(e);
  const midPoint = { x: (pos.x + pos.x) / 2, y: (pos.y + pos.y) / 2 };
  x.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

  x.lineWidth = brushDiameter - (respectBorders ? borderThickness * 2 : 0);
  x.lineCap = "round";
  x.stroke();
}

function windowOnResize(e) {
  resetCanvas();
}

function resetCanvas() {
  // Set the canvas width and height to match the actual pixel size of the canvas element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  borderCanvas.width = canvas.width;
  borderCanvas.height = canvas.height;
  gridCanvas.width = canvas.width;
  gridCanvas.height = canvas.height;
}


function refreshValues() {
  txtBrushSize.value = brushDiameter;
  txtGridSize.value = gridSize;
}

function brushSizeOnChange(e) {
  brushDiameter = e.srcElement.value !== "" ? parseInt(e.srcElement.value) : 5;
  if (brushDiameter <= 0) {
    brushDiameter = 5;
  }
  refreshValues();
}

function gridSizeOnChange(e) {
  gridSize = e.srcElement.value !== "" ? parseInt(e.srcElement.value) : gridSize;
  console.log(gridSize);
  if (gridSize <= 0) {
    gridSize = 5;
  }
  refreshValues();
  drawGrid(gridCanvas.width, gridCanvas.height);
}

function gridOnChange(e) {
  gridOn = e.target.checked;
  drawGrid(gridCanvas.width, gridCanvas.height);
  gridCanvas.style.display = gridOn ? 'block' : 'none';
}

function drawGrid(width, height) {
  console.log("MEN VAD FARAO!!!");
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
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

  for (let y = 0; y < height; y += gridSize) {
    gridCtx.moveTo(0, y);
    gridCtx.lineTo(width, y);
    gridCtx.stroke();
  }
  for (let x = 0; x < width; x += gridSize) {
    gridCtx.moveTo(x, 0);
    gridCtx.lineTo(x, height);
    gridCtx.stroke();
  }
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



