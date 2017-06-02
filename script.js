var nodes = null;
    var edges = null;
    var graph = null;

    function draw(nodeCount) {

      document.getElementById('nodeCount').addEventListener('change',updateRange,false);

      nodes = [];
      edges = [];

      // generador
      var data = generateGraph(nodeCount);

      // create a network
      var container = document.getElementById('mynetwork');

      var options = {
        "edges": {
          "smooth": {
            "type": "curvedCCW",
            "forceDirection": "none"
          }
        },
        "physics": {
          "barnesHut": {
            "springLength": 500
          },
          "minVelocity": 0.75
        }
      };
      graph = new vis.Network(container, data, options);
    }

    function generateGraph(nodeCount) {
      var nodes = [];
      var edges = [];
      
      // randomly create some nodes
      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          id: i,
          label: String(i)
        });
      }

      // randomly create some edges
      for (var i = 0; i < nodeCount; i++) {
        for (var j = 0; j < nodeCount; j++) {
          if (i != j) {
            if (getZeroOne() == 1) {
              edges.push({
                from: i,
                to: j
              });
            }
          }
        }
      }

      return {nodes:nodes, edges:edges};
    }

    function getZeroOne() {
      return Math.floor(Math.random() * 2);
    }

    function updateRange() {
      document.getElementById('val').innerHTML=document.getElementById('nodeCount').value;
    }