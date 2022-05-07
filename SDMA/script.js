var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var params = {
    roadLength: 500,
    roadLanes: 3,
    minDistanceBetweenVehicles: 10,
    spaceDivisionLength: 5,
    positioningAccuracy: 2
}
var scaleFactor = 1;
var positioningAccuracy = params.positioningAccuracy * scaleFactor;
var spaceDivisionCountInLane = params.roadLength / params.spaceDivisionLength;
var spaceDivisionLength = params.spaceDivisionLength * scaleFactor;

canvas.width = params.roadLength * scaleFactor + positioningAccuracy;
canvas.height = params.roadLanes * params.spaceDivisionLength * scaleFactor + positioningAccuracy;

function drawBackground() {
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSpaceDivisions() {
    ctx.beginPath();
    ctx.lineWidth = positioningAccuracy;

    for (var i = 0; i < spaceDivisionCountInLane; ++i) {
        for (var j = 0; j < params.roadLanes; ++j) {
            ctx.rect(i * spaceDivisionLength + positioningAccuracy / 2, j * spaceDivisionLength + positioningAccuracy / 2, spaceDivisionLength, spaceDivisionLength);
            ctx.stroke();
        }
    }
}

var circleCoords = {
    x: 0,
    y: (spaceDivisionLength + positioningAccuracy) / 2
}

function drawMovingCircle() {
    if (circleCoords.x > canvas.width) {
        circleCoords.x = 0;
    }

    ctx.beginPath();
    ctx.arc(circleCoords.x, circleCoords.y, scaleFactor * 2, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    circleCoords.x += 5;
}

var lastRender = performance.now();

function displayRenderTime() {
    var now = performance.now();
    var delta = now - lastRender;
    lastRender = now;
    document.getElementById("frametime").textContent = delta.toFixed() + " ms";
}

function draw() {
    drawBackground();
    drawSpaceDivisions();
    drawMovingCircle();

    displayRenderTime();

    requestAnimationFrame(draw);
}
draw();

function log(txt,color) {
    // TODO
}
