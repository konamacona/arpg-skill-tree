import "../styles/index.scss";

import cytoscape from "cytoscape";
import cola from "cytoscape-cola";

cytoscape.use(cola);

var data = generateData();
createCy(data);

// { // edge ab
//   data: { id: 'ab', source: 'a', target: 'b' }
// }

function addEdge(data, from, to) {
  let edge = {
    data: {
      id: `${from.data.id}-${to.data.id}`,
      source: from.data.id,
      target: to.data.id
    }
  };
  data.push(edge);
}

function addConnectedNode(data, last, id) {
  let node = { data: { id: id, walk: last.data.walk + 1 } };
  data.push(node);
  addEdge(data, last, node);
  return node;
}

function chain(data, prefix, startNum, length, startNode) {
  let last = startNode;
  for (let i = startNum; i < startNum + length; i++) {
    const currentId = `${prefix}${i}`;
    last = addConnectedNode(data, last, currentId);
  }
  return last;
}

function clump(data, prefix, startNum, length, breakOffNode) {
  let start = addConnectedNode(data, breakOffNode, prefix + startNum);
  let end = chain(data, prefix, startNum + 1, length - 1, start);
  addEdge(data, start, end);
  return breakOffNode;
}

function generateData() {
  const data = [];

  const branches = {
    r: {
      position: { x: 50, y: 0 }
    },
    g: {
      position: { x: -50, y: 0 }
    },
    b: {
      position: { x: 0, y: 75 }
    }
  };

  Object.keys(branches).forEach(branchKey => {
    const branch = branches[branchKey];

    // Add central skill
    let last = {
      data: { id: branchKey, start: true, walk: 0 },
      position: branch.position,
      locked: true
    };
    data.push(last);

    last = chain(data, branchKey, 0, 1, last);

    clump(data, branchKey + "C0_", 0, 5, last);
    clump(data, branchKey + "C1_", 0, 3, last);

    // chain left/right
    branch.left = chain(data, branchKey + "L", 0, 2, last);
    clump(data, branchKey + "C1_", 0, 3, branch.left);
    branch.left = chain(data, branchKey + "L2", 3, 2, branch.left);
    branch.right = chain(data, branchKey + "R", 0, 5, last);
  });

  // Connect the branches
  addEdge(data, branches["r"].left, branches["g"].right);
  addEdge(data, branches["g"].left, branches["b"].right);
  addEdge(data, branches["b"].left, branches["r"].right);

  // Generate groups of 3-6 connected nodes for each color
  return data;
}

function createCy(data) {
  cytoscape({
    container: document.getElementById("cy"),

    boxSelectionEnabled: false,
    autounselectify: true,

    layout: {
      name: "cose",
      nodeRepulsion: function(node) {
        return 2048 * 8;
      }
    },

    style: [
      {
        selector: "node",
        style: {
          height: 30,
          width: 30,
          "background-color": "#30c9bc",
          label: "data(id)"
        }
      },

      {
        selector: "edge",
        style: {
          "curve-style": "haystack",
          "haystack-radius": 0,
          width: 5,
          opacity: 0.5,
          "line-color": "#a8eae5"
        }
      }
    ],

    elements: data
  });
}

console.log("webpack starterkit");
