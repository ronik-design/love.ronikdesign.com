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

  handleInputSelect () {
    const input = this.shareLink;
    input.setSelectionRange(0, input.value.length)
  }

  handleShareClick () {
    this.props.copyToClipboard();
  }

  render () {
    const classes = classnames({
      'Share': true
    });

    const buttonPosition = {
      position: 'absolute',
      top: '2rem',
      right: '2rem'
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
            <h1 className='Share__heading'>Spread the love</h1>
            <p className='Share__message'>Send this link to your favorite person.</p>
            <div className='Share__flex'>
              <input className='Share__location'
                     readonly
                     spellcheck={false}
                     value={window.location}
                     onClick={() => this.handleInputSelect()}
                     ref={c => { this.shareLink = c; } }
              />
              <Button ref={ c => { this.copyButton = c; }}
                      expandable={false}
                      onClick={() => this.handleShareClick()}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Share;