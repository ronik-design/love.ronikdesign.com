/** @jsx h */
const { h, Component } = require('preact');
const BaseComponent = require('../components/BaseComponent/BaseComponent');
const classnames = require('classnames');
const animate = require('@jam3/gsap-promise');
const PreactTransitionGroup = require('preact-transition-group');
const setQuery = require('set-query-string');
const colors = require('../constants/colors');
const messages = require('../constants/messages');
const queryString = require('query-string');
const copy = require('copy-to-clipboard');
const ReactGA = require('react-ga');

// DOM Sections
const Landing = require('../sections/Landing/Landing');
const Preloader = require('../sections/Preloader/Preloader');
const EditText = require('../sections/EditText/EditText');
const Share = require('../sections/Share/Share');
const Music = require('../components/Music/Music');

// WebGL canvas component
const WebGLCanvas = require('../components/WebGLCanvas/WebGLCanvas');

// WebGL scenes
const TextContainer = require('../webgl/scene/TextContainer');
const TriangleFetti = require('../webgl/scene/TriangleFetti');
const Heart = require('../webgl/scene/Heart');

const { assets, webgl } = require('../context');

class App extends BaseComponent {
  constructor (props) {
    super(props);

    this.state = {
      theme: 0,
      message: 0,
      isLoaded: false,
      section: 'Preloader',
      isMuted: false
    };

    this.updateStateFromQuery();
  }

  handlePreventDefault = ev => {
    ev.preventDefault();
  }

  componentDidUpdate (oldProps, oldState) {
    if (this.state.isLoaded && oldState.isLoaded !== this.state.isLoaded) {
      // start animation loop
      webgl.start();

      // draw a frame so that its correct on first DOM render
      webgl.draw();

      // trigger initial animation in of content
      webgl.animateIn({ delay: 0.9 });
    }

    // propagate through entire scene graph any app changes
    webgl.onAppDidUpdate(oldProps, oldState, this.props, this.state);
  }

  componentDidMount () {
    // To avoid page pulling, text highlighting and such
    webgl.canvas.addEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.addEventListener('mousedown', this.handleCanvasMouseDown);
    webgl.canvas.addEventListener('mouseup', this.handleCanvasMouseUp);

    this.loadWebGL();

    ReactGA.initialize('UA-26504381-7');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentWillUnmount () {
    webgl.canvas.removeEventListener('touchstart', this.handlePreventDefault);
    webgl.canvas.removeEventListener('mousedown', this.handleCanvasMouseDown);
    webgl.canvas.removeEventListener('mouseup', this.handleCanvasMouseUp);
  }

  loadWebGL () {
    // Preload any queued assets
    assets.loadQueued(() => {
      // Once loading is complete, swap to Landing section and ensure WebGL displays
      this.setState({ section: 'Landing', isLoaded: true });

      // Add any "WebGL components" here...
      webgl.scene.add(new Heart(this.state.theme, -3, 3.5));
      webgl.scene.add(new TextContainer(this.state.theme, this.state.message));
      webgl.scene.add(new TriangleFetti());
    });
  }

  handleCanvasMouseDown () {
    event.preventDefault();
    webgl.canvas.classList.add('is-grabbing');
  }

  handleCanvasMouseUp () {
    event.preventDefault();
    webgl.canvas.classList.remove('is-grabbing');
  }

  toggleMusic = () => {
    this.setState({isMuted: !this.state.isMuted});
  }

  handleUpdateColors = () => {
    let colorIndex;

    if (this.state.theme === colors.length - 1) {
      colorIndex = 0;
    } else {
      colorIndex = this.state.theme + 1;
    }

    this.setState({theme: colorIndex});
    setQuery({theme: colorIndex});
  }

  handleTextUpdate = text => {
    this.setState({text: text});
    setQuery({text: text});
  }

  handleUpdateMessage = message => {
    let messageIndex;

    if (this.state.message === messages.length - 1) {
      messageIndex = 0;
    } else {
      messageIndex = this.state.message + 1;
    }

    this.setState({message: messageIndex});
    setQuery({m: messageIndex});
  }

  updateContent = section => {
    this.getContent(section);
    this.setState({section: section});
  }

  handleCopyToClipboard () {
    copy(window.location.href);
  }

  updateStateFromQuery () {
    const textFromQuery = queryString.parse(location.search);

    if (textFromQuery.theme && parseInt(textFromQuery.theme) <= colors.length) {
      this.setState({theme: parseInt(textFromQuery.theme)});
    }

    if (textFromQuery.m && parseInt(textFromQuery.m) <= messages.length) {
      this.setState({message: parseInt(textFromQuery.m)});
    } else {
      this.setState({message: 0});
    }

    if (textFromQuery.muted) {
      this.setState({isMuted: true})
    }
  }

  getContent (section) {
    // You are probably better off using a real "Router" for history push etc.
    // NB: Ensure there is a 'key' attribute so transition group can create animations
    switch (section) {
      case 'Preloader': return <Preloader key='Preloader'/>;
      case 'EditText': return <EditText key='EditText' onTextUpdate={this.handleTextUpdate} updateContent={this.updateContent}/>;
      case 'Share': return <Share key='Share'
                                  onTextUpdate={this.handleTextUpdate}
                                  updateContent={this.updateContent}
                                  message={this.state.message}
                                  copyToClipboard={this.handleCopyToClipboard}
      />;

      default:
      case 'Landing': return <Landing key='Landing'
                                      updateContent={this.updateContent}
                                      updateColors={this.handleUpdateColors}
                                      message={this.state.message}
                                      updateMessage={this.handleUpdateMessage}
                                      toggleMusic={this.toggleMusic}
                                      isMuted={this.state.isMuted}
                                      />;
    }
  }

  render () {
    const classes = classnames({
      'App': true
    });

    const section = this.state.section;
    const content = this.getContent(section);

    // Render the WebGL if loaded
    // And also render the current UI section on top, with transitions
    return (
      <div className={classes} ref={ c => { this.container = c; } }>
        { this.state.isLoaded && <WebGLCanvas />}
        <PreactTransitionGroup className='content'>
          { content }
        </PreactTransitionGroup>
        <Music isMuted={this.state.isMuted}/>
      </div>
    );
  }
}

App.defaultProps = {
  // Artificially inflate preload time so
  // we can see it for demo purposes
  fakePreloadTime: 500
};

module.exports = App;
