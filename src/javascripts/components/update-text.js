const AFRAME = require('aframe');

AFRAME.registerComponent('update-text', {
  schema: {
    input: {}
  },
  init() {
    this.updateText = this.updateText.bind(this);
    this.addEventListeners();
  },
  update() {
    const inputEl = document.querySelector(this.data.input);
    this.el.setAttribute('text-geometry', `value: ${inputEl.value}`);
    console.log(inputEl);
    console.log(this.el.getAttribute('text-geometry'));
  },
  updateText(value) {
    this.el.setAttribute('text-geometry', `value: ${value}`);
  },
  addEventListeners() {
    const inputEl = document.querySelector(this.data.input);
    inputEl.addEventListener('input', function (e) {
      this.updateText(e.value);
    });
  }
});
