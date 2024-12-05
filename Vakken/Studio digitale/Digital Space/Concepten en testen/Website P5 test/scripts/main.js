let canvasTexture;
let graphics;
let angle = 0;
let figurineMesh;
let textureCanvas;

let canvasSize = [500, 500];
let imageSize = [100, 100];

let previewX = 0, previewY = 0;  // Coordinates for the preview of where to draw

function setup() {
  createCanvas(canvasSize[0], canvasSize[1], WEBGL);

  // Create an off-screen graphics buffer to draw on
  graphics = createGraphics(500, 500);
  graphics.background(200); // Initialize with a light background

  // Create a texture from the graphics buffer
  canvasTexture = createImage(imageSize[0], imageSize[1]);

  // Load the 3D model and set the texture
  figurineMesh = loadModel('res/models/figurine.obj', true);  // Replace with your file path

  // Create a preview canvas for the texture
  textureCanvas = createGraphics(canvasSize[0], canvasSize[1]);
  textureCanvas.background(200);  // Initialize with a light background
  updateTexturePreview();
}

function draw() {
  background(100);

  // Apply rotations to orient the model correctly
  rotateX(PI);  // Flip the model upside down
  rotateY(angle);
  angle += radians(0.5); // Rotate the model slightly

  // Apply the texture to the model and draw it
  push();
  texture(canvasTexture);
  model(figurineMesh); // Draw the 3D model
  pop();

  // Update the texture with the current state of the graphics buffer
  canvasTexture.copy(graphics, 0, 0, graphics.width, graphics.height, 0, 0, canvasTexture.width, canvasTexture.height);

  // Display the texture preview on the right side
  updateTexturePreview();
  
  // Draw instructions
  resetMatrix();
  fill(255);
  textSize(14);
  textAlign(CENTER);
  text("Drag the mouse to draw on the texture", width / 2 - 300, -height / 2 + 20);

  // Draw the preview circle on the model
  drawPreview();
}

function mouseDragged() {
  // Calculate the 3D point on the model to draw
  let ray = createRay(mouseX, mouseY);
  let intersection = getRayIntersection(ray);

  if (intersection) {
    // Update the preview position based on the intersection point
    previewX = intersection.x;
    previewY = intersection.y;

    // Map the 3D point to the 2D texture coordinates
    let texX = map(previewX, -width / 2, width / 2, 0, graphics.width);
    let texY = map(previewY, -height / 2, height / 2, 0, graphics.height);

    // Draw on the graphics buffer
    graphics.noStroke();
    graphics.fill(255, 0, 0); // Red brush
    graphics.ellipse(texX, texY, 10, 10);

    // Update the texture with the new drawing
    canvasTexture.copy(graphics, 0, 0, graphics.width, graphics.height, 0, 0, canvasTexture.width, canvasTexture.height);
  }
}

// Create a ray based on the mouse position
function createRay(mouseX, mouseY) {
  let p = createVector(mouseX - width / 2, mouseY - height / 2, 0);
  return p;
}

// Function to simulate ray intersection with the model
function getRayIntersection(ray) {
  // Simple placeholder logic for demonstration purposes
  // You would need actual raycasting here to find where the ray intersects with the 3D model
  let modelRadius = 200;  // Assuming the model fits within this radius
  let intersectX = ray.x * modelRadius / width;
  let intersectY = ray.y * modelRadius / height;
  return { x: intersectX, y: intersectY };
}

function drawPreview() {
  // Draw a preview circle at the predicted location on the model
  fill(0, 255, 0); // Green color for preview
  noStroke();
  push();
  translate(previewX, previewY);
  ellipse(0, 0, 15, 15);  // Draw preview circle at the predicted draw location
  pop();
}

function updateTexturePreview() {
  // Copy the texture to the preview canvas
  textureCanvas.image(canvasTexture, 0, 0, textureCanvas.width, textureCanvas.height);

  // Convert the texture to a Data URL and set it as the background of the preview div
  const textureDataUrl = textureCanvas.canvas.toDataURL();
  document.getElementById("texture-preview").style.backgroundImage = `url(${textureDataUrl})`;
}
