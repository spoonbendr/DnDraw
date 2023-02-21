window.addEventListener('resize', windowOnResize);

// Get the canvas element
const canvas = document.getElementById('canvas');
const borderCanvas = document.getElementById('border-canvas');
const txtBrushSize = document.getElementById('txtBrushSize');

// Get the 2D context of the canvas
const ctx = canvas.getContext('2d');
const borderCtx = borderCanvas.getContext('2d');

// Set the initial brush diameter
let brushDiameter = 50;
let borderThickness = 5;

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


// Set the initial position of the mouse
let pos = { x: 0, y: 0 };

// Add event listeners for mouse movement
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);
canvas.addEventListener('contextmenu', e => { e.preventDefault(); });
window.addEventListener('wheel', e => { 
  e.preventDefault(); 
  brushDiameter -= (e.deltaY * 0.01 * 5);
  if(brushDiameter < 5) {
    brushDiameter = 5;
  }
  refreshValues();
});
txtBrushSize.addEventListener('change', brushSizeOnChange);

// Set the position of the mouse when it is clicked or enters the canvas
function setPosition(e) {
	pos.x = e.clientX - canvas.offsetLeft;
	pos.y = e.clientY - canvas.offsetTop;
}

// Draw a line from the previous mouse position to the current position using a quadratic curve
function draw(e) {
  if (e.buttons === 1) {
    // Only draw if the left mouse button is pressed
    ctx.globalCompositeOperation = 'source-over';
    borderCtx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    const midPoint = { x: (pos.x + pos.x) / 2, y: (pos.y + pos.y) / 2 };
    ctx.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

    ctx.lineWidth = brushDiameter;
    ctx.lineCap = "round";
    ctx.stroke();
    borderCtx.beginPath();
    borderCtx.moveTo(pos.x, pos.y);
    borderCtx.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

    console.log(brushDiameter + borderThickness * 2);
    borderCtx.lineWidth = brushDiameter + borderThickness * 2;
    borderCtx.lineCap = "round";
    borderCtx.stroke();
  } else if (e.buttons === 2) {
    //  Erase
    ctx.globalCompositeOperation = 'destination-out';
    borderCtx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    const midPoint = { x: (pos.x + pos.x) / 2, y: (pos.y + pos.y) / 2 };
    ctx.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

    ctx.lineWidth = brushDiameter;
    ctx.lineCap = "round";
    ctx.stroke();
    borderCtx.beginPath();
    borderCtx.moveTo(pos.x, pos.y);
    borderCtx.quadraticCurveTo(pos.x, pos.y, midPoint.x, midPoint.y);

    borderCtx.lineWidth = brushDiameter - borderThickness * 2;
    borderCtx.lineCap = "round";
    borderCtx.stroke();
  }

  // Update the mouse position
  pos.x = e.clientX - canvas.offsetLeft;
  pos.y = e.clientY - canvas.offsetTop;
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
}


function refreshValues() {
  txtBrushSize.value = brushDiameter;
}

function brushSizeOnChange(e) {
  console.log(e.srcElement.value);
  brushDiameter = e.srcElement.value !== "" ? parseInt(e.srcElement.value) : 5;
  if(brushDiameter <= 0) {
    brushDiameter = 5;
  }
  refreshValues();
}

