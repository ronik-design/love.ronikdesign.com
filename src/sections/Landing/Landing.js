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
    this.logo.animateIn({ delay: 4 });
    this.shuffleButton.animateIn({ delay: 4.2 });
    this.shareButton.animateIn({ delay: 4.4 });
  }

  animateOut () {
    // return Promise.all([
    //   this.shareButton.animateOut(),
    //   this.shuffleButton.animateOut()
    // ]);
  }

  handleShuffle () {
    this.props.updateMessage();
    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'randomize'
    });
  }

  handleShare () {
    this.props.updateContent('Share');
    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'spread the love'
    });
  }

  render () {
    const classes = classnames({
      'Landing': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <Controls>
          <div className="ControlsGroup">
            <Logo ref={c => {this.logo = c; }}/>
          </div>
          <div className="ControlsGroup">
            <Button
              onClick={() => this.handleShuffle()}
              ref={c => { this.shuffleButton = c;}}
              icon='random'
            />
            <Button
              onClick={() => this.handleShare()}
              ref={ c => { this.shareButton = c; } }
              icon='share'
              expanded
            >
              Spread the love
            </Button>
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
