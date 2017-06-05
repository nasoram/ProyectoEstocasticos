      var nodes = null;
      var edges = null;
      var canvas = null;
      var tree = { nodes: [{ label: 'nod0 0', id: 0 }], edges: [] };
      var v = 0;
      var graph = { nodes: [], edges: [] }; 
      var edge_lut = {}, degrees = [], tmpEdges = [];
      var container = document.getElementById('mynetwork');
      var data;
      var iteration = document.getElementById('user-seconds').value;
      var options = {
        "edges": {
          "smooth": {
            // "type": "curvedCCW",
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
    function models(tipo) {

      if (tipo == "arbol") {
         data = BalancedTree(document.getElementById('nodeCount').value, document.getElementById('alturaArbol').value);
      }
      else if (tipo == "barabasi") {

         data = BarabasiAlbert(document.getElementById('nodeCount').value, document.getElementById('m0').value, document.getElementById('M').value); 
      }
      else if (tipo == "erdosRenyiP") {

         data = erdosRenyiP(document.getElementById('nodeCount').value, document.getElementById('ERP').value); 
      }
      else if (tipo == "erdosRenyiM") {

         data = erdosRenyiM(document.getElementById('nodeCount').value, document.getElementById('ERE').value); 
      }
      else if (tipo == "wattsStrogatzA") {

         data = wattsStrogatzA(document.getElementById('nodeCount').value, document.getElementById('wattsStrogatzAlphaK').value, document.getElementById('wattsStrogatzAlpha').value); 
      }
      else if (tipo == "wattsStrogatzB") {

         data = wattsStrogatzB(document.getElementById('nodeCount').value, document.getElementById('wattsStrogatzBetaK').value, document.getElementById('wattsStrogatzBeta').value); 
      }

      // create a network
     
    }
      function iterationMode(tipo) {

      if (tipo == "user") {
        iteration=document.getElementById('user-seconds').value;
      }
      else if (tipo == "random") {
       iteration=Math.floor(Math.random() * 10) + 1; 
       document.getElementById('random-seconds').innerHTML=iteration;
      }

      // create a network
     
    }

    function  generate() {
      iterationMode(document.getElementById('iteration').value);

      models(document.getElementById('grafo').value);      
      canvas = new vis.Network(container, data, options);

    }

    function updateRange() {
      
    }

    /**
         * Árbol Balanceado
         *
         * @param {Number} r número de hijos que tendrá cada nodo
         * @param {Number} h altura del árbol
         */
    function BalancedTree (r, h) {
        var       
            newLeaves = [],
            i, j, height, node, leaves;

        for (i = 0; i < r; i++) {
            v += 1;
            node = { id: (v),
                    label: 'nodo '+ v
                  };
            tree.nodes.push(node);
            newLeaves.push(node);
            tree.edges.push({ from: 0, to: v });
        }

        for (height = 1; height < h; height++) {
            leaves = newLeaves;
            newLeaves = [];
            for (j = 0; j < leaves.length; j++) {
                for (i = 0; i < r; i++) {
                    v += 1;
                    node = { id: (v),
                            label: 'nodo '+ v
                          };
                    newLeaves.push(node);
                    tree.nodes.push(node);
                    tree.edges.push({ from: leaves[j].id, to: v });
                }
            }
        }
        return {nodes:tree.nodes, edges:tree.edges};
    }


    /**
     * Barabási–Albert
     *
     * @param {Number} N número total de nodos N > 0
     * @param {Number} m0 m0 > 0 && m0 <  N
     * @param {Number} M M  > 0 && M  <= m0
     */
    function BarabasiAlbert (N, m0, M) {
          var  i, j, edge, sum, s, m, r, p;
           var num = parseInt(graph.nodes.length)+parseInt(m0);
            var num2 = parseInt(graph.nodes.length)+parseInt(N);
        // creando m0 nodos
        for (i = graph.nodes.length; i < num; i++) {
            graph.nodes.push({ 
                    id: i,
                    label: 'nodo '+ i });
            degrees[i] = 0;
        }

        // Enlazando cada nodo con los demás
        for (i = 0; i < num; i++) {
            for (j = i+1; j < num; j++) {
                edge = { from: i, to: j };
                edge_lut[edge.from+'-'+edge.to] = edge;
                graph.edges.push(edge);
                degrees[i]++;
                degrees[j]++;
            }
        }

        // Agregando N - m0 nodos, cada uno con M aristas
        for (i = num; i < num2; i++) {
            graph.nodes.push({ 
                    id: i,
                    label: 'nodo '+ i });
            degrees[i] = 0;
            sum = 0;  // suma de los grados de todos los nodos
            for (j = 0; j < i; j++) sum += degrees[j];
            s = 0;
            for (m = 0; m < M; m++) {
                r = Math.random();
                p = 0;
                for (j = 0; j < i; j++) {
                    if (edge_lut[i+'-'+j] || edge_lut[j+'-'+i]) continue;
                    if (i == 1) p = 1;
                    else p += degrees[j] / sum + s / (i - m);

                    if (r <= p) {
                        s += degrees[j] / sum;
                        edge = { from: i, to: j };
                        edge_lut[edge.from+'-'+edge.to] = edge;
                        graph.edges.push(edge);
                        degrees[i]++;
                        degrees[j]++;
                        break;
                    }
                }
            }
        }
        return {nodes:graph.nodes, edges:graph.edges};
    }


    /**
     * Erdős–Rényi P
     *
     * @param {Number} n número de nodos
     * @param {Number} p probabilidad de una arista entre dos nodos
     */
    function erdosRenyiP (n, p) {
           var i,j;
           var num = parseInt(graph.nodes.length)+parseInt(n);
        for ( i = graph.nodes.length; i < num; i++) {
            graph.nodes.push({
                    id: i,
                    label: 'node ' + i 
                  });
            for ( j = 0; j < i; j++) {
                if (Math.random() < p) {
                    graph.edges.push({
                        from: i,
                        to: j
                    });
                }
            }
        }
        return {nodes:graph.nodes, edges:graph.edges};
    }

    /**
     * Erdős–Rényi
     *
     * @param {Number} n número de nodos
     * @param {Number} M número de aristas
     */
    function erdosRenyiM (n, M) {
        var i, j, k;
            var num = parseInt(graph.nodes.length)+parseInt(n);
        for (i = graph.nodes.length; i < num; i++) {
            graph.nodes.push({ 
                    id: i,
                    label: 'node '+ i });
            for (j = i+1; j < n; j++) {
                tmpEdges.push({ from: i,
                                to: j 
                });
            }
        }

        // Se seleccionan m aristas de forma aleatoria de tmpEdges
        k = tmpEdges.length - 1;
        for (i = 0; i < M; i++) {
            graph.edges.push(tmpEdges.splice(Math.floor(Math.random()*k), 1)[0]);
            k--;
        }
        return {nodes:graph.nodes, edges:graph.edges};
    }


    /**
     * Watts-Strogatz Alpha
     *
     * @param {Number} n number of nodes
     * @param {Number} K media del grado de los nodos (entero)
     * @param {Number} alpha probabilidad de enlazamiento [0..1]
     */
    function wattsStrogatzA (n, k, alpha) {
        var num = parseInt(graph.nodes.length)+parseInt(n);
        var i, j, edge,
            p = Math.pow(10, -10),
            ec = 0,
            edge_lut = {},
            ids = [],
            nk_half = num * k / 2,
            Rij, sumRij, r, pij;
        
        for (i = graph.nodes.length; i < num; i++) {
            graph.nodes.push({ 
              id: i,
              label: 'node '+i });

            edge = { from: i, to: (i+1)%n };
            edge_lut[edge.from+'-'+edge.to] = edge;
            graph.edges.push(edge);
            ec++;
        }

        // Creando n * k / 2 aristas
        while (ec < nk_half) {
            for (i = 0; i < n; i++) {
                ids.push(i);
            }
            while (ec < nk_half && ids.length > 0) {
                i = ids.splice(Math.floor(Math.random()*ids.length), 1)[0];
                Rij = [];
                sumRij = 0;
                for (j = 0; j < n; j++) {
                    Rij[j] = calculateRij(i, j);
                    sumRij += Rij[j];
                }
                r = Math.random();
                pij = 0;
                for (j = 0; j < n; j++) {
                    if (i != j) {
                        pij += Rij[j] / sumRij;
                        if (r <= pij) {
                            edge = { from: i, to: j };
                            graph.edges.push(edge);
                            ec++;
                            edge_lut[edge.from+'-'+edge.to] = edge;
                        }
                    }
                }
            }
        }

      return {nodes:graph.nodes, edges:graph.edges};

      function calculateRij(i, j) {
          if (i == j || edge_lut[i+'-'+j]) return 0;
          var mij = calculatemij(i, j);
          if (mij >= k) return 1;
          if (mij === 0) return p;
          return Math.pow(mij / k, alpha) * (1 - p) + p;
      }

      function calculatemij(i, j) {
          var mij = 0, l;
          for (l = 0; l < n; l++) {
              if (l != i && l != j && edge_lut[i+'-'+l] && edge_lut[j+'-'+l]) {
                  mij++;
              }
          }
          return mij;
      }
    }
    

    /**
     * Watts-Strogatz Small World model Beta
     *
     * @param {Number} n número de nodos
     * @param {Number} K media del grado de los nodos (entero)
     * @param {Number} beta probabilidad de enlazamiento [0..1]
     */
    function wattsStrogatzB (n, K, beta) {
        var num = parseInt(graph.nodes.length)+parseInt(n);
        var i, j, t, edge,
            edge_lut = {};
        K = K>>1;
        for (i = graph.nodes.length; i < num; i++) {
            graph.nodes.push({ 
              id: i,
              label: 'node '+i });

            for (j = 1; j <= K; j++) {
                edge = { from: i, to: (i+j)%n };
                edge_lut[edge.from+'-'+edge.to] = edge;
                graph.edges.push(edge);
            }
        }

        // enlazamiento de aristas
        for (i = graph.nodes.length; i < num; i++) {
            for (j = 1; j <= K; j++) { 
                if (Math.random() <= beta) {
                    do {
                        t = Math.floor(Math.random() * (n-1));
                    } while (t == i || edge_lut[i+'-'+t]);
                    var j_ = (i+j)%num;
                    edge_lut[i+'-'+j_].to = t; // rewire
                    edge_lut[i+'-'+t] = edge_lut[i+'-'+j_];
                    delete edge_lut[i+'-'+j_];
                }
            }
        }
        return {nodes:graph.nodes, edges:graph.edges};
    }



      $(document).ready(function () {
      $('.params').hide();
      $('#arbol').show();
      $('#grafo').change(function () {
        $('.params').hide();
        $('#'+$(this).val()).show();
      })
    });
        $(document).ready(function () {
      $('.params2').hide();
      $('#user').show();
      $('#iteration').change(function () {
        $('.params2').hide();
        $('#'+$(this).val()).show();
      })
    });
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
  canvas.destroy();
  tree = { nodes: [{ label: 'nod0 0', id: 0 }], edges: [] };
  graph = { nodes: [], edges: [] };
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
    if(seconds % iteration == 0 ){
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

