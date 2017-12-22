const AFRAME = require('aframe');

AFRAME.registerComponent('update-text', {
  schema: {
    input: {}
  },
  init() {
    this.addEventListeners = this.addEventListeners.bind(this);
    this.addEventListeners();
  },
  update() {
    const inputEl = document.querySelector(this.data.input);
    this.el.setAttribute('text-geometry', `value: ${inputEl.value}`);
  },
  addEventListeners() {
    const inputEl = document.querySelector(this.data.input);
    inputEl.addEventListener('input', () => this.update());
  }
});
