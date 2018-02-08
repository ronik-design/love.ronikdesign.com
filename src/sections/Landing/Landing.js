/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

const Button = require('../../components/Button/Button');
const Controls = require('../../components/Controls/Controls');
const Icon = require('../../components/Icon/Icon');
const Header = require('../../components/Header/Header');
const randomInt = require('../../util/randomInt');
const messages = require('../../constants/messages');

class Landing extends BaseComponent {
  constructor (props) {
    super(props);
  }

  animateIn () {
    return Promise.all([
      this.shareButton.animateIn({ delay: 3.7 }),
      this.shuffleButton.animateIn({ delay: 3.5 })
    ]);
  }

  animateOut () {
    // return Promise.all([
    //   this.shareButton.animateOut(),
    //   this.shuffleButton.animateOut()
    // ]);
  }

  render () {
    const classes = classnames({
      'Landing': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <Controls>
          <div className="ControlsGroup">
            <a className="Logo" href="http://ronikdesign.com" target="_blank">
              <Icon name='logo'/>
            </a>
          </div>
          <div className="ControlsGroup">
            <Button
              onClick={() => this.props.updateMessage(randomInt(0, messages.length, this.props.message))}
              ref={c => { this.shuffleButton = c;}}
              icon='random'
            />
            <Button
              onClick={() => this.props.updateContent('Share')}
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
