/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const Button = require('../../components/Button/Button');
const Controls = require('../../components/Controls/Controls');
const Icon = require('../../components/Icon/Icon');
const Logo = require('../../components/Logo/Logo');
const ReactGA = require('react-ga');

class Landing extends BaseComponent {
  constructor (props) {
    super(props);
  }

  animateIn () {
    // this.logo.animateIn({ delay: 4 });
    // this.muteButton.animateIn({ delay: 4.2 });
    this.shuffleButton.animateIn({ delay: 4.3 });
    // this.shareButton.animateIn({ delay: 4.4 });
  }

  animateOut () {
    return Promise.all([
      // this.shareButton.animateOut(),
      this.shuffleButton.animateOut()
    ]);
  }

  handleShuffle () {
    this.props.updateMessage();
    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'randomize'
    });
  }

  render () {
    const classes = classnames({
      'Landing': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        {/* <Logo ref={c => {this.logo = c; }}/> */}
        <Controls>
          {/* <div className="ControlsGroup">
            <Button
              onClick={() => this.props.toggleMusic()}
              ref={ c => { this.muteButton = c; } }
              icon='sound'
              extraClasses={{muted: this.props.isMuted}}
            />
          </div> */}
          <div className="ControlsGroup">
            <Button
              onClick={() => this.handleShuffle()}
              ref={c => { this.shuffleButton = c;}}
              icon='random'
              extraClasses={{primary: true}}
            />
          </div>
          <div className="ControlsGroup">
            <Button
              onClick={() => this.handleShuffle()}
              ref={c => { this.shuffleButton = c;}}
              icon='random'
              extraClasses={{primary: true}}
            />
          </div>
        </Controls>
      </div>
    );
  }
}

Landing.defaultProps = {
  onMaterialSwap: () => {}
};

module.exports = Landing;
