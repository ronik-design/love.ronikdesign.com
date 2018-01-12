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
  }

  animateIn () {
    return Promise.all([
      this.colorButton.animateIn({ delay: 0.3 }),
      this.objectsButton.animateIn({ delay: 0.5 }),
      this.textButton.animateIn({ delay: 0.7 }),
      this.shareButton.animateIn({ delay: 0.9 }),
    ]);
  }

  animateOut () {
    return Promise.all([
      this.colorButton.animateOut({ delay: 0.3 }),
      this.objectsButton.animateOut({ delay: 0.5 }),
      this.textButton.animateOut({ delay: 0.7 }),
      this.shareButton.animateOut({ delay: 0.9 }),
    ]);
  }

  handleChangeScene(scene) {
    this.props.updateContent(scene);
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
              ref={ c => { this.colorButton = c; } }
              icon='color'
            >
              Swap colors
            </Button>
            <Button
              onClick={this.props.onMaterialSwap}
              ref={ c => { this.objectsButton = c; } }
              icon='objects'
            >
              Swap scene
            </Button>
            <Button
              onClick={() => this.handleChangeScene('EditText')}
              ref={ c => { this.textButton = c; } }
              icon='text'
            >
              Edit Text
            </Button>
          </div>
          <div className="ControlsGroup">
            <Button
                ref={ c => { this.shareButton = c; } }
                icon='share'
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
