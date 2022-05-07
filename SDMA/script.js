var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var params = {
    roadLength: 100, // m
    roadLanes: 3,
    minDistanceBetweenVehicles: 10, // m
    spaceDivisionLength: 5, // m
    positioningAccuracy: 2, // m
    broadcastRadius: 20, // m
    broadcastInterval: 1000 // ms
}
var scaleFactor = 15;
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
    ctx.strokeStyle = "black";
    ctx.lineWidth = positioningAccuracy;

    for (var i = 0; i < spaceDivisionCountInLane; ++i) {
        for (var j = 0; j < params.roadLanes; ++j) {
            ctx.rect(i * spaceDivisionLength + positioningAccuracy / 2, j * spaceDivisionLength + positioningAccuracy / 2, spaceDivisionLength, spaceDivisionLength);
            ctx.stroke();
        }
    }
}

function resetCoords(node) {
    node.x = 0;
    node.y = (spaceDivisionLength + positioningAccuracy) / 2 + 2 * spaceDivisionLength;
    return node;
}

var nodes = {
    red: resetCoords({}),
    green: resetCoords({}),
    blue: resetCoords({})
}

var moveUnit = 0.01 * scaleFactor;
var broadcastRadius = params.broadcastRadius * scaleFactor;

function drawNodes() {
    for ([color, node] of Object.entries(nodes)) {
        if (node.x > canvas.width) {
            resetCoords(node);
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, spaceDivisionLength / 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.arc(node.x, node.y, broadcastRadius, 0, 2 * Math.PI);
        ctx.stroke();

        node.x += getSpeed(color) * moveUnit;
    }
}

var lastRender = performance.now();

function displayRenderTime() {
    let now = performance.now();
    let delta = now - lastRender;
    lastRender = now;
    document.getElementById("frametime").textContent = delta.toFixed() + " ms";
}

function draw() {
    drawBackground();
    drawSpaceDivisions();
    drawNodes();

    displayRenderTime();

    requestAnimationFrame(draw);
}
draw();

function getSpeed(color) {
    return parseInt(document.getElementById(color).value);
}

// logger function: log(string, color_as_string);
function log(txt, color) {
    content('#log','<span style="color:' + color + ';">' + txt + '</span><br>');
}

// modify content on html
function content(divSelector, value) {
    document.querySelector(divSelector).innerHTML += value;
}





// example usage of log() -- remove when not needed

/*var counter = 1;

setInterval(example_log_setter, 1000);

function example_log_setter() {
    log("Hello world " + counter, "red");
    log("Hello HTML " + counter, "blue");
    counter += 1;
}*/

setInterval(broadcastPositions, params.broadcastInterval);

function broadcastPositions() {
    for ([color, node] of Object.entries(nodes)) {
        log(`Broadcasting position of node [${color}]`, color);
        for ([_color, _node] of Object.entries(nodes)) {
            if (node != _node && isInRadius(node, _node)) {
                log(`Node [${_color}] received position from node [${color}]`, _color);
            }
        }
    }
}

function isInRadius(sourceNode, targetNode) {
    let distance = Math.sqrt((sourceNode.x - targetNode.x) ** 2 + (sourceNode.y - targetNode.y) ** 2);
    return distance <= broadcastRadius
}
