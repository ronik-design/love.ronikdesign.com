/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const Button = require('../../components/Button/Button');
const messages = require('../../constants/messages');

class Share extends BaseComponent {
  constructor (props) {
    super(props);
  }

  animateIn (opt = {}) {
    return Promise.all([
      animate.fromTo(this.container, 0.4, {
        autoAlpha: 0
      }, {
        ...opt,
        autoAlpha: 1
      }),
      animate.fromTo(this.container, 0.8, {
        y: 20,
        scale: 0.5
      }, {
        ...opt,
        ease: Expo.easeOut,
        y: 0,
        scale: 1
      }),
      this.closeButton.animateIn(),
      this.copyButton.animateIn()
    ]);
  }

  animateOut (opt = {}) {
    return Promise.all([
      animate.to(this.container, 0.3, {
        ...opt,
        autoAlpha: 0,
        scale: 0.5
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
            <p className='Share__message'>Spread the love.</p>
            <img className='Share__image' src='/assets/images/og-image.png' />
            <input className='Share__location' value={window.location}/>
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