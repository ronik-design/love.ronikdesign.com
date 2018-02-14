/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');

class Music extends BaseComponent {
  constructor(props) {
    super(props);
  }

  toggle (state) {
    if (state === false) {
      this.audioEl.play();
    } else {
      this.audioEl.pause();
    }
  }

  componentWillUpdate(props) {
    this.toggle(props.isMuted);
  }

  render () {
    return (
      <audio
        ref={c => { this.audioEl = c; }}
        volume={0.2}
        loop
        preload='auto'
      >
        <source src='assets/sound/off-color-outtro.mp3' type='audio/mpeg'/>
        <source src='assets/sound/off-color-outtro.ogg' type='audio/ogg'/>
      </audio>
    )
  }
}

module.exports = Music;