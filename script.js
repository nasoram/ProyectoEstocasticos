var network;
var container;
var exportArea;
var importButton;
var exportButton;

document.getElementById('nodeCount').addEventListener('change', updateRange, false);

var options = {
  "nodes": {
  "fixed": {
    "x": true,
    "y": true
  },
  "physics": false
  },
  "edges": {
    "physics": false,
    "smooth": {
      "forceDirection": "none"
    }
  },
  "interaction": {
    "dragNodes": false,
    "dragView": false
  },
  "physics": {
    "enabled": false,
    "minVelocity": 0.75
  }
};

var graph = [
  {
    "x": 0,
    "y": 0,
    "id": "0",
    "connections": [ ]
  }
];
        
function generate() {
  for (var n = 0; n < document.getElementById('nodeCount').value; n++) {
    addNode();
  }
  var data = {
    nodes: getNodeData(graph),
    edges: getEdgeData(graph)
  }
  network = new vis.Network(container, data, options);

  resizeExportArea();
}

function addNode() {
  var size = graph.length;
  graph.push({
    "x": randomCoord(),
    "y": randomCoord(),
    "id": size ,
    "connections": dynamicalEdges(size),
  });
}

function randomCoord() {
  var num = Math.floor(Math.random()*2000); // this will get a number between 1 and 99;
  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
  return num;
}
              
function dynamicalEdges(size){
  var connections = [];
  for (var j = 0; j < size; j++) {
    if (getZeroOne() == 1) {
      connections.push(j);
    }
  }
  return connections;                
}
              
function getZeroOne() {
  return Math.floor(Math.random() * 2);
}
              
function updateRange() {
  document.getElementById('val').innerHTML=document.getElementById('nodeCount').value;
}
            
function init() {
  container = document.getElementById('network');
  importButton = document.getElementById('import_button');
  exportButton = document.getElementById('export_button');

  draw();
}

function addConnections(elem, index) {
  // need to replace this with a tree of the network, then get child direct children of the element
  elem.connections = network.getConnectedNodes(index);
}

function draw() {
  var inputData = graph;
  var data = {
    nodes: getNodeData(inputData),
    edges: getEdgeData(inputData)
  }
  network = new vis.Network(container, data, options);

}
            
function exportNetwork() {

  var nodes = objectToArray(network.getPositions());

  nodes.forEach(addConnections);

  // pretty print node data
  var exportValue = JSON.stringify(nodes, undefined, 2);

  exportArea.value = exportValue;

  resizeExportArea();
}

function getNodeData(data) {
  var networkNodes = [];

  data.forEach(function(elem, index, array) {
    networkNodes.push({id: elem.id, label: elem.id, x: elem.x, y: elem.y});
  });

  return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
  for (var n = 0; n < data.length; n++) {
    if (data[n].id == id) {  // double equals since id can be numeric or string
      return data[n];
    }
  };

  throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
  var networkEdges = [];

  data.forEach(function(node) {
    // add the connection
    node.connections.forEach(function(connId, cIndex, conns) {
      networkEdges.push({from: node.id, to: connId});
      let cNode = getNodeById(data, connId);

      var elementConnections = cNode.connections;

      // remove the connection from the other node to prevent duplicate connections
      var duplicateIndex = elementConnections.findIndex(function(connection) {
        return connection == node.id; // double equals since id can be numeric or string
      });


      if (duplicateIndex != -1) {
        elementConnections.splice(duplicateIndex, 1);
      };
    });
  });

  return new vis.DataSet(networkEdges);
}

function objectToArray(obj) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key;
    return obj[key];
  });
}

function resizeExportArea() {
  exportArea.style.height = (1 + exportArea.scrollHeight) + "px";
}

//------------------------CLOCK--------------

var centiseconds = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;

function start () {
  control = setInterval(timer, 10);
  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
  document.getElementById("reset").disabled = false;
}
function stop () {
  clearInterval(control);
  document.getElementById("stop").disabled = true;
  document.getElementById("start").disabled = false;
}
function reset () {
  clearInterval(control);
  centiseconds = 0;
  seconds = 0;
  minutes = 0;
  hours = 0;
  Centiseconds.innerHTML = ":00";
  Seconds.innerHTML = ":00";
  Minutes.innerHTML = ":00";
  Hours.innerHTML = "00";
  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
  document.getElementById("reset").disabled = true;
  network.destroy();
  graph.splice(0, graph.length);
}

function timer () {
  if (centiseconds < 99) {
    centiseconds++;
    if (centiseconds < 10) { centiseconds = "0" + centiseconds }
    Centiseconds.innerHTML = ":" + centiseconds;
  }
  if (centiseconds == 99) {
    centiseconds = -1;
  }
  if (centiseconds == 0) {
    seconds ++;
    if(seconds % 3 == 0 ){
      generate();
    }
    if (seconds < 10) { seconds = "0" + seconds }
    Seconds.innerHTML = ":" + seconds;
  }
  if (seconds == 59) {
    seconds = -1;
  }
  if ((centiseconds == 0) && (seconds == 0)) {
    minutes++;

    if (minutes < 10) { minutes = "0" + minutes }
    Minutes.innerHTML = ":" + minutes;
  }
  if (minutes == 59) {
    minutes = -1;
  }
  if ((centiseconds == 0) && (seconds == 0) && (minutes == 0)) {
    hours ++;
    if (hours < 10) { hours = "0" + hours }
    Hours.innerHTML = hours;
  }
}

init();