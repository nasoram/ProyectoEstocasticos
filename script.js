 var network;
            var container;
            var exportArea;
            var importButton;
            var exportButton;
            document.getElementById('nodeCount').addEventListener('change',updateRange,false);
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
        
        function generate() {
              for (var n = 0; n < document.getElementById('nodeCount').value; n++) {
                addNodo();
                  }
                   var data = {
                    nodes: getNodeData(grafo),
                    edges: getEdgeData(grafo)
                }
                network = new vis.Network(container, data, options);

                resizeExportArea();
            }

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
            //------------------------RELOJ--------------
            var centesimas = 0;
            var segundos = 0;
            var minutos = 0;
            var horas = 0;
            function inicio () {
              control = setInterval(cronometro,10);
              document.getElementById("inicio").disabled = true;
              document.getElementById("parar").disabled = false;
              document.getElementById("reinicio").disabled = false;
            }
            function parar () {
              clearInterval(control);
              document.getElementById("parar").disabled = true;
              document.getElementById("inicio").disabled = false;
            }
            function reinicio () {
              clearInterval(control);
              centesimas = 0;
              segundos = 0;
              minutos = 0;
              horas = 0;
              Centesimas.innerHTML = ":00";
              Segundos.innerHTML = ":00";
              Minutos.innerHTML = ":00";
              Horas.innerHTML = "00";
              document.getElementById("inicio").disabled = false;
              document.getElementById("parar").disabled = true;
              document.getElementById("reinicio").disabled = true;
              network.destroy();
              grafo.splice(0,grafo.length);
            }
            function cronometro () {
              if (centesimas < 99) {
                centesimas++;
                if (centesimas < 10) { centesimas = "0"+centesimas }
                Centesimas.innerHTML = ":"+centesimas;
              }
              if (centesimas == 99) {
                centesimas = -1;
              }
              if (centesimas == 0) {
                segundos ++;
                if(segundos%3==0 ){
                  generate();
                }
                if (segundos < 10) { segundos = "0"+segundos }
                Segundos.innerHTML = ":"+segundos;
              }
              if (segundos == 59) {
                segundos = -1;
              }
              if ( (centesimas == 0)&&(segundos == 0) ) {
                minutos++;

                if (minutos < 10) { minutos = "0"+minutos }
                Minutos.innerHTML = ":"+minutos;
              }
              if (minutos == 59) {
                minutos = -1;
              }
              if ( (centesimas == 0)&&(segundos == 0)&&(minutos == 0) ) {
                horas ++;
                if (horas < 10) { horas = "0"+horas }
                Horas.innerHTML = horas;
              }
            }
            init();