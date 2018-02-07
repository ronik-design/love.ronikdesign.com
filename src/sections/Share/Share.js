/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const Button = require('../../components/Button/Button');
const TextInput = require('../../components/TextInput/TextInput');
const randomInt = require('../../util/randomInt');
const messages = require('../../constants/messages');

class Share extends BaseComponent {
  constructor (props) {
    super(props);
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
      }),
      this.closeButton.animateIn(),
      this.copyButton.animateIn(),
      this.rollButton.animateIn()
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 1, {
        ...opt,
        autoAlpha: 0
      })
    ]);
  }

  render () {
    const classes = classnames({
      'Share': true
    });

    const buttonPosition = {
      position: 'absolute',
      top: '4rem',
      right: '4rem'
    };

    let messageText = messages[this.props.message];

    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        <div style={buttonPosition}>
          <Button onClick={() => this.props.updateContent('Landing')}
                  ref={ c => { this.closeButton = c; } }
                  icon='close'
                  expandable={false}
          >
          </Button>
        </div>
        <div className='Share__content'>
          <div className='Share__inner'>
            <p className='Share__message'>{messages[this.props.message].join(' ')}</p>
            <Button ref={ c => { this.rollButton = c; }}
                    expandable={false}
                    onClick={() => this.props.updateMessage(randomInt(0, messages.length, this.props.message))}
            >
              Anotha one
            </Button>
            <Button ref={ c => { this.copyButton = c; }}
                    expandable={false}
                    onClick={() => this.props.copyToClipboard()}
            >
              Copy share link
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Share;