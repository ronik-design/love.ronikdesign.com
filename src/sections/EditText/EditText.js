/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');

const Button = require('../../components/Button/Button');
const TextInput = require('../../components/TextInput/TextInput');

class EditText extends BaseComponent {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 1, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      }),
      animate.fromTo(this.container, 2, {
        y: 20
      }, {
        ...opt,
        ease: Expo.easeOut,
        y: 0
      })
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 1, {
        ...opt,
        autoAlpha: 0
      }),
      animate.to(this.container, 2, {
        ...opt,
        ease: Expo.easeOut,
        y: 10
      })
    ]);
  }

  handleCancel = () => {
    this.props.updateContent('Landing');
  }

  render () {
    const classes = classnames({
      'EditText': true
    });

    const buttonPosition = {
      position: 'absolute',
      top: '4rem',
      right: '4rem'
    };

    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <div style={buttonPosition}>
          <Button onClick={this.handleCancel} ref={ c => { this.closeButton = c; } }>Close</Button>
        </div>
        <TextInput onTextUpdate={this.props.onTextUpdate}
                   ref={ input => { this.textInput = input } }
                   handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

module.exports = EditText;