import Edge from "./Edge";

export default class TreeBuilder {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  addEdge(node1, node2) {
    this.edges.push(new Edge(node1, node2, length));
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addConnectedNode(node) {
    const tail = this.nodes[this.nodes.length - 1];
    this.addNode(node);
    this.addEdge(tail, node);
  }

  build() {
    return;
  }
}
