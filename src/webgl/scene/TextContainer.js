const Text = require('./Text');
const splitSentence = require('../../util/splitSentence');
const swearjar = require('swearjar');
const queryString = require('query-string');

module.exports = class TextContainer extends THREE.Object3D {
  constructor (text) {
    super();

    this.text = splitSentence(text);

    const textFromQuery = queryString.parse(location.search).text;
    if (textFromQuery) {
      const queryIsProfane = swearjar.profane(textFromQuery);
      queryIsProfane ? this.text = ['nice try'] : this.text = splitSentence(textFromQuery);
    }

    this.refreshText(this.text);

    const boxHelper = new THREE.BoxHelper( this );
    this.add( boxHelper );

    // this.box = new THREE.Box3().setFromObject(this.group);
    // console.log(this.box);

    // setTimeout(() => {
    //   const box = new THREE.BoxHelper().setFromObject(this);
    //   box.geometry.computeBoundingBox();
    //   console.log(box.geometry.boundingBox);
    //   console.log(this.position.y);
    //   this.position.y = 0.5 * (box.geometry.boundingBox.max.y - box.geometry.boundingBox.min.y);
    // }, 100);
  }

  addTextLine(text, fontIndex) {
    let textMesh = new Text(text, fontIndex);
    this.add(textMesh);
  }

  refreshText(newText) {
    const children = this.children;

    // clear previous text
    if (children.length) {
      for (let q = children.length; q >= 0; q--) {
        this.remove(children[q]);
      }
    }

    // add + reposition each text line
    if (Array.isArray(newText)) {
      for (let j = 0; j < newText.length; j++) {
        this.addTextLine(newText[j], 0);
      }

      const lineHeight = 1.3;

      for (let i = 0; i < children.length; i++) {
        children[i].position.y += -(i * lineHeight);
      }
    }
  }

  onAppDidUpdate (oldProps, oldState, newProps, newState) {
    if (oldState.text === newState.text) {
      return;
    }

    this.refreshText(splitSentence(newState.text));
  }
};
