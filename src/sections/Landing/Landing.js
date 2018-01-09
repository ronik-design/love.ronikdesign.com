/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

const Button = require('../../components/Button/Button');
const Controls = require('../../components/Controls/Controls');
const Header = require('../../components/Header/Header');

class Landing extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn () {
    return Promise.all([
      //
      this.button.animateIn({ delay: 0.5 }),
      this.buttonb.animateIn({ delay: 0.7 }),
    ]);
  }

  animateOut () {
    return Promise.all([
      //
    ]);
  }

  render () {
    const classes = classnames({
      'Landing': true
    });
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <Controls>
          <div className="ControlsGroup">
            <Button
              onClick={this.props.onMaterialSwap}
              ref={ c => { this.button = c; } }>
              Click to swap material
            </Button>
          </div>
          <div className="ControlsGroup">
            <Button
                ref={ c => { this.buttonb = c; } }
                icon='test'
            >
              Share
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
