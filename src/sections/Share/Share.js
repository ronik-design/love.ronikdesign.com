/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const Button = require('../../components/Button/Button');
const ReactGA = require('react-ga');
const popup = require('window-popup').windowPopup;
const Mousetrap = require('mousetrap');

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
      this.copyButton.animateIn(),
      this.shareTwitter.animateIn(),
      this.shareFacebook.animateIn()
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
    input.setSelectionRange(0, input.value.length);
    input.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.props.updateContent('Landing');
      }
    })
  }

  handleCopyClick () {
    this.props.copyToClipboard();
    this.copyButton.base.classList.add('confirmation');
    setTimeout(() => this.copyButton.base.classList.remove('confirmation'), 1000);
    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'copy'
    });
  }

  handleShareTwitter () {
    const message = '';
    const href = `https://twitter.com/intent/tweet/?text=${message}&url=${window.location.href}&via=ronikdesign`;
    popup(500, 300, href);

    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'twitter'
    });
  }

  handleShareFacebook () {
    const href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    popup(600, 500, href);

    ReactGA.event({
      category: 'button',
      action: 'click',
      label: 'facebook'
    });
  }

  componentDidMount() {
    Mousetrap.bind('esc', () => this.props.updateContent('Landing'));
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
            <Button expandable={false}
                    ref={c => { this.shareTwitter = c }}
                    onClick={() => this.handleShareTwitter()}
            >
              Share on Twitter
            </Button>
            <Button expandable={false}
                    ref={c => { this.shareFacebook = c }}
                    onClick={() => this.handleShareFacebook()}
            >
              Share on Facebook
            </Button>
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
                      onClick={() => this.handleCopyClick()}
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