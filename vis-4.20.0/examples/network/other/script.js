
            var network;
            var container;
            var exportArea;
            var importButton;
            var exportButton;
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
     var grafo = [
            {
              "x": 0,
              "y": 0,
              "id": "0",
              "connections": [ ]
            }
          ];

            function addNodo() {
                var size=grafo.length;
                 grafo.push(  { "x": randomCoord(),
                                  "y": randomCoord(),
                                  "id": size ,
                                  "connections": dynamcalEdges(size),
                                }
                                );
                    }

              function randomCoord(){
                  var num = Math.floor(Math.random()*2000); // this will get a number between 1 and 99;
                  num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
                  return num;
              }
              function dynamcalEdges(size){
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
            function init() {
                container = document.getElementById('network');
                exportArea = document.getElementById('input_output');
                importButton = document.getElementById('import_button');
                exportButton = document.getElementById('export_button');

                draw();
            }

            function addConnections(elem, index) {
                // need to replace this with a tree of the network, then get child direct children of the element
                elem.connections = network.getConnectedNodes(index);
            }

            function destroyNetwork() {
                network.destroy();
                grafo.splice(0,grafo.length);
            }

          

             function draw() {
      var inputData = grafo;
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

            function importNetwork() {
               addNodo();
                var data = {
                    nodes: getNodeData(grafo),
                    edges: getEdgeData(grafo)
                }

                network = new vis.Network(container, data, options);

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

            init();