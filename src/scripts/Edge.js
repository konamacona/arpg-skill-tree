const DEFAULT_LENGTH = 10;

export default class Edge {
  /**
   *
   * @param {Node} node1
   * @param {Node} node2
   * @param {int} length OPTIONAL - edge length will be determined relative to others using this number, defaults to 10
   */
  constructor(node1, node2, length) {
    if (length === undefined) length = DEFAULT_LENGTH;
    this.node1 = node1;
    this.node2 = node2;
    this.length = length;
  }
}
