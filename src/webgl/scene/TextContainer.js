const Text = require('./Text');
const queryString = require('query-string');

module.exports = class TextContainer extends THREE.Object3D {
  constructor (color, text) {
    super();

    this.text = text;
    this.color = color;

    this.refreshText(this.text);
  }

  refreshText(newText) {
    const children = this.children;
    const spacingUnit = 1.2;

    // clear previous text
    if (children.length) {
      for (let q = children.length; q >= 0; q--) {
        this.remove(children[q]);
      }
    }

    // add + reposition each text line
    if (Array.isArray(newText)) {
      for (let j = 0; j < newText.length; j++) {
        this.add(new Text(0, newText[j], [0, 0, 0], (j / 3 + 2.5)));
      }

      switch(newText.length) {
        case 3:
          for (let i = 0; i < children.length; i++) {
            children[0].position.y = spacingUnit;
            children[2].position.y = -spacingUnit;
          }
          break;
        case 2:
          for (let i = 0; i < children.length; i++) {
            children[0].position.y = spacingUnit / 2;
            children[1].position.y = - spacingUnit / 2;
          }
          break;
      }
    }
  }

  onAppDidUpdate (oldProps, oldState, newProps, newState) {
    if (oldState.text === newState.text) {
      return;
    }

    this.refreshText(newState.text);
  }
};